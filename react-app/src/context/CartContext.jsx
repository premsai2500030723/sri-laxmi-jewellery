import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const getUserId = useCallback(async () => {
    if (user?.userId) return user.userId;
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  }, [user]);

  const loadCart = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) { setCart([]); return; }
    const data = await api.getCart(userId);
    setCart(Array.isArray(data) ? data : []);
  }, [getUserId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (name, price, imageUrl) => {
    const userId = await getUserId();
    if (!userId) return { error: 'not_signed_in' };
    const result = await api.addToCart(userId, name, price, imageUrl, 1);
    if (result.error) return { error: result.error };
    await loadCart();
    return { success: true };
  };

  const changeQty = async (itemId, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      await api.removeFromCart(itemId);
    } else {
      await api.updateCartQty(itemId, newQty);
    }
    await loadCart();
  };

  const removeItem = async (itemId) => {
    await api.removeFromCart(itemId);
    await loadCart();
  };

  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  const cartTotal = cart.reduce((sum, i) => {
    const num = parseFloat(String(i.price).replace(/[^0-9.]/g, '')) || 0;
    return sum + num * (i.qty || 1);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, changeQty, removeItem, cartCount, cartTotal, loadCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
