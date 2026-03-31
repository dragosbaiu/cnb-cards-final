import { supabase } from "../db.js";
import { transporter } from "../services/mailer.js";

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const INTERNAL_EMAIL = process.env.INTERNAL_EMAIL;

export async function contactRoutes(fastify) {
  fastify.post("/api/contact", { config: { rateLimit: { max: 5, timeWindow: "1 hour" } } }, async (request, reply) => {
    const { name, email, subject, message } = request.body;

    if (!name || !email || !message) {
      return reply.code(400).send({ error: "Name, email and message are required" });
    }

    // Save to DB
    const { error } = await supabase
      .from("contact_submissions")
      .insert({ name, email, subject: subject || "", message });

    if (error) {
      return reply.code(500).send({ error: "Failed to save message" });
    }

    // Notify owner — don't block the response
    transporter.sendMail({
      from: `"CNB Cards" <${process.env.GMAIL_USER}>`,
      to: INTERNAL_EMAIL,
      subject: `New Contact Message — ${subject || "No subject"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #E5E7EB;border-radius:8px;">
          <h2 style="margin:0 0 16px;color:#111111;">New Contact Message</h2>
          <p style="margin:0 0 8px;color:#4B5563;font-size:14px;"><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
          <p style="margin:0 0 8px;color:#4B5563;font-size:14px;"><strong>Subject:</strong> ${escapeHtml(subject) || "—"}</p>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:16px 0;">
          <p style="color:#4B5563;font-size:14px;white-space:pre-line;">${escapeHtml(message)}</p>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:16px 0;">
          <p style="color:#9CA3AF;font-size:12px;">Reply directly to: ${escapeHtml(email)}</p>
        </div>
      `,
      replyTo: email,
    }).catch((err) => fastify.log.error("Contact email failed: " + err.message));

    return { success: true };
  });
}
