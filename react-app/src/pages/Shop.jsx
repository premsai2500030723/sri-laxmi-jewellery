import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './Shop.css';

// Static product data — images from /public/images/
const staticProducts = {
  necklaces: [
    { id: 's1', name: 'Gold Necklace', price: '₹ 55,000', purity: '24k Gold', image: '/images/type1 A.jpg', desc: 'Beautiful 24k gold necklace with intricate design. Perfect for special occasions and daily wear.' },
    { id: 's2', name: 'Gold Necklace', price: '₹ 55,000', purity: '24k Gold', image: '/images/type1 B.jpg', desc: 'Elegant gold necklace with diamond studding. Handcrafted with premium quality materials.' },
    { id: 's3', name: 'Gold Necklace', price: '₹ 55,000', purity: '22k Gold', image: '/images/type1 C.jpg', desc: 'Stunning gold necklace with modern design. Lightweight and comfortable for everyday use.' },
    { id: 's4', name: 'Gold Necklace', price: '₹ 55,000', purity: '24k Gold', image: '/images/type1 D.jpg', desc: 'Sparkling gold necklace that adds elegance to any outfit. Premium quality guaranteed.' },
  ],
  rings: [
    { id: 's5', name: 'Diamond Ring', price: '₹ 85,000', purity: 'Diamond', image: '/images/type2 A.webp', desc: 'Classic diamond ring with lustrous finish. Timeless piece for any jewellery collection.' },
    { id: 's6', name: 'Gold Ring', price: '₹ 38,000', purity: '22k Gold', image: '/images/type2 B.webp', desc: 'Premium gold ring with secure setting. Perfect for everyday elegance.' },
    { id: 's7', name: 'Silver Pendant Ring', price: '₹ 28,000', purity: 'Silver', image: '/images/type2 C.webp', desc: 'Delicate silver pendant ring with unique design. Adds charm to any occasion.' },
    { id: 's8', name: 'Ruby Ring', price: '₹ 65,000', purity: 'Ruby · Gold', image: '/images/type 2 D.webp', desc: 'Exquisite ruby ring with gold setting. A statement piece for special moments.' },
  ],
  earrings: [
    { id: 's9',  name: 'Emerald Earrings',     price: '₹ 72,000', purity: 'Emerald · Gold', image: '/images/type3 A.jpg', desc: 'Gorgeous emerald earrings with intricate gold work. Luxury meets craftsmanship.' },
    { id: 's10', name: '22k Earring',           price: '₹ 32,000', purity: '22k Gold',       image: '/images/type3 B.jpg', desc: 'Sophisticated gold earring with minimalist design. Durable and elegant.' },
    { id: 's11', name: 'Gold Silver Earrings',  price: '₹ 32,000', purity: 'Gold · Silver',  image: '/images/type3 C.jpg', desc: 'Beautiful dual-tone earrings with silver setting. Perfect for evening wear.' },
    { id: 's12', name: 'Gold Earrings',         price: '₹ 32,000', purity: '24k Gold',       image: '/images/type3 D.jpg', desc: 'Traditional gold earrings with modern touch. Comfortable and stylish accessory.' },
  ],
};

const FILTER_TABS = ['All', 'Necklaces', 'Rings', 'Earrings', 'New Arrivals'];

export default function Shop() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [adminProducts, setAdminProducts] = useState([]);
  const [toast, setToast] = useState('');
  const { addToCart, setCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getProducts().then((data) => {
      if (Array.isArray(data)) setAdminProducts(data);
    });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddToCart = async (name, price, image) => {
    if (!user) {
      showToast('Please sign in to add items to cart');
      return;
    }
    const result = await addToCart(name, price, image);
    if (result?.error === 'not_signed_in') {
      showToast('Please sign in to add items to cart');
    } else {
      showToast(`${name} added to cart`);
      setCartOpen(true);
    }
  };

  const handleBuyNow = (product) => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate('/buy');
  };

  const showSection = (section) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Necklaces' && section === 'necklaces') return true;
    if (activeFilter === 'Rings' && section === 'rings') return true;
    if (activeFilter === 'Earrings' && section === 'earrings') return true;
    if (activeFilter === 'New Arrivals' && section === 'newArrivals') return true;
    return false;
  };

  const ProductCard = ({ product }) => (
    <div className="card">
      <img src={product.image} alt={product.name} className="card-image" />
      <div className="card-price-tag">{product.price}</div>
      <div className="card-content">
        <span className="purity-badge">{product.purity || 'New Arrival'}</span>
        <h3>{product.name}</h3>
        <p>{product.desc || 'Premium jewellery from our collection.'}</p>
        <div className="card-actions">
          <button className="buy-btn" onClick={() => handleBuyNow(product)}>Buy Now</button>
          <button className="cart-btn" onClick={() => handleAddToCart(product.name, product.price, product.image)}>+ Cart</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="shop-page">
      {/* Hero */}
      <div className="p1-hero">
        <span className="p1-eyebrow">Handcrafted Excellence</span>
        <h1 className="p1-title">Gold &amp; Silver<br /><em>Ornaments</em></h1>
        <div className="p1-gold-line" />
        <p className="p1-subtitle">22k · 24k · Diamond · Ruby · Emerald</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Necklaces */}
      {showSection('necklaces') && (
        <div className="type-section">
          <h2 className="type-title">Gold Necklaces</h2>
          <div className="cards-container">
            {staticProducts.necklaces.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Rings */}
      {showSection('rings') && (
        <div className="type-section">
          <h2 className="type-title">Gold Rings</h2>
          <div className="cards-container">
            {staticProducts.rings.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Earrings */}
      {showSection('earrings') && (
        <div className="type-section">
          <h2 className="type-title">Gold Earrings</h2>
          <div className="cards-container">
            {staticProducts.earrings.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* New Arrivals (admin products) */}
      {showSection('newArrivals') && adminProducts.length > 0 && (
        <div className="type-section" id="admin-products-section">
          <h2 className="type-title">New Arrivals</h2>
          <div className="cards-container">
            {adminProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.id,
                  name: item.name,
                  price: `₹ ${Number(item.price).toLocaleString('en-IN')}`,
                  purity: 'New Arrival',
                  image: item.image_url,
                  desc: 'Premium jewellery from our new arrivals collection.',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="cart-toast">{toast}</div>}
    </div>
  );
}
