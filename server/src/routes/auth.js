import { createHmac, timingSafeEqual } from "crypto";
import { supabase } from "../db.js";
import { transporter } from "../services/mailer.js";

function generateDeleteToken(userId) {
  const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
  const payload = Buffer.from(JSON.stringify({ userId, expiry })).toString("base64url");
  const sig = createHmac("sha256", process.env.ADMIN_SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyDeleteToken(token) {
  const dotIndex = (token || "").lastIndexOf(".");
  if (dotIndex === -1) return null;
  const payload = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  if (!payload || !sig) return null;
  const expectedSig = createHmac("sha256", process.env.ADMIN_SECRET).update(payload).digest("hex");
  if (sig.length !== expectedSig.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  const { userId, expiry } = JSON.parse(Buffer.from(payload, "base64url").toString());
  if (Date.now() > expiry) return null;
  return userId;
}

export async function authRoutes(fastify) {
  // POST /api/auth/signup
  fastify.post("/api/auth/signup", { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const { email, password, name } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ error: "Email and password are required" });
    }

    if (password.length < 8) {
      return reply.code(400).send({ error: "Password must be at least 8 characters" });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: name || "" },
    });

    if (error) {
      return reply.code(400).send({ error: error.message });
    }

    // Sign them in immediately
    const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return reply.code(400).send({ error: signInError.message });
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
      },
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
    };
  });

  // POST /api/auth/signin
  fastify.post("/api/auth/signin", { config: { rateLimit: { max: 10, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return reply.code(400).send({ error: error.message });
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
      },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  });

  // POST /api/auth/refresh
  fastify.post("/api/auth/refresh", async (request, reply) => {
    const { refresh_token } = request.body;

    if (!refresh_token) {
      return reply.code(400).send({ error: "Refresh token required" });
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error) {
      return reply.code(401).send({ error: error.message });
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
      },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  });

  // POST /api/auth/forgot-password — send password reset email
  fastify.post("/api/auth/forgot-password", { config: { rateLimit: { max: 3, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const { email } = request.body;

    if (!email) {
      return reply.code(400).send({ error: "Email is required" });
    }

    const origin = request.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
    const [{ error }] = await Promise.all([
      supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` }),
      new Promise((resolve) => setTimeout(resolve, 300)),
    ]);

    if (error) {
      fastify.log.warn("forgot-password error (not revealed to client): " + error.message);
    }

    // Always return success — don't reveal whether the email exists
    return { success: true };
  });

  // POST /api/auth/reset-password — set new password
  // Accepts either token_hash (PKCE flow) or access_token (implicit flow from URL hash)
  fastify.post("/api/auth/reset-password", { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const { token_hash, access_token, new_password } = request.body;

    if ((!token_hash && !access_token) || !new_password) {
      return reply.code(400).send({ error: "Token and new_password are required" });
    }

    if (new_password.length < 8) {
      return reply.code(400).send({ error: "Password must be at least 8 characters" });
    }

    let userId;

    if (token_hash) {
      // PKCE flow
      const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: "recovery" });
      if (error || !data?.user) {
        return reply.code(400).send({ error: "Invalid or expired reset link" });
      }
      userId = data.user.id;
    } else {
      // Implicit flow — access_token came from the URL hash fragment
      const { data, error } = await supabase.auth.getUser(access_token);
      if (error || !data?.user) {
        return reply.code(400).send({ error: "Invalid or expired reset link" });
      }
      userId = data.user.id;
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { password: new_password }
    );

    if (updateError) {
      return reply.code(400).send({ error: updateError.message });
    }

    return { success: true };
  });

  // POST /api/auth/request-delete — send confirmation email before deleting account
  fastify.post("/api/auth/request-delete", { config: { rateLimit: { max: 3, timeWindow: "1 hour" } } }, async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) return reply.code(401).send({ error: "Not authenticated" });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return reply.code(401).send({ error: "Invalid token" });

    const deleteToken = generateDeleteToken(data.user.id);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const confirmUrl = `${frontendUrl}/confirm-delete?token=${deleteToken}`;

    await transporter.sendMail({
      from: `"CNB Cards" <${process.env.GMAIL_USER}>`,
      to: data.user.email,
      subject: "Confirm account deletion — CNB Cards",
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff;">
          <h2 style="color:#111111;font-size:20px;margin-bottom:8px;">Delete your account</h2>
          <p style="color:#4B5563;font-size:15px;line-height:1.6;">
            We received a request to permanently delete your CNB Cards account and all associated data.
          </p>
          <p style="color:#4B5563;font-size:15px;line-height:1.6;">
            If you made this request, click the button below to confirm. This link expires in <strong>1 hour</strong>.
          </p>
          <a href="${confirmUrl}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#E10600;color:#ffffff;font-weight:600;font-size:15px;border-radius:8px;text-decoration:none;">
            Confirm account deletion
          </a>
          <p style="color:#9CA3AF;font-size:13px;">
            If you did not request this, you can safely ignore this email. Your account will not be deleted.
          </p>
        </div>
      `,
    });

    return { success: true };
  });

  // DELETE /api/auth/confirm-delete — verify token and permanently delete account
  fastify.delete("/api/auth/confirm-delete", async (request, reply) => {
    const { token } = request.query;
    const userId = verifyDeleteToken(token);

    if (!userId) {
      return reply.code(400).send({ error: "Invalid or expired link" });
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return reply.code(400).send({ error: error.message });

    return { success: true };
  });

  // GET /api/auth/me — get current user from access token
  fastify.get("/api/auth/me", async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return reply.code(401).send({ error: "Not authenticated" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return reply.code(401).send({ error: error.message });
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
      },
    };
  });
}
