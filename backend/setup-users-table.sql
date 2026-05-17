-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    name        TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    last_login  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);

-- If the table already exists, add the name column:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
