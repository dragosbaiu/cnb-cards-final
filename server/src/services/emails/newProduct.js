// ─── CNB Cards – New Product Announcement Email ───────────────────────────────
const {
  buildEmail, heading, subheading, paragraph,
  button, infoBox, badge, spacer, COLORS, escapeHtml,
} = require('./base');

/**
 * @param {object}   opts
 * @param {string}   opts.firstName
 * @param {string}   opts.productName    - e.g. "2024 Topps Chrome Formula 1"
 * @param {string}   opts.productTeaser  - One-line description EN
 * @param {string}   opts.productTeaserRO - One-line description RO
 * @param {string}   opts.price          - e.g. "€24.99"
 * @param {string}   opts.productUrl     - Link to the product page
 * @param {string}   [opts.imageUrl]     - Optional product image URL (Supabase Storage URL)
 * @param {string[]} [opts.highlights]   - EN bullet points (up to 4)
 * @param {string[]} [opts.highlightsRO] - RO bullet points (up to 4)
 * @param {boolean}  [opts.isLimitedRun] - Show "Limited Stock" badge
 */
function newProductEmail({
  firstName = 'there',
  productName = '',
  productTeaser = '',
  productTeaserRO = '',
  price = '',
  productUrl = 'https://cnbcards.com/shop/singles',
  imageUrl = null,
  highlights = [],
  highlightsRO = [],
  isLimitedRun = false,
}) {
  const imageBlock = imageUrl
    ? `<img src="${imageUrl}" alt="${escapeHtml(productName)}"
        width="520" style="width:100%;max-width:520px;border-radius:8px;margin:16px 0;border:1px solid ${COLORS.border};" />`
    : '';

  const limitedBadge = isLimitedRun
    ? `&nbsp;&nbsp;<span style="display:inline-block;background-color:#FEF3C7;color:#92400E;font-size:11px;font-weight:700;letter-spacing:0.06em;padding:2px 8px;border-radius:4px;">LIMITED STOCK</span>`
    : '';

  const limitedBadgeRO = isLimitedRun
    ? `&nbsp;&nbsp;<span style="display:inline-block;background-color:#FEF3C7;color:#92400E;font-size:11px;font-weight:700;letter-spacing:0.06em;padding:2px 8px;border-radius:4px;">STOC LIMITAT</span>`
    : '';

  const bulletList = (items) => items.length
    ? `<ul style="margin:12px 0;padding-left:20px;">
        ${items.map(item => `<li style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;font-size:14px;color:#4B5563;line-height:1.7;margin-bottom:4px;">${item}</li>`).join('')}
       </ul>`
    : '';

  const contentEN = `
    ${badge('New Arrival')}
    ${spacer(16)}
    ${heading(`Something new just dropped, ${firstName}! 🏁`)}
    ${paragraph('We\'ve just added a new product to the CNB Cards catalog. Be one of the first to grab it.')}

    ${imageBlock}

    <p style="margin:0 0 4px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:700;color:#111111;">
      ${escapeHtml(productName)}${limitedBadge}
    </p>
    <p style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;font-size:15px;color:#4B5563;">${escapeHtml(productTeaser)}</p>

    <p style="margin:0 0 20px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;color:#E10600;">${escapeHtml(price)}</p>

    ${highlights.length ? subheading('Highlights') + bulletList(highlights) : ''}

    ${button('View Product', productUrl)}

    ${infoBox('Stock on single cards moves fast. Don\'t wait too long if you want to secure yours.')}

    ${paragraph('— The CNB Cards Team', { muted: true, small: true })}
  `;

  const contentRO = `
    ${heading(`Ceva nou a apărut, ${firstName}! 🏁`)}
    ${paragraph('Tocmai am adăugat un produs nou în catalogul CNB Cards. Fii printre primii care îl obțin.')}

    ${imageBlock}

    <p style="margin:0 0 4px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:700;color:#111111;">
      ${escapeHtml(productName)}${limitedBadgeRO}
    </p>
    <p style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;font-size:15px;color:#4B5563;">${escapeHtml(productTeaserRO || productTeaser)}</p>

    <p style="margin:0 0 20px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;color:#E10600;">${escapeHtml(price)}</p>

    ${highlightsRO.length ? subheading('Puncte Cheie') + bulletList(highlightsRO) : ''}

    ${button('Vezi Produsul', productUrl)}

    ${infoBox('Stocul pe carduri individuale se epuizează rapid. Nu aștepta prea mult dacă vrei să îl rezervi.')}

    ${paragraph('— Echipa CNB Cards', { muted: true, small: true })}
  `;

  return buildEmail({
    previewText: `New arrival: ${productName} — ${price}`,
    contentEN,
    contentRO,
  });
}

module.exports = { newProductEmail };
