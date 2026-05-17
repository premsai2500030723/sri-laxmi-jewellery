import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import './Home.css';

const collections = [
  { title: 'Live Gold & Silver Prices', sub: 'Real-time market data', path: '/live-prices', icon: '◈' },
  { title: 'Gold Ornaments', sub: 'Necklaces, Rings, Earrings', path: '/shop', icon: '✦' },
  { title: 'Customize Design', sub: 'Bespoke jewellery crafting', path: '/customize', icon: '⬡' },
  { title: 'Graphs & Statistics', sub: 'Historical price analytics', path: '/market', icon: '▲' },
  { title: 'New Arrivals', sub: 'Latest collection', path: '/shop', icon: '★' },
  { title: 'Customer Stories', sub: 'Reviews & testimonials', path: '/#contact', icon: '◇' },
];

const services = [
  { title: 'Investment Guidance', desc: 'Expert advice on gold and silver investment strategies tailored to your financial goals.', icon: '◈' },
  { title: 'Custom Design', desc: 'Bespoke jewellery crafted to your exact specifications by master artisans.', icon: '⬡' },
  { title: 'Market Analytics', desc: 'Real-time price tracking and historical data analysis for informed decisions.', icon: '▲' },
  { title: 'Quality Assurance', desc: 'Every piece certified for purity and craftsmanship with a lifetime guarantee.', icon: '✦' },
];

const contacts = [
  { label: 'Phone', value: '+91 98765 43210', icon: '📞' },
  { label: 'Email', value: 'info@srilaxmijewellery.com', icon: '✉' },
  { label: 'WhatsApp', value: '+91 98765 43210', icon: '💬' },
  { label: 'Location', value: 'Hyderabad, Telangana', icon: '📍' },
];

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="home">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-pulse-ring ring1" />
        <div className="hero-pulse-ring ring2" />
        <div className="hero-pulse-ring ring3" />
        <div className="hero-content">
          <span className="hero-eyebrow">Est. 1985 · Hyderabad</span>
          <h1 className="hero-title">
            Sri Laxmi<br /><em>Jewellery</em>
          </h1>
          <div className="hero-gold-line" />
          <p className="hero-subtitle">Gold · Silver · Diamonds · Custom Design</p>
          <div className="hero-actions">
            <Link to="/shop" className="hero-btn-primary">Explore Collection</Link>
            <button className="hero-btn-secondary" onClick={() => setAuthOpen(true)}>Sign In</button>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS GRID ─────────────────────────────────── */}
      <section className="collections" id="collections">
        <div className="section-header">
          <span className="section-eyebrow">Our Offerings</span>
          <h2 className="section-title">Shop by <em>Category</em></h2>
          <div className="gold-line" />
        </div>
        <div className="collections-grid">
          {collections.map((c, i) => (
            <Link to={c.path} className="collection-card" key={i}>
              <div className="collection-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.sub}</p>
              <span className="collection-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section className="services" id="contact">
        <div className="section-header">
          <span className="section-eyebrow">Why Choose Us</span>
          <h2 className="section-title">Our <em>Services</em></h2>
          <div className="gold-line" />
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section className="contact-section" id="emails">
        <div className="section-header">
          <span className="section-eyebrow">Get in Touch</span>
          <h2 className="section-title">Contact <em>Us</em></h2>
          <div className="gold-line" />
        </div>
        <div className="contact-grid">
          {contacts.map((c, i) => (
            <div className="contact-card" key={i}>
              <div className="contact-icon">{c.icon}</div>
              <div className="contact-label">{c.label}</div>
              <div className="contact-value">{c.value}</div>
            </div>
          ))}
        </div>
        <div className="business-hours">
          <h3>Business Hours</h3>
          <div className="hours-grid">
            <div><span>Monday – Friday</span><span>9:00 AM – 6:00 PM</span></div>
            <div><span>Saturday</span><span>10:00 AM – 4:00 PM</span></div>
            <div><span>Sunday</span><span>Closed</span></div>
          </div>
        </div>
      </section>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
