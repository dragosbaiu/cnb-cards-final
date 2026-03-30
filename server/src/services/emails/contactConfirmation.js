// ─── CNB Cards – Contact Form Confirmation Email ──────────────────────────────
const {
  buildEmail, heading, paragraph, infoBox,
  badge, spacer, escapeHtml,
} = require('./base');

/**
 * @param {object} opts
 * @param {string} opts.firstName
 * @param {string} opts.subject    - The subject the user submitted
 * @param {string} opts.message    - The message body (truncated if long)
 * @param {number} [opts.replyWithinHours] - SLA promise (default 48)
 */
function contactConfirmationEmail({
  firstName = 'there',
  subject = '',
  message = '',
  replyWithinHours = 48,
}) {
  // Truncate long messages for the preview copy
  const preview = message.length > 200 ? message.slice(0, 197) + '…' : message;

  const contentEN = `
    ${badge('Message Received')}
    ${spacer(16)}
    ${heading(`We got your message, ${firstName}!`)}
    ${paragraph('Thanks for reaching out. We\'ve received your inquiry and will get back to you within <strong>' + replyWithinHours + ' hours</strong>.')}

    ${infoBox(`
      <strong>📩 Your message:</strong><br/><br/>
      <em style="color:#4B5563;">"${escapeHtml(preview)}"</em>
    `)}

    ${paragraph('While you wait, feel free to browse our shop — new singles are added regularly.', { muted: true })}
    ${paragraph('— The CNB Cards Team', { muted: true, small: true })}
  `;

  const contentRO = `
    ${heading(`Am primit mesajul tău, ${firstName}!`)}
    ${paragraph('Mulțumim că ne-ai contactat. Am primit întrebarea ta și îți vom răspunde în cel mult <strong>' + replyWithinHours + ' de ore</strong>.')}

    ${infoBox(`
      <strong>📩 Mesajul tău:</strong><br/><br/>
      <em style="color:#4B5563;">"${escapeHtml(preview)}"</em>
    `)}

    ${paragraph('Între timp, poți naviga prin magazinul nostru — single-uri noi sunt adăugate în mod regulat.', { muted: true })}
    ${paragraph('— Echipa CNB Cards', { muted: true, small: true })}
  `;

  return buildEmail({
    previewText: `We received your message — we'll be in touch within ${replyWithinHours} hours.`,
    contentEN,
    contentRO,
  });
}

module.exports = { contactConfirmationEmail };
