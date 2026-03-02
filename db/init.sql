-- ============================================================
--  ShopWave Database Initialization Script
--  Runs automatically on first PostgreSQL container start
-- ============================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── Categories Table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- ── Products Table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock       INTEGER DEFAULT 0 CHECK (stock >= 0),
  category_id INTEGER REFERENCES categories(id),
  image_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── Orders Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id),
  status     VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  total      NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── Order Items Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL
);

-- ── Seed Categories ──────────────────────────────────────────
INSERT INTO categories (name, slug) VALUES
  ('Electronics',   'electronics'),
  ('Clothing',      'clothing'),
  ('Books',         'books'),
  ('Home & Garden', 'home-garden'),
  ('Sports',        'sports')
ON CONFLICT DO NOTHING;

-- ── Seed Products ────────────────────────────────────────────
INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
  ('Wireless Headphones Pro',  'Noise-cancelling, 30hr battery, premium sound quality',     149.99, 45, 1, 'https://picsum.photos/seed/headphones/400/300'),
  ('Mechanical Keyboard',      'TKL layout, Cherry MX Blue switches, RGB backlight',        89.99,  30, 1, 'https://picsum.photos/seed/keyboard/400/300'),
  ('4K USB-C Monitor 27"',     'IPS panel, 144Hz, HDR400, factory calibrated',             399.99,  12, 1, 'https://picsum.photos/seed/monitor/400/300'),
  ('Running Shoes - Men',      'Lightweight mesh, responsive foam, breathable upper',        79.99,  60, 2, 'https://picsum.photos/seed/shoes/400/300'),
  ('Merino Wool Sweater',      'Premium 100% merino, slim fit, available in 6 colours',      59.99,  80, 2, 'https://picsum.photos/seed/sweater/400/300'),
  ('Docker & Kubernetes Book', 'Complete guide to container orchestration, 480 pages',       34.99, 120, 3, 'https://picsum.photos/seed/book1/400/300'),
  ('Clean Code',               'A handbook of agile software craftsmanship by Robert Martin', 29.99, 200, 3, 'https://picsum.photos/seed/book2/400/300'),
  ('Yoga Mat Pro',             'Non-slip, 6mm thick, eco-friendly TPE material',              39.99,  75, 5, 'https://picsum.photos/seed/yogamat/400/300'),
  ('Smart Plant Pot',          'Self-watering, soil moisture sensor, WiFi app control',       49.99,  35, 4, 'https://picsum.photos/seed/plantpot/400/300'),
  ('Adjustable Dumbbells',     'Select 5–52.5 lbs, compact design, replaces 15 dumbbells',  299.99,   8, 5, 'https://picsum.photos/seed/dumbbells/400/300')
ON CONFLICT DO NOTHING;

-- ── Seed Demo User (password: demo1234) ──────────────────────
-- bcrypt hash of "demo1234" with salt rounds 10
INSERT INTO users (name, email, password, role) VALUES
  ('Demo User',  'demo@shopwave.io',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'customer'),
  ('Admin User', 'admin@shopwave.io', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin')
ON CONFLICT DO NOTHING;
