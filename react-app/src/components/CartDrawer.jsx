import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, changeQty, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/shop');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={() => setCartOpen(false)}>&times;</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  onError={(e) => { e.target.src = ''; }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product_name}</div>
                  <div className="cart-item-price">{item.price}</div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1, item.qty)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, 1, item.qty)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>×</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Total</span>
            <span>₹ {cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </>
  );
}
