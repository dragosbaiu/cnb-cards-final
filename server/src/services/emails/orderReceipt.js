// ─── CNB Cards – Order Receipt Email ─────────────────────────────────────────
const {
  buildEmail, heading, subheading, paragraph,
  button, infoBox, orderTable, detailsTable,
  badge, spacer,
} = require('./base');

/**
 * @param {object} opts
 * @param {string}   opts.firstName
 * @param {string}   opts.orderNumber   - e.g. "CNB-10042"
 * @param {string}   opts.orderDate     - e.g. "29 March 2026"
 * @param {Array}    opts.items         - [{ name, quantity, price }]
 * @param {string}   opts.subtotal      - e.g. "€42.00"
 * @param {string}   opts.shipping      - e.g. "€5.00"
 * @param {string}   opts.total         - e.g. "€47.00"
 * @param {string}   opts.shippingName
 * @param {string}   opts.shippingAddress
 * @param {string}   opts.orderUrl      - Link to order detail page
 */
function orderReceiptEmail({
  firstName = 'there',
  orderNumber = '',
  orderDate = '',
  items = [],
  subtotal = '€0.00',
  shipping = '€0.00',
  total = '€0.00',
  shippingName = '',
  shippingAddress = '',
  orderUrl = 'https://cnbcards.com',
}) {
  const contentEN = `
    ${badge('Order Confirmed')}
    ${spacer(16)}
    ${heading(`Thank you, ${firstName}! ✅`)}
    ${paragraph('Your order has been received and is being processed. You\'ll get another email when it ships.')}

    ${subheading('Order Summary')}
    ${detailsTable([
      ['Order number', orderNumber],
      ['Order date',   orderDate],
      ['Ship to',      shippingName ? `${shippingName} — ${shippingAddress}` : shippingAddress],
    ])}

    ${orderTable(items, { subtotal, shipping, total })}

    ${button('View Order', orderUrl)}

    ${infoBox(`
      <strong>📦 What happens next?</strong><br/>
      We'll carefully pack your cards and ship them within <strong>1–3 business days</strong>.
      You'll receive a tracking link as soon as your parcel is on its way.
    `)}

    ${paragraph('Questions about your order? Just reply to this email.', { muted: true })}
    ${paragraph('— The CNB Cards Team', { muted: true, small: true })}
  `;

  const contentRO = `
    ${heading(`Mulțumim, ${firstName}! ✅`)}
    ${paragraph('Comanda ta a fost primită și este în curs de procesare. Vei primi un alt email atunci când va fi expediată.')}

    ${subheading('Sumar Comandă')}
    ${detailsTable([
      ['Număr comandă', orderNumber],
      ['Data comenzii',  orderDate],
      ['Livrare la',     shippingName ? `${shippingName} — ${shippingAddress}` : shippingAddress],
    ])}

    ${orderTable(items, { subtotal, shipping, total })}

    ${button('Vezi Comanda', orderUrl)}

    ${infoBox(`
      <strong>📦 Ce urmează?</strong><br/>
      Vom împacheta cu grijă cardurile tale și le vom expedia în <strong>1–3 zile lucrătoare</strong>.
      Vei primi un link de urmărire imediat ce coletul este pe drum.
    `)}

    ${paragraph('Întrebări despre comandă? Răspunde direct la acest email.', { muted: true })}
    ${paragraph('— Echipa CNB Cards', { muted: true, small: true })}
  `;

  return buildEmail({
    previewText: `Order ${orderNumber} confirmed — thank you for your purchase!`,
    contentEN,
    contentRO,
  });
}

module.exports = { orderReceiptEmail };
