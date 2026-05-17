import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './OrderConfirmation.css';

// Delivery pipeline — order matters
const DELIVERY_STEPS = [
  { key: 'Pending',          label: 'Order Placed',      icon: '📋' },
  { key: 'Approved',         label: 'Approved',          icon: '✅' },
  { key: 'Packing',          label: 'Packing',           icon: '📦' },
  { key: 'Out for Delivery', label: 'Out for Delivery',  icon: '🚚' },
  { key: 'Delivered',        label: 'Delivered',         icon: '🎉' },
];

function getStepIndex(status) {
  const idx = DELIVERY_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [liveStatus, setLiveStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('orderData');
    if (!data) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(data);
    setOrder(parsed);
    setLiveStatus(parsed.status || 'Pending');

    // Poll live status every 30 seconds using order_id
    const orderId = parsed.orderId;
    if (!orderId) return;

    const poll = async () => {
      try {
        const email = parsed.customer?.email;
        if (!email) return;
        const orders = await api.getOrders(email);
        if (Array.isArray(orders)) {
          const match = orders.find((o) => o.order_id === orderId);
          if (match) setLiveStatus(match.status);
        }
      } catch { /* silent */ }
    };

    poll();
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (!order) return null;

  const orderId   = order.orderId || ('ORD' + Date.now());
  const stepIndex = getStepIndex(liveStatus);
  const isRejected = liveStatus === 'Rejected';

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">

        {/* Success / Rejected icon */}
        <div className={`success-icon ${isRejected ? 'rejected' : ''}`}>
          <svg viewBox="0 0 24 24">
            {isRejected
              ? <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              : <polyline points="20 6 9 17 4 12" />
            }
          </svg>
        </div>

        <h1>{isRejected ? 'Order Rejected' : 'Order Placed Successfully!'}</h1>
        <p className="order-id">Order ID: <span>{orderId}</span></p>

        {/* ── DELIVERY STATUS TRACKER ─────────────────────── */}
        {!isRejected && (
          <div className="tracker-section">
            <h3 className="tracker-title">Delivery Status</h3>
            <div className="tracker">
              {DELIVERY_STEPS.map((step, i) => (
                <div key={step.key} className="tracker-step-wrap">
                  <div className={`tracker-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
                    <div className="tracker-icon">{step.icon}</div>
                    <div className="tracker-label">{step.label}</div>
                  </div>
                  {i < DELIVERY_STEPS.length - 1 && (
                    <div className={`tracker-line ${i < stepIndex ? 'done' : ''}`} />
                  )}
                </div>
              ))}
            </div>
            <p className="tracker-current">
              Current Status: <strong>{liveStatus}</strong>
            </p>
          </div>
        )}

        {isRejected && (
          <div className="rejected-msg">
            Your order was rejected. Please contact us for more information.
          </div>
        )}

        {/* Product Details */}
        <div className="product-summary">
          <h3>Product Details</h3>
          <div className="detail-row">
            <span className="detail-label">Product:</span>
            <span className="detail-value">{order.product?.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Price:</span>
            <span className="detail-value">{order.product?.price}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Quantity:</span>
            <span className="detail-value">{order.customer?.quantity}</span>
          </div>
        </div>

        {/* Customer Details */}
        <div className="order-details">
          <h3>Customer Details</h3>
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{order.customer?.fullName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{order.customer?.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{order.customer?.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{order.customer?.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Payment:</span>
            <span className="detail-value">{String(order.customer?.paymentMethod || '').toUpperCase()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Order Date:</span>
            <span className="detail-value">{order.orderDate}</span>
          </div>
        </div>

        <div className="btn-container">
          <button className="btn btn-primary"   onClick={() => navigate('/')}>Go to Home</button>
          <button className="btn btn-secondary" onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}
