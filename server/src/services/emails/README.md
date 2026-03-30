# CNB Cards – Email Templates

All templates live in `server/src/services/emails/`.
They are plain JS functions that return an HTML string — no extra packages needed.

---

## Setup (Nodemailer)

```js
// server/src/services/emailService.js
const nodemailer = require('nodemailer');
const {
  welcomeEmail,
  orderReceiptEmail,
  orderShippedEmail,
  passwordResetEmail,
  newProductEmail,
  contactConfirmationEmail,
} = require('./emails');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = '"CNB Cards" <noreply@cnbcards.com>';

module.exports = {
  sendWelcome: (user) =>
    transporter.sendMail({
      from: FROM, to: user.email,
      subject: 'Welcome to CNB Cards! 🏎️',
      html: welcomeEmail({ firstName: user.firstName }),
    }),

  sendOrderReceipt: (user, order) =>
    transporter.sendMail({
      from: FROM, to: user.email,
      subject: `Order ${order.number} confirmed — CNB Cards`,
      html: orderReceiptEmail({
        firstName:       user.firstName,
        orderNumber:     order.number,
        orderDate:       order.date,
        items:           order.items,      // [{ name, quantity, price }]
        subtotal:        order.subtotal,
        shipping:        order.shipping,
        total:           order.total,
        shippingName:    order.shippingName,
        shippingAddress: order.shippingAddress,
        orderUrl:        `https://cnbcards.com/orders/${order.id}`,
      }),
    }),

  sendOrderShipped: (user, shipment) =>
    transporter.sendMail({
      from: FROM, to: user.email,
      subject: `Your CNB Cards order is on its way! 🚀`,
      html: orderShippedEmail({
        firstName:      user.firstName,
        orderNumber:    shipment.orderNumber,
        carrier:        shipment.carrier,
        trackingNumber: shipment.trackingNumber,
        trackingUrl:    shipment.trackingUrl,
        estimatedDate:  shipment.estimatedDate,
      }),
    }),

  sendPasswordReset: (user, resetUrl) =>
    transporter.sendMail({
      from: FROM, to: user.email,
      subject: 'Reset your CNB Cards password',
      html: passwordResetEmail({
        firstName:     user.firstName,
        resetUrl,
        expiresInMins: 60,
      }),
    }),

  sendNewProduct: (recipients, product) =>
    Promise.all(recipients.map(user =>
      transporter.sendMail({
        from: FROM, to: user.email,
        subject: `New arrival: ${product.name} 🏁`,
        html: newProductEmail({
          firstName:       user.firstName,
          productName:     product.name,
          productTeaser:   product.teaserEN,
          productTeaserRO: product.teaserRO,
          price:           product.price,
          productUrl:      product.url,
          imageUrl:        product.imageUrl,   // Supabase Storage public URL
          highlights:      product.highlightsEN,
          highlightsRO:    product.highlightsRO,
          isLimitedRun:    product.isLimitedRun,
        }),
      })
    )),

  sendContactConfirmation: (user, inquiry) =>
    transporter.sendMail({
      from: FROM, to: user.email,
      subject: 'We received your message — CNB Cards',
      html: contactConfirmationEmail({
        firstName:        user.firstName,
        subject:          inquiry.subject,
        message:          inquiry.message,
        replyWithinHours: 48,
      }),
    }),
};
```

---

## Template Parameters Reference

### `welcomeEmail({ firstName, shopUrl })`
| Param | Type | Description |
|-------|------|-------------|
| firstName | string | User's first name |
| shopUrl | string | Full URL to the shop |

### `orderReceiptEmail({ firstName, orderNumber, orderDate, items, subtotal, shipping, total, shippingName, shippingAddress, orderUrl })`
| Param | Type | Description |
|-------|------|-------------|
| items | `[{ name, quantity, price }]` | Line items — price as string e.g. `"€12.00"` |
| subtotal / shipping / total | string | e.g. `"€47.00"` |

### `orderShippedEmail({ firstName, orderNumber, carrier, trackingNumber, trackingUrl, estimatedDate })`
| Param | Type | Description |
|-------|------|-------------|
| trackingUrl | string | Full URL to carrier tracking page |
| estimatedDate | string | e.g. `"1–3 April 2026"` (optional) |

### `passwordResetEmail({ firstName, resetUrl, expiresInMins })`
| Param | Type | Description |
|-------|------|-------------|
| resetUrl | string | Signed URL from Supabase Auth |
| expiresInMins | number | Default: 60 |

### `newProductEmail({ firstName, productName, productTeaser, productTeaserRO, price, productUrl, imageUrl, highlights, highlightsRO, isLimitedRun })`
| Param | Type | Description |
|-------|------|-------------|
| imageUrl | string | Supabase Storage public URL (optional) |
| highlights / highlightsRO | string[] | Up to 4 bullet points per language |
| isLimitedRun | boolean | Shows a "Limited Stock" badge |

### `contactConfirmationEmail({ firstName, subject, message, replyWithinHours })`
| Param | Type | Description |
|-------|------|-------------|
| message | string | Message body (auto-truncated at 200 chars for preview) |
| replyWithinHours | number | Default: 48 |

---

## Design Notes

- All emails are **bilingual** — English section first, Romanian below a divider.
- Colors, fonts, and header match the CNB Cards website exactly.
- All HTML uses **inline CSS** for maximum email client compatibility.
- Safe to use with Gmail, Outlook, Apple Mail, Yahoo Mail.
