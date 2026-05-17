const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../supabaseClient');

// helper — upsert into public.users using admin client (bypasses RLS)
async function syncUser(id, email, name = null) {
    const payload = { id, email, last_login: new Date().toISOString() };
    if (name) payload.name = name;
    const { error } = await supabaseAdmin.from('users').upsert(payload, { onConflict: 'id' });
    if (error) console.error('syncUser error:', error.message);
}

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Admin bypass
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jewels.com';
    const adminPass  = process.env.ADMIN_PASS  || 'Admin@1234';
    if (email === adminEmail && password === adminPass) {
        return res.json({ role: 'admin', email });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });

    // Sync to public.users (creates row if missing, updates last_login)
    await syncUser(data.user.id, data.user.email);

    res.json({
        role: 'user',
        email,
        userId: data.user.id,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token
    });
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    // Sync to public.users as soon as auth.users row exists
    if (data.user?.id) {
        await syncUser(data.user.id, data.user.email, name || null);
    }

    res.json({
        role: 'user',
        email,
        userId: data.user?.id || '',
        accessToken: data.session?.access_token || '',
        refreshToken: data.session?.refresh_token || '',
        emailConfirmationRequired: !data.session
    });
});

// POST /api/auth/signout
router.post('/signout', async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// GET /api/auth/google-url
router.get('/google-url', (req, res) => {
    const redirectTo = req.query.redirectTo || 'http://localhost:8000/index.html';
    res.json({
        url: `https://jouezsefomaryfqchdjl.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`
    });
});

module.exports = router;
