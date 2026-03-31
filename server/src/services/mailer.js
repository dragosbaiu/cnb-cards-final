import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ from, to, subject, html, replyTo }) {
  const { error } = await resend.emails.send({
    from: from || "CNB Cards <noreply@cnbcards.ro>",
    to,
    subject,
    html,
    ...(replyTo ? { reply_to: replyTo } : {}),
  });
  if (error) throw new Error(error.message);
}
