// ─── CNB Cards – Welcome Email ────────────────────────────────────────────────
const {
  buildEmail, heading, paragraph, button,
  infoBox, badge, spacer,
} = require('./base');

/**
 * @param {object} opts
 * @param {string} opts.firstName   - User's first name
 * @param {string} opts.shopUrl     - Full URL to the shop
 */
function welcomeEmail({ firstName = 'there', shopUrl = 'https://cnbcards.com/shop/singles' }) {
  const contentEN = `
    ${badge('Welcome')}
    ${spacer(16)}
    ${heading(`Welcome to CNB Cards, ${firstName}! 🏎️`)}
    ${paragraph('Your account is ready. You\'re now part of a community of Formula 1 collectors who are serious about their cards.')}
    ${paragraph('Here\'s what you can do right now:')}
    ${infoBox(`
      <strong>🃏 Browse Singles</strong> — Explore our full catalog of F1 trading cards from every season and team.<br/><br/>
      <strong>🛍️ Shop Sealed Boxes</strong> — Coming soon. Be the first to know when they drop.<br/><br/>
      <strong>📦 Track Orders</strong> — Once you place an order, you can follow it right from your account.
    `)}
    ${button('Start Shopping', shopUrl)}
    ${paragraph('If you have any questions, reply to this email or visit our contact page. We\'re always happy to help.', { muted: true })}
    ${paragraph('— The CNB Cards Team', { muted: true, small: true })}
  `;

  const contentRO = `
    ${heading(`Bine ai venit la CNB Cards, ${firstName}! 🏎️`)}
    ${paragraph('Contul tău este gata. Ești acum parte dintr-o comunitate de colecționari de Formula 1 care sunt pasionați de carduri.')}
    ${paragraph('Iată ce poți face chiar acum:')}
    ${infoBox(`
      <strong>🃏 Single-uri</strong> — Explorează catalogul complet de carduri F1 din fiecare sezon și echipă.<br/><br/>
      <strong>🛍️ Cutii Sigilate</strong> — În curând. Vei fi primul care află când sunt disponibile.<br/><br/>
      <strong>📦 Urmărire Comenzi</strong> — Odată plasată o comandă, o poți urmări direct din contul tău.
    `)}
    ${button('Începe să Cumperi', shopUrl)}
    ${paragraph('Dacă ai întrebări, răspunde la acest email sau vizitează pagina noastră de contact. Suntem mereu bucuroși să te ajutăm.', { muted: true })}
    ${paragraph('— Echipa CNB Cards', { muted: true, small: true })}
  `;

  return buildEmail({
    previewText: `Welcome to CNB Cards, ${firstName}! Your account is ready.`,
    contentEN,
    contentRO,
  });
}

module.exports = { welcomeEmail };
