// ─── CNB Cards – Order Shipped Email ─────────────────────────────────────────
const {
  buildEmail, heading, paragraph, button,
  infoBox, detailsTable, badge, spacer,
} = require('./base');

/**
 * @param {object} opts
 * @param {string} opts.firstName
 * @param {string} opts.orderNumber     - e.g. "CNB-10042"
 * @param {string} opts.carrier         - e.g. "DPD", "Fan Courier"
 * @param {string} opts.trackingNumber  - e.g. "1Z999AA10123456784"
 * @param {string} opts.trackingUrl     - Full tracking URL
 * @param {string} opts.estimatedDate   - e.g. "1–3 April 2026"
 */
function orderShippedEmail({
  firstName = 'there',
  orderNumber = '',
  carrier = '',
  trackingNumber = '',
  trackingUrl = '#',
  estimatedDate = '',
}) {
  const contentEN = `
    ${badge('Shipped')}
    ${spacer(16)}
    ${heading(`Your cards are on their way, ${firstName}! 🚀`)}
    ${paragraph('Great news — your order has been packed and handed over to the carrier. Here\'s everything you need to track it:')}

    ${detailsTable([
      ['Order number',      orderNumber],
      ['Carrier',           carrier],
      ['Tracking number',   trackingNumber],
      ...(estimatedDate ? [['Estimated delivery', estimatedDate]] : []),
    ])}

    ${button('Track My Package', trackingUrl)}

    ${infoBox(`
      <strong>📬 Delivery tips</strong><br/>
      Tracking updates can take up to <strong>24 hours</strong> to appear after shipping.
      If you're not home at delivery time, the carrier will usually leave a notification
      and attempt redelivery or hold the parcel at a local pickup point.
    `)}

    ${paragraph('If anything looks off with your tracking, just reply to this email.', { muted: true })}
    ${paragraph('— The CNB Cards Team', { muted: true, small: true })}
  `;

  const contentRO = `
    ${heading(`Cardurile tale sunt pe drum, ${firstName}! 🚀`)}
    ${paragraph('Vești bune — comanda ta a fost ambalată și predată curierului. Iată tot ce ai nevoie pentru a o urmări:')}

    ${detailsTable([
      ['Număr comandă',    orderNumber],
      ['Curier',           carrier],
      ['Număr urmărire',   trackingNumber],
      ...(estimatedDate ? [['Livrare estimată', estimatedDate]] : []),
    ])}

    ${button('Urmărește Coletul', trackingUrl)}

    ${infoBox(`
      <strong>📬 Sfaturi pentru livrare</strong><br/>
      Actualizările de urmărire pot apărea cu până la <strong>24 de ore</strong> întârziere după expediere.
      Dacă nu ești acasă la livrare, curierii lasă de obicei un aviz și revin
      sau depun coletul la un punct de ridicare local.
    `)}

    ${paragraph('Dacă ceva pare în neregulă cu urmărirea, răspunde direct la acest email.', { muted: true })}
    ${paragraph('— Echipa CNB Cards', { muted: true, small: true })}
  `;

  return buildEmail({
    previewText: `Your CNB Cards order ${orderNumber} is on its way!`,
    contentEN,
    contentRO,
  });
}

module.exports = { orderShippedEmail };
