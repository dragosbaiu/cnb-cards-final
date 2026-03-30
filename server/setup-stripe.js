/**
 * One-time setup script — creates Stripe shipping rates and writes their IDs to .env
 * Run once: node setup-stripe.js
 */
import "dotenv/config";
import Stripe from "stripe";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env");

const rates = [
  { key: "STRIPE_SHIPPING_RO", name: "Romania Shipping", amount: 100 },
  { key: "STRIPE_SHIPPING_EU", name: "EU Shipping (excl. Romania)", amount: 200 },
  { key: "STRIPE_SHIPPING_OTHER", name: "International Shipping", amount: 500 },
];

let env = fs.readFileSync(envPath, "utf8");

for (const rate of rates) {
  if (process.env[rate.key]) {
    console.log(`${rate.key} already set (${process.env[rate.key]}), skipping.`);
    continue;
  }

  const created = await stripe.shippingRates.create({
    display_name: rate.name,
    type: "fixed_amount",
    fixed_amount: { amount: rate.amount, currency: "eur" },
  });

  console.log(`Created ${rate.name}: ${created.id}`);

  if (env.includes(`${rate.key}=`)) {
    env = env.replace(new RegExp(`${rate.key}=.*`), `${rate.key}=${created.id}`);
  } else {
    env += `\n${rate.key}=${created.id}`;
  }
}

fs.writeFileSync(envPath, env);
console.log("\nDone. Shipping rate IDs written to .env");
