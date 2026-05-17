import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import './Customize.css';

const initialForm = {
  name: '', email: '', phone: '', org: '',
  model: '', grams: '', mode: '', date: '', items: '', terms: false,
};

const initialErrors = {
  name: '', email: '', phone: '', model: '', grams: '', mode: '', date: '', items: '', terms: '',
};

export default function Customize() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Pre-fill email from logged-in user
  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const validate = () => {
    const errs = { ...initialErrors };
    let valid = true;

    if (!form.name.trim() || form.name.trim().length < 3) {
      errs.name = 'Full name must be at least 3 characters.'; valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.'; valid = false;
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
      errs.phone = 'Enter a valid 10-digit phone number.'; valid = false;
    }
    if (!form.model) { errs.model = 'Please select a model.'; valid = false; }
    if (!form.grams) { errs.grams = 'Please select grams.'; valid = false; }
    if (!form.mode)  { errs.mode  = 'Please select attendance mode.'; valid = false; }
    if (!form.date)  { errs.date  = 'Please select a booking date.'; valid = false; }
    if (!form.items || form.items < 1 || form.items > 5) {
      errs.items = 'Items must be between 1 and 5.'; valid = false;
    }
    if (!form.terms) { errs.terms = 'You must agree to the terms.'; valid = false; }

    setErrors(errs);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gate behind sign-in
    if (!user) { setAuthOpen(true); return; }
    if (!validate()) return;
    setLoading(true);

    try {
      // Always use logged-in user's email
      const orderEmail = user.email;
      const result = await api.placeOrder({
        name: form.name,
        email: orderEmail,
        phone: form.phone,
        org: form.org,
        type: form.model,
        quantity: form.items,
        mode: form.mode,
        date: form.date,
        payment_method: 'Custom Order',
        product_name: `Custom ${form.model} — ${form.grams}`,
        product_price: 'Custom',
      });

      if (result.error) {
        alert('Order failed: ' + result.error);
        setLoading(false);
        return;
      }

      const orderData = {
        product: { name: `Custom ${form.model} — ${form.grams}`, price: 'Custom', image: '' },
        customer: { fullName: form.name, email: orderEmail, phone: form.phone, address: form.org || 'N/A', quantity: form.items, paymentMethod: 'Custom Order' },
        orderDate: new Date().toLocaleString(),
        orderId: result.order_id || ('ORD' + Date.now()),
      };

      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      navigate('/order-confirmation');
    } catch {
      alert('Could not connect to server. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="customize-page">
      <header className="page-header">
        <h1>Customize Your Design</h1>
        <p className="sub">Please fill all <span className="req">*</span> mandatory fields.</p>
      </header>

      <main className="container">
        <form id="regForm" className="form" onSubmit={handleSubmit} noValidate>

          <div className="field">
            <label htmlFor="name">Full Name <span className="req">*</span></label>
            <input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Email <span className="req">*</span></label>
            <input
              id="email" name="email" type="email"
              value={user?.email || form.email}
              readOnly={!!user}
              onChange={handleChange}
              className={user ? 'readonly-field' : ''}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="phone">Phone <span className="req">*</span></label>
            <input id="phone" name="phone" type="tel" inputMode="numeric" placeholder="10-digit mobile" value={form.phone} onChange={handleChange} />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="field">
            <label htmlFor="org">Organization</label>
            <input id="org" name="org" type="text" autoComplete="organization" value={form.org} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="model">Models <span className="req">*</span></label>
            <select id="model" name="model" value={form.model} onChange={handleChange}>
              <option value="">Select…</option>
              <option value="Rings">Rings</option>
              <option value="Earrings">Earrings</option>
              <option value="Necklace">Necklace</option>
            </select>
            {errors.model && <span className="error">{errors.model}</span>}
          </div>

          <div className="field">
            <label htmlFor="grams">Grams <span className="req">*</span></label>
            <select id="grams" name="grams" value={form.grams} onChange={handleChange}>
              <option value="">Select…</option>
              <option value="10gms">10gms</option>
              <option value="20gms">20gms</option>
              <option value="30gms">30gms</option>
            </select>
            {errors.grams && <span className="error">{errors.grams}</span>}
          </div>

          <fieldset className="field">
            <legend>Attendance Mode <span className="req">*</span></legend>
            <div className="inline">
              <label><input type="radio" name="mode" value="in-person" checked={form.mode === 'in-person'} onChange={handleChange} /> Offline</label>
              <label><input type="radio" name="mode" value="online" checked={form.mode === 'online'} onChange={handleChange} /> Online</label>
            </div>
            {errors.mode && <span className="error">{errors.mode}</span>}
          </fieldset>

          <div className="field">
            <label htmlFor="date">Booking Date <span className="req">*</span></label>
            <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
            {errors.date && <span className="error">{errors.date}</span>}
          </div>

          <div className="field">
            <label htmlFor="items">Items <span className="req">*</span></label>
            <input id="items" name="items" type="number" min="1" max="5" step="1" value={form.items} onChange={handleChange} />
            {errors.items && <span className="error">{errors.items}</span>}
          </div>

          <div className="field">
            <label className="checkbox">
              <input id="terms" name="terms" type="checkbox" checked={form.terms} onChange={handleChange} />
              I agree to the Terms &amp; Privacy <span className="req">*</span>
            </label>
            {errors.terms && <span className="error">{errors.terms}</span>}
          </div>

          <div className="actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Placing Order…' : 'Order'}
            </button>
          </div>
        </form>
      </main>

      {/* Sign-in modal */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
