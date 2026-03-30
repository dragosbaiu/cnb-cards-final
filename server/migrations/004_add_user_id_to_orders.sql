-- Add user_id column to orders (nullable — guest checkout still works)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add shipping address fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address jsonb;

-- RLS policy: users can read their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT
  USING (user_id = auth.uid());

-- Service role can do everything (used by backend)
CREATE POLICY "Service role full access on orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on order_items" ON order_items
  FOR ALL
  USING (true)
  WITH CHECK (true);
