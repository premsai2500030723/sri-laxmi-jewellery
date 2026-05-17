const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// GET /api/orders — list all orders
router.get('/', async (req, res) => {
    const { email } = req.query;

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (email) query = query.eq('email', email);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// POST /api/orders — place a new order
router.post('/', async (req, res) => {
    const { name, email, phone, address, product_name, product_price, product_image, quantity, payment_method, type, date, seats, mode, org } = req.body;

    const orderRow = {
        name: name || '',
        email: email || '',
        phone: phone || '',
        address: address || '',
        product_name: product_name || type || '',
        product_price: product_price || '',
        product_image: product_image || '',
        quantity: quantity || seats || 1,
        payment_method: payment_method || mode || '',
        org: org || '',
        booking_date: date || null,
        status: 'Pending',
        order_id: 'ORD' + Date.now()
    };

    const { data, error } = await supabase
        .from('orders')
        .insert([orderRow])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// PATCH /api/orders/:id/status — update order status (admin)
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['Pending', 'Approved', 'Packing', 'Out for Delivery', 'Delivered', 'Rejected'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DELETE /api/orders/:id — delete an order (admin)
router.delete('/:id', async (req, res) => {
    const { error } = await supabase.from('orders').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// DELETE /api/orders — clear all orders (admin)
router.delete('/', async (req, res) => {
    const { error } = await supabase.from('orders').delete().neq('id', 0);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

module.exports = router;
