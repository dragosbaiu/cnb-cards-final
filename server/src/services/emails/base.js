// ─── CNB Cards – Email Base Layout ───────────────────────────────────────────
// Inline-CSS + table layout for maximum email client compatibility
// (Gmail, Outlook, Apple Mail, Yahoo, etc.)

const COLORS = {
  accent:      '#E10600',
  accentDark:  '#B30500',
  bgPrimary:   '#FFFFFF',
  bgSecondary: '#F8F9FA',
  bgDark:      '#111111',
  textHeading: '#111111',
  textBody:    '#4B5563',
  textMuted:   '#9CA3AF',
  border:      '#E5E7EB',
  white:       '#FFFFFF',
};

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

/**
 * Wraps bilingual content in the CNB Cards email shell.
 *
 * @param {object} opts
 * @param {string} opts.previewText   - Short preview shown in inbox (hidden in body)
 * @param {string} opts.contentEN     - HTML for the English section
 * @param {string} opts.contentRO     - HTML for the Romanian section
 * @returns {string} Full HTML email string
 */
function buildEmail({ previewText = '', contentEN = '', contentRO = '' }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <title>CNB Cards</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { padding: 0; }
    img { border: 0; display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; padding: 12px !important; }
      .email-card { border-radius: 0 !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; }
      .divider-cell { padding: 28px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgSecondary};font-family:${FONT_STACK};">

  <!-- Preview text (hidden) -->
  <div style="display:none;font-size:1px;color:${COLORS.bgSecondary};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${escapeHtml(previewText)}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
  </div>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:${COLORS.bgSecondary};padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Email card (600px max) -->
        <table class="email-card" width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:600px;background-color:${COLORS.bgPrimary};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.border};">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background-color:${COLORS.bgDark};padding:28px 40px;text-align:center;">
              <!-- Red top bar -->
              <div style="width:40px;height:3px;background-color:${COLORS.accent};margin:0 auto 20px auto;border-radius:2px;"></div>
              <!-- Brand -->
              <span style="font-family:${FONT_STACK};font-size:22px;font-weight:700;letter-spacing:0.04em;color:${COLORS.white};">
                CNB <span style="color:${COLORS.accent};">CARDS</span>
              </span>
            </td>
          </tr>

          <!-- ── ENGLISH CONTENT ── -->
          <tr>
            <td style="padding:40px 40px 32px 40px;">
              ${contentEN}
            </td>
          </tr>

          <!-- ── LANGUAGE DIVIDER ── -->
          <tr>
            <td class="divider-cell" style="padding:0 40px 32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="border-top:1px solid ${COLORS.border};padding-top:28px;">
                    <p style="margin:0 0 20px 0;font-family:${FONT_STACK};font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${COLORS.textMuted};text-align:center;">
                      🇷🇴 &nbsp;Versiunea în Română
                    </p>
                    ${contentRO}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background-color:${COLORS.bgSecondary};border-top:1px solid ${COLORS.border};padding:28px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;font-family:${FONT_STACK};font-size:12px;color:${COLORS.textMuted};">
                © ${new Date().getFullYear()} CNB Cards. All rights reserved.
              </p>
              <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:${COLORS.textMuted};">
                You received this email because you have an account with CNB Cards.
              </p>
            </td>
          </tr>

        </table>
        <!-- /email card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ─── Shared UI building blocks ────────────────────────────────────────────────

/** Section heading */
function heading(text) {
  return `<h1 style="margin:0 0 8px 0;font-family:${FONT_STACK};font-size:24px;font-weight:700;color:${COLORS.textHeading};line-height:1.3;">${text}</h1>`;
}

/** Subheading */
function subheading(text) {
  return `<h2 style="margin:0 0 16px 0;font-family:${FONT_STACK};font-size:16px;font-weight:600;color:${COLORS.textHeading};">${text}</h2>`;
}

/** Body paragraph */
function paragraph(text, opts = {}) {
  const color = opts.muted ? COLORS.textMuted : COLORS.textBody;
  const size  = opts.small ? '13px' : '15px';
  return `<p style="margin:0 0 16px 0;font-family:${FONT_STACK};font-size:${size};line-height:1.7;color:${color};">${text}</p>`;
}

