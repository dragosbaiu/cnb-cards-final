import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { productRoutes } from "./routes/products.js";
import { adminRoutes } from "./routes/admin.js";
import { checkoutRoutes } from "./routes/checkout.js";
import { authRoutes } from "./routes/auth.js";
import { orderRoutes } from "./routes/orders.js";
import { contactRoutes } from "./routes/contact.js";

const fastify = Fastify({
  logger: {
    redact: ["req.headers.authorization", 'req.headers["x-admin-key"]', "req.query.key"],
  },
});

await fastify.register(helmet, { global: true });

await fastify.register(rateLimit, {
  global: false, // opt-in per route
});

await fastify.register(cors, {
  origin: [
    /^http:\/\/localhost:\d+$/,
    "https://cnbcards.ro",
    "https://www.cnbcards.ro",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

await fastify.register(productRoutes);
await fastify.register(adminRoutes);
await fastify.register(checkoutRoutes);
await fastify.register(authRoutes);
await fastify.register(orderRoutes);
await fastify.register(contactRoutes);

fastify.get("/api/health", async () => {
  return { status: "ok" };
});

try {
  await fastify.listen({ port: Number(process.env.PORT) || 3001, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
