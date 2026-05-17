import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import Loader from '../components/Loader';
import api from '../api';
import './MyOrders.css';

const DELIVERY_STEPS = [
  { key: 'Pending',          label: 'Order Placed',     icon: '📋' },
  { key: 'Approved',         label: 'Approved',         icon: '✅' },
  { key: 'Packing',          label: 'Packing',          icon: '📦' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: '🚚' },
  { key: 'Delivered',        label: 'Delivered',        icon: '🎉' },
];

function getStepIndex(status) {
  const idx = DELIVERY_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function StatusTracker({ status }) {
  const stepIndex = getStepIndex(status);
  const isRejected = status === 'Rejected';

  if (isRejected) {
    return <div className="mo-rejected-badge">❌ Order Rejected</div>;
  }

  return (
    <div className="mo-tracker">
      {DELIVERY_STEPS.map((step, i) => (
        <div key={step.key} className="mo-tracker-wrap">
          <div className={`mo-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
            <div className="mo-step-icon">{step.icon}</div>
            <div className="mo-step-label">{step.label}</div>
          </div>
          {i < DELIVERY_STEPS.length - 1 && (
            <div className={`mo-line ${i < stepIndex ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.getOrders(user.email).then((data) => {
      if (Array.isArray(data)) setOrders(data);
      setLoading(false);
    });
  }, [user]);

  // Poll every 30s for live status updates
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      api.getOrders(user.email).then((data) => {
        if (Array.isArray(data)) setOrders(data);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return (
      <div className="mo-page">
        <div className="mo-signin-prompt">
          <div className="mo-signin-icon">🔒</div>
          <h2>Sign in to view your orders</h2>
          <p>Track your orders, check delivery status and more.</p>
          <button className="mo-signin-btn" onClick={() => setAuthOpen(true)}>
            Sign In
          </button>
        </div>
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="mo-page">
      <div className="mo-header">
        <h1>My Orders</h1>
        <p>{user.email}</p>
      </div>

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <div className="mo-empty">
          <div className="mo-empty-icon">📭</div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders. Start shopping!</p>
          <button className="mo-signin-btn" onClick={() => navigate('/shop')}>
            Shop Now
          </button>
        </div>
      ) : (
        <div className="mo-list">
          {orders.map((order) => (
            <div className="mo-card" key={order.id}>
              {/* Order Header */}
              <div className="mo-card-header">
                <div>
                  <span className="mo-order-id">{order.order_id}</span>
                  <span className="mo-date">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </span>
                </div>
                <span className={`mo-status-badge mo-status-${(order.status || '').replace(/ /g, '-')}`}>
                  {order.status}
                </span>
              </div>

              {/* Product Info */}
              <div className="mo-product-row">
                {order.product_image && (
                  <img
                    src={order.product_image}
                    alt={order.product_name}
                    className="mo-product-img"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="mo-product-info">
                  <div className="mo-product-name">{order.product_name}</div>
                  <div className="mo-product-price">{order.product_price}</div>
                  <div className="mo-product-qty">Qty: {order.quantity}</div>
                  <div className="mo-product-payment">Payment: {order.payment_method?.toUpperCase()}</div>
                </div>
              </div>

              {/* Delivery Tracker */}
              <div className="mo-tracker-section">
                <StatusTracker status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
