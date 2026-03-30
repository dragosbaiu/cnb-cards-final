import { supabase } from "../db.js";

export async function authRoutes(fastify) {
  // POST /api/auth/signup
  fastify.post("/api/auth/signup", async (request, reply) => {
    const { email, password, name } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ error: "Email and password are required" });
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
  fastify.post("/api/auth/signin", async (request, reply) => {
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
  fastify.post("/api/auth/forgot-password", async (request, reply) => {
    const { email } = request.body;

    if (!email) {
      return reply.code(400).send({ error: "Email is required" });
    }

    const origin = request.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      return reply.code(400).send({ error: error.message });
    }

    // Always return success — don't reveal whether the email exists
    return { success: true };
  });

  // POST /api/auth/reset-password — set new password
  // Accepts either token_hash (PKCE flow) or access_token (implicit flow from URL hash)
  fastify.post("/api/auth/reset-password", async (request, reply) => {
    const { token_hash, access_token, new_password } = request.body;

    if ((!token_hash && !access_token) || !new_password) {
      return reply.code(400).send({ error: "Token and new_password are required" });
    }

    if (new_password.length < 6) {
      return reply.code(400).send({ error: "Password must be at least 6 characters" });
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
