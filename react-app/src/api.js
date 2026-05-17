// Centralized frontend API client — all calls go through the backend
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

const api = {
  // ── Auth ──────────────────────────────────────────────────────────────
  async signIn(email, password) {
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async signUp(email, password, name) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return res.json();
  },

  async signOut() {
    await fetch(`${API_BASE}/auth/signout`, { method: 'POST' });
  },

  async getGoogleAuthUrl(redirectTo) {
    const res = await fetch(
      `${API_BASE}/auth/google-url?redirectTo=${encodeURIComponent(redirectTo)}`
    );
    return res.json();
  },

  // ── Products ──────────────────────────────────────────────────────────
  async getProducts() {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
  },

  async addProduct(name, price, image_url) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, image_url }),
    });
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getUploadUrl(fileName) {
    const res = await fetch(`${API_BASE}/products/upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName }),
    });
    return res.json();
  },

  // ── Orders ────────────────────────────────────────────────────────────
  async getOrders(email = null) {
    const url = email
      ? `${API_BASE}/orders?email=${encodeURIComponent(email)}`
      : `${API_BASE}/orders`;
    const res = await fetch(url);
    return res.json();
  },

  async placeOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async deleteOrder(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async clearAllOrders() {
    const res = await fetch(`${API_BASE}/orders`, { method: 'DELETE' });
    return res.json();
  },

  // ── Cart ──────────────────────────────────────────────────────────────
  async getCart(userId) {
    const res = await fetch(`${API_BASE}/cart/${userId}`);
    return res.json();
  },

  async addToCart(userId, productName, price, imageUrl, qty = 1) {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        product_name: productName,
        price,
        image_url: imageUrl,
        qty,
      }),
    });
    return res.json();
  },

  async updateCartQty(id, qty) {
    const res = await fetch(`${API_BASE}/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty }),
    });
    return res.json();
  },

  async removeFromCart(id) {
    const res = await fetch(`${API_BASE}/cart/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // ── Gold Price ────────────────────────────────────────────────────────
  async getGoldPrice() {
    const res = await fetch(`${API_BASE}/gold-price`);
    return res.json();
  },

  // ── Health ────────────────────────────────────────────────────────────
  async checkConnection() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.json();
    } catch {
      return { status: 'error' };
    }
  },

  // ── Users (admin) ─────────────────────────────────────────────────────
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  async getUserCount() {
    const res = await fetch(`${API_BASE}/users/count`);
    return res.json();
  },
};

export default api;
