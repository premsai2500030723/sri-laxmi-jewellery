-- Run this in your Supabase SQL Editor to create all required tables

-- ── Products table ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id         BIGSERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    price      NUMERIC NOT NULL,
    image_url  TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON products FOR ALL USING (true) WITH CHECK (true);

-- ── Cart table ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart (
    id           BIGSERIAL PRIMARY KEY,
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    price        TEXT,
    image_url    TEXT,
    qty          INTEGER DEFAULT 1,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
-- Users can only access their own cart
CREATE POLICY "Users manage own cart" ON cart
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Orders table (if not already created) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id             BIGSERIAL PRIMARY KEY,
    order_id       TEXT,
    name           TEXT,
    email          TEXT,
    phone          TEXT,
    address        TEXT,
    product_name   TEXT,
    product_price  TEXT,
    product_image  TEXT,
    quantity       INTEGER DEFAULT 1,
    payment_method TEXT,
    org            TEXT,
    booking_date   DATE,
    status         TEXT DEFAULT 'Pending',
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON orders FOR ALL USING (true) WITH CHECK (true);

-- ── Users table (if not already created) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
