const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes      = require('./routes/auth');
const productsRoutes  = require('./routes/products');
const ordersRoutes    = require('./routes/orders');
const cartRoutes      = require('./routes/cart');
const goldPriceRoutes = require('./routes/goldPrice');
const usersRoutes     = require('./routes/users');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CORS ─────────────────────────────────────────────────────
// In production set ALLOWED_ORIGIN env var to your frontend URL
// e.g. https://your-app.vercel.app
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productsRoutes);
app.use('/api/orders',     ordersRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/gold-price', goldPriceRoutes);
app.use('/api/users',      usersRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

// Root route — status page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Backend Status</title>
            <style>
                body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f4f8; }
                .card { background: white; padding: 40px 60px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
                h1 { color: #27ae60; margin-bottom: 8px; }
                p  { color: #555; margin: 6px 0; }
                .dot { display: inline-block; width: 12px; height: 12px; background: #27ae60; border-radius: 50%; margin-right: 8px; animation: pulse 1.5s infinite; }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
                .routes { margin-top: 20px; text-align: left; background: #f9f9f9; padding: 16px; border-radius: 8px; font-size: 14px; }
                .routes span { color: #888; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1><span class="dot"></span>Backend is Running</h1>
                <p>Gold & Silver Investment API</p>
                <p>Port: <strong>${PORT}</strong></p>
                <div class="routes">
                    <p><span>GET </span> /api/health</p>
                    <p><span>POST</span> /api/auth/signin</p>
                    <p><span>GET </span> /api/products</p>
                    <p><span>GET </span> /api/orders</p>
                    <p><span>GET </span> /api/cart/:userId</p>
                    <p><span>GET </span> /api/gold-price</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Backend API running at http://localhost:${PORT}`);
});
