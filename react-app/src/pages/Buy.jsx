import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Buy.css';

export default function Buy() {
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', quantity: 1, paymentMethod: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('selectedProduct');
    if (!data) {
      alert('No product selected. Redirecting to products page.');
      navigate('/shop');
      return;
    }
    setProduct(JSON.parse(data));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderResult = await api.placeOrder({
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image,
        quantity: form.quantity,
        payment_method: form.paymentMethod,
      });

      if (orderResult.error) {
        alert('Order failed: ' + orderResult.error);
        setLoading(false);
        return;
      }

      const orderData = {
        product,
        customer: form,
        orderDate: new Date().toLocaleString(),
        orderId: orderResult.order_id || ('ORD' + Date.now()),
      };

      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      navigate('/order-confirmation');
    } catch {
      alert('Could not connect to server. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="buy-page">
      <div className="buy-container">
        {/* Product Section */}
        <div className="product-section">
          <img src={product.image} alt={product.name} className="product-image" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="product-info">
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <h2 className="price">{product.price}</h2>
          </div>
        </div>

        {/* Order Form */}
        <div className="order-section">
          <h2>Order Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input type="text" id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" pattern="[0-9]{10}" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address *</label>
              <textarea id="address" name="address" rows="3" value={form.address} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input type="number" id="quantity" name="quantity" min="1" value={form.quantity} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method *</label>
              <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required>
                <option value="">Select Payment Method</option>
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <button type="button" className="back-btn" onClick={() => navigate('/shop')}>
              Back to Products
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
