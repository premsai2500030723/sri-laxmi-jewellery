import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Market from './pages/Market';
import LivePrices from './pages/LivePrices';
import Customize from './pages/Customize';
import Buy from './pages/Buy';
import OrderConfirmation from './pages/OrderConfirmation';
import Admin from './pages/admin/Admin';
import './App.css';

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin — no shared navbar */}
        <Route path="/admin" element={<Admin />} />

        {/* All other pages — with shared navbar */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/"                    element={<Home />} />
                <Route path="/shop"                element={<Shop />} />
                <Route path="/market"              element={<Market />} />
                <Route path="/live-prices"         element={<LivePrices />} />
                <Route path="/customize"           element={<Customize />} />
                <Route path="/buy"                 element={<Buy />} />
                <Route path="/order-confirmation"  element={<OrderConfirmation />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
