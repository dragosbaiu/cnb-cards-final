export function customerOrderEmail({ customerName, items, total, shippingAddress }) {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">
          <strong style="color:#111111;">${item.driver}</strong><br>
          <span style="color:#9CA3AF;font-size:13px;">${item.year} · ${item.set_name} · ${item.condition}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB;text-align:right;font-weight:bold;color:#111111;">
          €${Number(item.price).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  const addressBlock = shippingAddress
    ? `
      <p style="margin:0;color:#4B5563;font-size:14px;">
        ${shippingAddress.line1}${shippingAddress.line2 ? ", " + shippingAddress.line2 : ""}<br>
        ${shippingAddress.city}, ${shippingAddress.postal_code}<br>
        ${shippingAddress.country}
      </p>`
    : `<p style="color:#9CA3AF;font-size:14px;">Not provided</p>`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F8F9FA;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">

    <div style="background:#111111;padding:24px 32px;">
      <h1 style="margin:0;color:#FFFFFF;font-size:22px;letter-spacing:-0.5px;">CNB Cards</h1>
    </div>

    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;color:#111111;font-size:20px;">Order Confirmed!</h2>
      <p style="margin:0 0 24px;color:#4B5563;font-size:15px;">
        Hi ${customerName || "there"},<br>
        Thank you for your order. We'll get it packed and shipped as soon as possible.
      </p>

      <h3 style="margin:0 0 12px;color:#111111;font-size:15px;font-weight:600;">Order Summary</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${itemRows}
        <tr>
          <td style="padding:14px 0 0;font-weight:bold;color:#111111;">Total</td>
          <td style="padding:14px 0 0;text-align:right;font-weight:bold;color:#111111;">€${Number(total).toFixed(2)}</td>
        </tr>
      </table>

      <div style="margin-top:28px;padding-top:24px;border-top:1px solid #E5E7EB;">
        <h3 style="margin:0 0 10px;color:#111111;font-size:15px;font-weight:600;">Shipping To</h3>
        ${addressBlock}
      </div>

      <p style="margin:28px 0 0;color:#9CA3AF;font-size:13px;">
        Questions? Reply to this email and we'll get back to you.
      </p>
    </div>

    <div style="padding:16px 32px;background:#F8F9FA;border-top:1px solid #E5E7EB;">
      <p style="margin:0;color:#9CA3AF;font-size:12px;text-align:center;">
        CNB Cards · F1 Trading Cards
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function internalOrderEmail({ customerName, customerEmail, items, total, shippingAddress }) {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">
          <strong style="color:#111111;">${item.driver}</strong><br>
          <span style="color:#9CA3AF;font-size:13px;">${item.year} · ${item.set_name} · ${item.condition}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB;text-align:right;font-weight:bold;color:#111111;">
          €${Number(item.price).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  const addressBlock = shippingAddress
    ? `${shippingAddress.line1}${shippingAddress.line2 ? ", " + shippingAddress.line2 : ""}
${shippingAddress.city}, ${shippingAddress.postal_code}
${shippingAddress.country}`
    : "Not provided";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F8F9FA;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">

    <div style="background:#E10600;padding:24px 32px;">
      <h1 style="margin:0;color:#FFFFFF;font-size:20px;">New Order Received</h1>
    </div>

    <div style="padding:32px;">
      <h3 style="margin:0 0 12px;color:#111111;font-size:15px;font-weight:600;">Customer</h3>
      <p style="margin:0 0 24px;color:#4B5563;font-size:14px;">
        <strong>${customerName || "N/A"}</strong><br>
        ${customerEmail || "No email provided"}
      </p>

      <h3 style="margin:0 0 12px;color:#111111;font-size:15px;font-weight:600;">Ship To</h3>
      <p style="margin:0 0 24px;color:#4B5563;font-size:14px;white-space:pre-line;">${addressBlock}</p>

      <h3 style="margin:0 0 12px;color:#111111;font-size:15px;font-weight:600;">Cards to Send</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${itemRows}
        <tr>
          <td style="padding:14px 0 0;font-weight:bold;color:#111111;">Total Received</td>
          <td style="padding:14px 0 0;text-align:right;font-weight:bold;color:#E10600;">€${Number(total).toFixed(2)}</td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}