/** Red accent CTA button */
function button(text, href) {
  return `
  <table cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;">
    <tr>
      <td style="border-radius:8px;background-color:${COLORS.accent};">
        <a href="${href}" class="btn" target="_blank"
          style="display:inline-block;padding:14px 32px;font-family:${FONT_STACK};font-size:14px;font-weight:600;color:${COLORS.white};letter-spacing:0.02em;border-radius:8px;text-decoration:none;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

/** Highlighted info box */
function infoBox(html) {
  return `<div style="background-color:${COLORS.bgSecondary};border-left:3px solid ${COLORS.accent};border-radius:6px;padding:16px 20px;margin:20px 0;">
    <p style="margin:0;font-family:${FONT_STACK};font-size:14px;line-height:1.6;color:${COLORS.textBody};">${html}</p>
  </div>`;
}

/** Order line item row */
function orderItem({ name, quantity, price }) {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};font-family:${FONT_STACK};font-size:14px;color:${COLORS.textBody};">
      ${escapeHtml(name)}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};font-family:${FONT_STACK};font-size:14px;color:${COLORS.textBody};text-align:center;">
      ×${quantity}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};font-family:${FONT_STACK};font-size:14px;font-weight:600;color:${COLORS.textHeading};text-align:right;">
      ${escapeHtml(price)}
    </td>
  </tr>`;
}

/** Order summary table */
function orderTable(items = [], { subtotal, shipping, total } = {}) {
  const rows = items.map(orderItem).join('');
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:20px 0;">
    <thead>
      <tr>
        <th style="padding:8px 0;border-bottom:2px solid ${COLORS.border};font-family:${FONT_STACK};font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.textMuted};text-align:left;">Product</th>
        <th style="padding:8px 0;border-bottom:2px solid ${COLORS.border};font-family:${FONT_STACK};font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.textMuted};text-align:center;">Qty</th>
        <th style="padding:8px 0;border-bottom:2px solid ${COLORS.border};font-family:${FONT_STACK};font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.textMuted};text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="2" style="padding:10px 0 4px;font-family:${FONT_STACK};font-size:13px;color:${COLORS.textMuted};">Subtotal</td>
        <td style="padding:10px 0 4px;font-family:${FONT_STACK};font-size:13px;color:${COLORS.textBody};text-align:right;">${escapeHtml(subtotal)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:4px 0;font-family:${FONT_STACK};font-size:13px;color:${COLORS.textMuted};">Shipping</td>
        <td style="padding:4px 0;font-family:${FONT_STACK};font-size:13px;color:${COLORS.textBody};text-align:right;">${escapeHtml(shipping)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:12px 0 0;font-family:${FONT_STACK};font-size:15px;font-weight:700;color:${COLORS.textHeading};border-top:2px solid ${COLORS.border};">Total</td>
        <td style="padding:12px 0 0;font-family:${FONT_STACK};font-size:15px;font-weight:700;color:${COLORS.accent};text-align:right;border-top:2px solid ${COLORS.border};">${escapeHtml(total)}</td>
      </tr>
    </tfoot>
  </table>`;
}

/** Key–value detail row (e.g. Order # / Date) */
function detailRow(label, value) {
  return `
  <tr>
    <td style="padding:6px 0;font-family:${FONT_STACK};font-size:13px;color:${COLORS.textMuted};width:40%;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;font-family:${FONT_STACK};font-size:13px;font-weight:600;color:${COLORS.textHeading};">${escapeHtml(value)}</td>
  </tr>`;
}

/** Wrapper for a key-value details block */
function detailsTable(rows = []) {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:16px 0 24px 0;">
    ${rows.map(([l, v]) => detailRow(l, v)).join('')}
  </table>`;
}

/** Red label badge */
function badge(text) {
  return `<span style="display:inline-block;background-color:${COLORS.accent};color:${COLORS.white};font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">${text}</span>`;
}

/** Spacer */
function spacer(px = 16) {
  return `<div style="height:${px}px;line-height:${px}px;">&nbsp;</div>`;
}

/** Escape HTML special characters */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = {
  buildEmail,
  heading, subheading, paragraph, button,
  infoBox, orderTable, detailsTable,
  badge, spacer, escapeHtml, COLORS,
};
