-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  driver text NOT NULL,
  year int NOT NULL,
  set_name text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('Mint', 'Near Mint', 'Excellent')),
  price numeric(10,2) NOT NULL,
  image_url text,
  sport text NOT NULL DEFAULT 'f1',
  product_type text NOT NULL DEFAULT 'single' CHECK (product_type IN ('single', 'sealed_box')),
  stock int NOT NULL DEFAULT 1,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Seed with initial data (matching current mockCards)
INSERT INTO products (driver, year, set_name, condition, price, image_url, featured) VALUES
  ('Max Verstappen', 2023, 'Topps Chrome F1', 'Mint', 24.99, 'https://placehold.co/300x400?text=Verstappen', true),
  ('Charles Leclerc', 2023, 'Topps Chrome F1', 'Near Mint', 18.50, 'https://placehold.co/300x400?text=Leclerc', true),
  ('Lewis Hamilton', 2022, 'Topps F1 Turbo Attax', 'Mint', 14.99, 'https://placehold.co/300x400?text=Hamilton', true),
  ('Lando Norris', 2023, 'Topps Chrome F1', 'Near Mint', 16.00, 'https://placehold.co/300x400?text=Norris', true),
  ('Carlos Sainz', 2022, 'Topps F1 Turbo Attax', 'Excellent', 11.99, 'https://placehold.co/300x400?text=Sainz', true),
  ('Fernando Alonso', 2023, 'Topps Chrome F1', 'Mint', 19.99, 'https://placehold.co/300x400?text=Alonso', true);
