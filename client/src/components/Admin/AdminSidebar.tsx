import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAdminStore } from '../../stores/adminStore';
import './admin.css';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: '📊' },
  { label: 'Users', path: '/admin/users', icon: '👥' },
  { label: 'Neighborhoods', path: '/admin/neighborhoods', icon: '🏘️' },
  { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
  { label: 'Settings', path: '/admin/settings', icon: '⚙️' }
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAdminStore();

  return (
    <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar__brand">
        <span className="logo-icon">🚀</span>
        {!sidebarCollapsed && <span className="logo-text">Admin</span>}
      </div>
      <button className="admin-sidebar__toggle" onClick={toggleSidebar}>
        {sidebarCollapsed ? '›' : '‹'}
      </button>
      <nav className="admin-sidebar__nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar__link ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
