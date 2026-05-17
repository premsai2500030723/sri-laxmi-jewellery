import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import api from '../../api';
import Loader from '../../components/Loader';
import './Admin.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Data state
  const [orders, setOrders]     = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers]       = useState([]);
  const [searchQuery, setSearchQuery]   = useState('');
  const [userSearch, setUserSearch]     = useState('');

  // Product form state
  const [productName, setProductName]   = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productFile, setProductFile]   = useState(null);
  const [productStatus, setProductStatus] = useState('');

  // Guard: only admin can access — wait for auth to load first
  useEffect(() => {
    if (loading) return;                          // still reading localStorage, wait
    if (!user || user.role !== 'admin') navigate('/');
  }, [user, loading, navigate]);

  // Show nothing while auth state is being restored from localStorage
  if (loading) return <Loader fullScreen />;

  const loadOrders = useCallback(async () => {
    const data = await api.getOrders();
    if (Array.isArray(data)) setOrders(data);
  }, []);

  const loadProducts = useCallback(async () => {
    const data = await api.getProducts();
    if (Array.isArray(data)) setProducts(data);
  }, []);

  const loadUsers = useCallback(async () => {
    const data = await api.getUsers();
    if (Array.isArray(data)) setUsers(data);
  }, []);

  useEffect(() => {
    loadOrders();
    loadProducts();
    loadUsers();
  }, [loadOrders, loadProducts, loadUsers]);

  // ── Order Actions ──────────────────────────────────────────
  const updateStatus = async (id, status) => {
    await api.updateOrderStatus(id, status);
    loadOrders();
  };

  const deleteOrder = async (id) => {
    if (!confirm('Delete this order?')) return;
    await api.deleteOrder(id);
    loadOrders();
  };

  const clearAllOrders = async () => {
    if (!confirm('Clear ALL orders? This cannot be undone.')) return;
    await api.clearAllOrders();
    loadOrders();
  };

  // ── Product Actions ────────────────────────────────────────
  const handleAddProduct = async () => {
    if (!productName || !productPrice) { setProductStatus('Please fill in name and price.'); return; }
    if (!productFile) { setProductStatus('Please select an image.'); return; }

    setProductStatus('Getting upload URL...');
    const fileName = `${Date.now()}-${productFile.name}`;
    const uploadInfo = await api.getUploadUrl(fileName);

    setProductStatus('Uploading image...');
    if (uploadInfo.error) {
      await fetch(`${SUPABASE_URL}/storage/v1/object/products/${fileName}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: productFile,
      });
    } else {
      await fetch(uploadInfo.signedUrl, {
        method: 'PUT',
        body: productFile,
        headers: { 'Content-Type': productFile.type },
      });
    }

    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;
    setProductStatus('Saving product...');
    const result = await api.addProduct(productName, productPrice, imageUrl);

    if (result.error) { setProductStatus('Error: ' + result.error); return; }

    setProductStatus('Product added successfully!');
    setProductName(''); setProductPrice(''); setProductFile(null);
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.deleteProduct(id);
    loadProducts();
  };

  // ── Stats ──────────────────────────────────────────────────
  const stats = {
    total:    orders.length,
    pending:  orders.filter((o) => o.status === 'Pending').length,
    approved: orders.filter((o) => o.status === 'Approved').length,
    rejected: orders.filter((o) => o.status === 'Rejected').length,
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      (o.name || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q) ||
      (o.product_name || '').toLowerCase().includes(q) ||
      (o.order_id || '').toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      (u.email || '').toLowerCase().includes(q) ||
      (u.name  || '').toLowerCase().includes(q)
    );
  });

  // Unique customers from orders (for Customers tab)
  const customerMap = {};
  orders.forEach((o) => {
    if (o.email) {
      if (!customerMap[o.email]) customerMap[o.email] = { name: o.name, email: o.email, count: 0 };
      customerMap[o.email].count++;
    }
  });
  const customers = Object.values(customerMap);

  // How many users logged in today
  const today = new Date().toDateString();
  const loggedInToday = users.filter((u) => {
    if (!u.last_login) return false;
    return new Date(u.last_login).toDateString() === today;
  }).length;

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>

      {/* ── DASHBOARD ─────────────────────────────────────── */}
      {activeSection === 'dashboard' && (
        <div>
          <h2 className="section-title">Dashboard</h2>

          {/* Order stats */}
          <p className="stats-label">Orders</p>
          <div className="stats-row">
            <div className="card total">   <h3>Total Orders</h3><div className="count">{stats.total}</div></div>
            <div className="card pending"> <h3>Pending</h3>     <div className="count">{stats.pending}</div></div>
            <div className="card approved"><h3>Approved</h3>    <div className="count">{stats.approved}</div></div>
            <div className="card rejected"><h3>Rejected</h3>    <div className="count">{stats.rejected}</div></div>
          </div>

          {/* User stats */}
          <p className="stats-label" style={{ marginTop: 28 }}>Users</p>
          <div className="stats-row">
            <div className="card users-total">
              <h3>Total Registered Users</h3>
              <div className="count">{users.length}</div>
            </div>
            <div className="card users-today">
              <h3>Logged In Today</h3>
              <div className="count">{loggedInToday}</div>
            </div>
            <div className="card users-customers">
              <h3>Customers (ordered)</h3>
              <div className="count">{customers.length}</div>
            </div>
            <div className="card users-products">
              <h3>Total Products</h3>
              <div className="count">{products.length}</div>
            </div>
          </div>

          {/* Recent logins */}
          <h3 className="sub-section-title">Recent Logins</h3>
          <table className="orders-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Email</th><th>Registered</th><th>Last Login</th></tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.name || <span className="muted">—</span>}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <span className={isRecent(u.last_login) ? 'login-recent' : 'login-old'}>
                      {u.last_login ? formatTime(u.last_login) : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Recent orders */}
          <h3 className="sub-section-title" style={{ marginTop: 32 }}>Recent Orders</h3>
          <table className="orders-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td>{o.order_id}</td>
                  <td>{o.name}</td>
                  <td>{o.product_name}</td>
                  <td><span className={`badge ${o.status}`}>{o.status}</span></td>
                  <td>{o.created_at ? new Date(o.created_at).toLocaleDateString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── USERS ─────────────────────────────────────────── */}
      {activeSection === 'users' && (
        <div>
          <h2 className="section-title">
            Registered Users
            <span className="count-badge">{users.length} total · {loggedInToday} today</span>
          </h2>

          <input
            className="search-input"
            type="text"
            placeholder="Search by name or email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />

          <table className="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>User ID</th>
                <th>Registered</th>
                <th>Last Login</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan="7" style={{ color: '#888', padding: 20 }}>No users found.</td></tr>
              ) : (
                filteredUsers.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.name || <span className="muted">—</span>}</td>
                    <td>{u.email}</td>
                    <td><span className="user-id-cell">{u.id?.slice(0, 8)}…</span></td>
                    <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                    <td>{u.last_login ? formatTime(u.last_login) : '—'}</td>
                    <td>
                      <span className={isRecent(u.last_login) ? 'badge Approved' : 'badge Pending'}>
                        {isRecent(u.last_login) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ORDERS ────────────────────────────────────────── */}
      {activeSection === 'orders' && (
        <div>
          <h2 className="section-title">All Orders</h2>
          <input
            className="search-input"
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <table className="orders-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.order_id}</td>
                  <td>{o.name}<br /><small style={{ color: '#888' }}>{o.email}</small></td>
                  <td>{o.product_name}</td>
                  <td>{o.quantity}</td>
                  <td>{o.payment_method}</td>
                  <td><span className={`badge ${o.status}`}>{o.status}</span></td>
                  <td>{o.created_at ? new Date(o.created_at).toLocaleDateString() : ''}</td>
                  <td>
                    {o.status !== 'Delivered' && o.status !== 'Rejected' && (
                      <select
                        className="status-select"
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Packing">Packing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    )}
                    {(o.status === 'Delivered' || o.status === 'Rejected') && (
                      <span className={`badge ${o.status === 'Delivered' ? 'Approved' : 'Rejected'}`}>
                        {o.status}
                      </span>
                    )}
                    <button className="btn-delete" onClick={() => deleteOrder(o.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── CUSTOMERS ─────────────────────────────────────── */}
      {activeSection === 'customers' && (
        <div>
          <h2 className="section-title">Customers ({customers.length})</h2>
          <table className="orders-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Email</th><th>Orders</th></tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.email}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PRODUCTS ──────────────────────────────────────── */}
      {activeSection === 'products' && (
        <div>
          <h2 className="section-title">Manage Products</h2>

          <div className="product-form-card">
            <h3>Add New Product</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Diamond Necklace" />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="e.g. 85000" />
              </div>
            </div>
            <div className="form-group">
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={(e) => setProductFile(e.target.files[0])} />
            </div>
            <button className="add-product-btn" onClick={handleAddProduct}>Upload &amp; Add Product</button>
            {productStatus && <p className={`status-msg ${productStatus.startsWith('Error') ? 'error' : ''}`}>{productStatus}</p>}
          </div>

          <h3 style={{ margin: '32px 0 16px', color: '#2c3e50' }}>All Products ({products.length})</h3>
          <div className="products-grid">
            {products.map((item) => (
              <div className="product-card" key={item.id}>
                <img src={item.image_url} alt={item.name} />
                <h4>{item.name}</h4>
                <p>₹ {Number(item.price).toLocaleString('en-IN')}</p>
                <button className="btn-delete" onClick={() => handleDeleteProduct(item.id)}>🗑 Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SETTINGS ──────────────────────────────────────── */}
      {activeSection === 'settings' && (
        <div>
          <h2 className="section-title">Settings</h2>
          <div className="settings-card">
            <h3>Admin Credentials</h3>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>
              Admin credentials are managed via environment variables in the backend (.env file).
            </p>
            <p style={{ fontSize: 13, color: '#555' }}>
              Edit <code>backend/.env</code> and change <code>ADMIN_EMAIL</code> and <code>ADMIN_PASS</code>, then restart the backend.
            </p>
          </div>

          <div className="settings-card danger-zone">
            <h3>Danger Zone</h3>
            <p>This will permanently delete all orders from the database.</p>
            <button className="btn-delete" style={{ padding: '10px 20px', fontSize: 14 }} onClick={clearAllOrders}>
              🗑 Clear All Orders
            </button>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

// ── Helpers ────────────────────────────────────────────────
function isRecent(dateStr) {
  if (!dateStr) return false;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 24 * 60 * 60 * 1000; // within last 24 hours
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}
