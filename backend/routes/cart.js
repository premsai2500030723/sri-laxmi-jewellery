const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// GET /api/cart/:userId
router.get('/:userId', async (req, res) => {
    const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', req.params.userId);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// POST /api/cart — add or update cart item
router.post('/', async (req, res) => {
    const { user_id, product_name, price, image_url, qty } = req.body;
    if (!user_id || !product_name) return res.status(400).json({ error: 'user_id and product_name required' });

    // Upsert: if same user + product exists, update qty
    const { data: existing } = await supabase
        .from('cart')
        .select('id, qty')
        .eq('user_id', user_id)
        .eq('product_name', product_name)
        .single();

    if (existing) {
        const { data, error } = await supabase
            .from('cart')
            .update({ qty: existing.qty + (qty || 1) })
            .eq('id', existing.id)
            .select();
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data[0]);
    }

    const { data, error } = await supabase
        .from('cart')
        .insert([{ user_id, product_name, price, image_url, qty: qty || 1 }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// PATCH /api/cart/:id — update quantity
router.patch('/:id', async (req, res) => {
    const { qty } = req.body;
    if (qty < 1) {
        // Remove if qty drops to 0
        const { error } = await supabase.from('cart').delete().eq('id', req.params.id);
        if (error) return res.status(500).json({ error: error.message });
        return res.json({ deleted: true });
    }

    const { data, error } = await supabase
        .from('cart')
        .update({ qty })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DELETE /api/cart/:id — remove item
router.delete('/:id', async (req, res) => {
    const { error } = await supabase.from('cart').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

module.exports = router;
