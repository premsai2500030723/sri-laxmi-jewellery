const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../supabaseClient');

// GET /api/users — list all registered users (admin only)
router.get('/', async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('last_login', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// GET /api/users/count — total user count
router.get('/count', async (req, res) => {
    const { count, error } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ count: count || 0 });
});

module.exports = router;
