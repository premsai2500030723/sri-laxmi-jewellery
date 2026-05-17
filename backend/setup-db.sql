-- Run this in your Supabase SQL Editor to create the orders table

CREATE TABLE IF NOT EXISTS orders (
    id            BIGSERIAL PRIMARY KEY,
    order_id      TEXT,
    name          TEXT,
    email         TEXT,
    phone         TEXT,
    address       TEXT,
    product_name  TEXT,
    product_price TEXT,
    product_image TEXT,
    quantity      INTEGER DEFAULT 1,
    payment_method TEXT,
    org           TEXT,
    booking_date  DATE,
    status        TEXT DEFAULT 'Pending',
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (tighten in production)
CREATE POLICY "Allow all" ON orders FOR ALL USING (true) WITH CHECK (true);
