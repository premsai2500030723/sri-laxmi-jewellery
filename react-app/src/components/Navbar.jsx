import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import SearchBar from './SearchBar';
import './Navbar.css';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = () => {
    setMenuOpen(false);
    signOut();       // fire and forget — state clears instantly
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user) {
      setMenuOpen((prev) => !prev);
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <>
      <header className="navbar">
        <nav className="navbar-left">
          <Link to="/">Home</Link>
          <Link to="/shop">Best Products</Link>
          <Link to="/market">Market</Link>
          <Link to="/live-prices">Live Prices</Link>
        </nav>

        <Link to="/" className="nav-brand">Sri Laxmi Jewellery</Link>

        <div className="nav-right">
          <SearchBar />

          {/* Profile button + dropdown */}
          <div className="profile-wrap" ref={menuRef}>
            <button
              className="profile-icon-btn"
              title={user ? `Signed in as ${user.email}` : 'Sign In'}
              onClick={handleProfileClick}
              style={{ color: user ? '#d4af37' : undefined }}
              aria-label="Profile"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>

            {/* Dropdown — only shown when signed in */}
            {user && menuOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-email">{user.email}</div>
                <div className="profile-dropdown-divider" />
                {user.role === 'admin' && (
                  <button className="profile-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/admin'); }}>
                    ⚙️ Admin Dashboard
                  </button>
                )}
                <button className="profile-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/my-orders'); }}>
                  📦 My Orders
                </button>
                <button className="profile-dropdown-item signout" onClick={handleSignOut}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Cart button */}
          <button
            className="profile-icon-btn cart-icon-btn"
            title="Cart"
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      <CartDrawer />
    </>
  );
}
