import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('orderData');
    if (!data) {
      alert('No order data found. Redirecting to home page.');
      navigate('/');
      return;
    }
    setOrder(JSON.parse(data));
  }, [navigate]);

  if (!order) return null;

  const orderId = order.orderId || ('ORD' + Date.now());

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1>Order Placed Successfully!</h1>
        <p className="order-id">Order ID: <span>{orderId}</span></p>

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
            <span className="detail-label">Payment Method:</span>
            <span className="detail-value">{String(order.customer?.paymentMethod || '').toUpperCase()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Order Date:</span>
            <span className="detail-value">{order.orderDate}</span>
          </div>
        </div>

        <div className="btn-container">
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
          <button className="btn btn-secondary" onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}
