const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL      = process.env.SUPABASE_URL      || 'https://jouezsefomaryfqchdjl.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdWV6c2Vmb21hcnlmcWNoZGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTU0NDksImV4cCI6MjA4ODg5MTQ0OX0.k3hcokOSZV9M7O5Ohpxv0NHnI_HhWU8nNRfR7dsbpoM';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

// Auth client — uses anon key for user auth operations
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client — uses service role key to bypass RLS for DB writes
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

module.exports = { supabase, supabaseAdmin };
