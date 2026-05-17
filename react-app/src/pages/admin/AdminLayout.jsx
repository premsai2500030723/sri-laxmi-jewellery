import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout({ children, activeSection, setActiveSection }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users',     label: 'Users',     icon: '👤' },
    { id: 'orders',    label: 'Orders',    icon: '📦' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'products',  label: 'Products',  icon: '💎' },
    { id: 'settings',  label: 'Settings',  icon: '⚙️' },
  ];

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Sri Laxmi Jewellery — Admin</h1>
        <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="admin-body">
        <aside className="sidebar">
          <ul>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => setActiveSection(item.id)}
              >
                <span>{item.icon}</span> {item.label}
              </li>
            ))}
          </ul>
        </aside>

        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
