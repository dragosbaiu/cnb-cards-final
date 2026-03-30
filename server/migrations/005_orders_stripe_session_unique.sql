-- Ensure each Stripe session can only create one order (idempotency)
ALTER TABLE orders ADD CONSTRAINT orders_stripe_session_id_key UNIQUE (stripe_session_id);
