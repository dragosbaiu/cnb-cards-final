import Stripe from "stripe";
import { supabase } from "../db.js";
import { transporter } from "../services/mailer.js";
import { customerOrderEmail, internalOrderEmail } from "../services/emailTemplates.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const INTERNAL_EMAIL = process.env.INTERNAL_EMAIL;

const EU_COUNTRIES = new Set(["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","SK","SI","ES","SE"]);

function getShippingFee(country) {
  if (country === "RO") return 1;
  if (EU_COUNTRIES.has(country)) return 2;
  return 5;
}

async function processOrder({ paymentIntentId, metadata, shipping, receiptEmail, amountReceived, fastify }) {
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", paymentIntentId)
    .maybeSingle();

  if (existingOrder) return;

  const ids = metadata.product_ids.split(",");
  const quantities = (metadata.quantities || "").split(",").map(Number);
  const qtyMap = Object.fromEntries(ids.map((id, i) => [id, quantities[i] || 1]));

  for (const pid of ids) {
    await supabase.rpc("decrement_stock", { product_id: pid, amount: qtyMap[pid] || 1 });
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, driver, year, set_name, condition, price")
    .in("id", ids);

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const customerName = shipping?.name || null;
  const customerEmail = receiptEmail || null;
  const shippingAddress = shipping?.address || null;
  const total = amountReceived / 100;
  const userId = metadata.user_id || null;

  const { data: order } = await supabase
    .from("orders")
    .insert({
      email: customerEmail || "",
      status: "paid",
      total,
      stripe_session_id: paymentIntentId,
      user_id: userId,
      customer_name: customerName,
      shipping_address: shippingAddress,
    })
    .select("id")
    .single();

  if (order && products?.length) {
    await supabase.from("order_items").insert(
      ids.map((productId) => ({
        order_id: order.id,
        product_id: productId,
        quantity: qtyMap[productId] || 1,
        price_at_purchase: Number(productMap[productId]?.price || 0),
      }))
    );
  }

  if (products?.length) {
    Promise.all([
      customerEmail && transporter.sendMail({
        from: `"CNB Cards" <${process.env.GMAIL_USER}>`,
        to: customerEmail,
        subject: "Your CNB Cards Order is Confirmed!",
        html: customerOrderEmail({ customerName, items: products, total, shippingAddress }),
      }),
      transporter.sendMail({
        from: `"CNB Cards" <${process.env.GMAIL_USER}>`,
        to: INTERNAL_EMAIL,
        subject: `New Order — ${customerName || customerEmail || "Unknown"}`,
        html: internalOrderEmail({ customerName, customerEmail, items: products, total, shippingAddress }),
      }),
    ]).catch((err) => fastify.log.error("Email send failed: " + err.message));
  }
}

export async function checkoutRoutes(fastify) {
  // POST /api/checkout/create-intent — validate cart, create PaymentIntent
  fastify.post("/api/checkout/create-intent", async (request, reply) => {
    const { items } = request.body;

    if (!items || !items.length) {
      return reply.code(400).send({ error: "Cart is empty" });
    }

    const qtyMap = Object.fromEntries(items.map((i) => [i.id, i.quantity || 1]));
    const ids = items.map((i) => i.id);

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids)
      .gt("stock", 0);

    if (error) return reply.code(500).send({ error: error.message });

    if (products.length !== items.length) {
      return reply.code(400).send({ error: "Some products are unavailable" });
    }

    for (const p of products) {
      if (p.stock < (qtyMap[p.id] || 1)) {
        return reply.code(400).send({ error: `Not enough stock for ${p.driver}` });
      }
    }

    const subtotal = products.reduce((sum, p) => sum + Number(p.price) * (qtyMap[p.id] || 1), 0);
    const processingFee = Math.round(subtotal * 0.015 * 100) / 100;
    // Amount starts without shipping — updated when customer enters address
    const amount = Math.round((subtotal + processingFee) * 100);

    const token = request.headers.authorization?.replace("Bearer ", "");
    let userId = null;
    if (token) {
      const { data: userData } = await supabase.auth.getUser(token);
      if (userData?.user) userId = userData.user.id;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      metadata: {
        product_ids: ids.join(","),
        quantities: ids.map((id) => qtyMap[id] || 1).join(","),
        subtotal_cents: String(Math.round(subtotal * 100)),
        processing_fee_cents: String(Math.round(processingFee * 100)),
        ...(userId ? { user_id: userId } : {}),
      },
    });

    return {
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      subtotal,
      processing_fee: processingFee,
    };
  });

  // POST /api/checkout/update-shipping — update amount when customer's country is known
  fastify.post("/api/checkout/update-shipping", async (request, reply) => {
    const { payment_intent_id, country } = request.body;

    if (!payment_intent_id || !country) {
      return reply.code(400).send({ error: "payment_intent_id and country are required" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    const subtotalCents = Number(paymentIntent.metadata.subtotal_cents);
    const processingFeeCents = Number(paymentIntent.metadata.processing_fee_cents);
    const shippingFee = getShippingFee(country);
    const shippingCents = Math.round(shippingFee * 100);
    const newAmount = subtotalCents + processingFeeCents + shippingCents;

    await stripe.paymentIntents.update(payment_intent_id, {
      amount: newAmount,
      metadata: {
        ...paymentIntent.metadata,
        shipping_country: country,
        shipping_cents: String(shippingCents),
      },
    });

    return { shipping_fee: shippingFee, total: newAmount / 100 };
  });

  // GET /api/checkout/verify-payment/:id — called from success page, processes the order
  fastify.get("/api/checkout/verify-payment/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(id, {
        expand: ["payment_method"],
      });

      if (paymentIntent.status === "succeeded" && paymentIntent.metadata?.product_ids) {
        const receiptEmail = paymentIntent.payment_method?.billing_details?.email || null;
        await processOrder({
          paymentIntentId: id,
          metadata: paymentIntent.metadata,
          shipping: paymentIntent.shipping,
          receiptEmail,
          amountReceived: paymentIntent.amount_received,
          fastify,
        });
      }

      return { status: paymentIntent.status };
    } catch {
      return reply.code(404).send({ error: "Payment not found" });
    }
  });
}
