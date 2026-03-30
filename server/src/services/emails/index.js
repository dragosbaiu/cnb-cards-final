// ─── CNB Cards – Email Templates Index ───────────────────────────────────────
//
// Usage in your Fastify route / service:
//
//   const { welcomeEmail } = require('./emails');
//
//   await transporter.sendMail({
//     from:    '"CNB Cards" <noreply@cnbcards.com>',
//     to:      user.email,
//     subject: 'Welcome to CNB Cards!',
//     html:    welcomeEmail({ firstName: user.firstName, shopUrl: '...' }),
//   });
//

const { welcomeEmail }             = require('./welcome');
const { orderReceiptEmail }        = require('./orderReceipt');
const { orderShippedEmail }        = require('./orderShipped');
const { passwordResetEmail }       = require('./passwordReset');
const { newProductEmail }          = require('./newProduct');
const { contactConfirmationEmail } = require('./contactConfirmation');

module.exports = {
  welcomeEmail,
  orderReceiptEmail,
  orderShippedEmail,
  passwordResetEmail,
  newProductEmail,
  contactConfirmationEmail,
};
