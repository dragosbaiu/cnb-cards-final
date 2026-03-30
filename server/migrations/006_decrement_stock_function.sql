-- Run this in the Supabase SQL editor
-- Creates a function to safely decrement product stock (never below 0)

CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, amount integer DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(0, stock - amount)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
