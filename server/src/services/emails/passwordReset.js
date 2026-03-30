// ─── CNB Cards – Password Reset Email ────────────────────────────────────────
const {
  buildEmail, heading, paragraph, button,
  infoBox, badge, spacer,
} = require('./base');

/**
 * @param {object} opts
 * @param {string} opts.firstName
 * @param {string} opts.resetUrl      - Signed password-reset URL (from Supabase Auth)
 * @param {number} opts.expiresInMins - How long the link is valid (default 60)
 */
function passwordResetEmail({
  firstName = 'there',
  resetUrl = '#',
  expiresInMins = 60,
}) {
  const contentEN = `
    ${badge('Password Reset')}
    ${spacer(16)}
    ${heading(`Reset your password`)}
    ${paragraph(`Hi ${firstName}, we received a request to reset the password for your CNB Cards account.`)}
    ${paragraph('Click the button below to choose a new password. This link will expire in <strong>' + expiresInMins + ' minutes</strong>.')}

    ${button('Reset Password', resetUrl)}

    ${infoBox(`
      <strong>⚠️ Didn't request this?</strong><br/>
      If you didn't ask to reset your password, you can safely ignore this email.
      Your password will remain unchanged. If you're concerned about your account security,
      please contact us immediately.
    `)}

    ${paragraph('For security, this link can only be used once.', { muted: true })}
    ${paragraph('— The CNB Cards Team', { muted: true, small: true })}
  `;

  const contentRO = `
    ${heading(`Resetează-ți parola`)}
    ${paragraph(`Salut ${firstName}, am primit o solicitare de resetare a parolei pentru contul tău CNB Cards.`)}
    ${paragraph('Apasă butonul de mai jos pentru a alege o nouă parolă. Acest link va expira în <strong>' + expiresInMins + ' de minute</strong>.')}

    ${button('Resetează Parola', resetUrl)}

    ${infoBox(`
      <strong>⚠️ Nu ai solicitat asta?</strong><br/>
      Dacă nu ai cerut resetarea parolei, poți ignora cu siguranță acest email.
      Parola ta va rămâne neschimbată. Dacă ești îngrijorat de securitatea contului,
      te rugăm să ne contactezi imediat.
    `)}

    ${paragraph('Din motive de securitate, acest link poate fi folosit o singură dată.', { muted: true })}
    ${paragraph('— Echipa CNB Cards', { muted: true, small: true })}
  `;

  return buildEmail({
    previewText: 'Reset your CNB Cards password — link expires in ' + expiresInMins + ' minutes.',
    contentEN,
    contentRO,
  });
}

module.exports = { passwordResetEmail };
