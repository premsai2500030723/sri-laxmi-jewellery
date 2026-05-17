import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { email, role, userId, accessToken }
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('slj_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const data = await api.signIn(email, password);
    if (data.error) return { error: data.error };
    const userData = { email: data.email, role: data.role, userId: data.userId, accessToken: data.accessToken };
    setUser(userData);
    localStorage.setItem('slj_user', JSON.stringify(userData));
    return { success: true, role: data.role };
  };

  const signUp = async (email, password, name) => {
    const data = await api.signUp(email, password, name);
    if (data.error) return { error: data.error };
    return { success: true };
  };

  const signOut = async () => {
    // Clear local state immediately — don't wait for backend
    setUser(null);
    localStorage.removeItem('slj_user');
    // Then clean up backend/supabase session in background
    try { await api.signOut(); } catch { /* ignore */ }
    try { await supabase.auth.signOut(); } catch { /* ignore */ }
  };

  const signInWithGoogle = async () => {
    const { url } = await api.getGoogleAuthUrl(window.location.origin);
    if (url) window.location.href = url;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
