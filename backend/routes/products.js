const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// GET /api/products — list all admin-added products
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// POST /api/products — add a new product (admin)
router.post('/', async (req, res) => {
    const { name, price, image_url } = req.body;
    if (!name || !price || !image_url) return res.status(400).json({ error: 'name, price, image_url required' });

    const { data, error } = await supabase
        .from('products')
        .insert([{ name, price: Number(price), image_url }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// DELETE /api/products/:id — delete a product (admin)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Get image path first so we can remove from storage
    const { data: product } = await supabase.from('products').select('image_url').eq('id', id).single();

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    // Try to remove from storage (best-effort)
    if (product?.image_url) {
        const fileName = product.image_url.split('/').pop();
        await supabase.storage.from('products').remove([fileName]);
    }

    res.json({ success: true });
});

// POST /api/products/upload-url — get a signed upload URL for product image
router.post('/upload-url', async (req, res) => {
    const { fileName, contentType } = req.body;
    if (!fileName) return res.status(400).json({ error: 'fileName required' });

    const { data, error } = await supabase.storage
        .from('products')
        .createSignedUploadUrl(fileName);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
