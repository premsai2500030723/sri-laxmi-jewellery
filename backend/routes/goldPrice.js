const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET /api/gold-price — proxy gold price API to avoid CORS issues
router.get('/', async (req, res) => {
    try {
        const response = await fetch('https://api.gold-api.com', {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Upstream API error');

        const data = await response.json();
        res.json(data);
    } catch (err) {
        // Fallback approximate values
        res.json({
            fallback: true,
            rates: { INR: 1 / 6500 } // approx ₹6500/gram
        });
    }
});

module.exports = router;
