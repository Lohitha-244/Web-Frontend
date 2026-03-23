import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Heart, BarChart3, Settings, User, BookOpen, Sparkles, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, t } = useSettings();
  const isChatPage = location.pathname === '/chat';
  const iconOnly = settings?.icon_only_navigation || false;

  const mainNavItems = [
    { icon: <Home size={20} />, path: '/home', label: t('home') },
    { icon: <Sparkles size={20} />, path: '/mood', label: t('checkin') },
    { icon: <MessageSquare size={20} />, path: '/chat', label: t('aichat') },
    { icon: <Heart size={20} />, path: '/care', label: t('selfcare') },
  ];

  const secondaryNavItems = [
    { icon: <BarChart3 size={20} />, path: '/mood-analytics', label: t('analytics') },
    { icon: <BookOpen size={20} />, path: '/history', label: t('history') },
    { icon: <Settings size={20} />, path: '/settings', label: t('settings') },
  ];

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <nav className="sidebar" style={{ width: iconOnly ? '100px' : 'var(--sidebar-width)', minWidth: iconOnly ? '100px' : 'var(--sidebar-width)', transition: 'all 0.3s ease' }}>
        {/* Logo */}
        <div className="logo-section" style={{ justifyContent: iconOnly ? 'center' : 'flex-start' }}>
          <div className="logo-icon">S</div>
          {!iconOnly && <span className="logo-text">Solace</span>}
        </div>

        {/* Main Nav */}
        <div className="nav-links">
          {!iconOnly && <span className="nav-section-label">{t('main')}</span>}
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={{ justifyContent: iconOnly ? 'center' : 'flex-start' }}
              title={iconOnly ? item.label : ''}
            >
              {item.icon}
              {!iconOnly && <span>{item.label}</span>}
            </NavLink>
          ))}

          {!iconOnly && <span className="nav-section-label">{t('tools')}</span>}
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={{ justifyContent: iconOnly ? 'center' : 'flex-start' }}
              title={iconOnly ? item.label : ''}
            >
              {item.icon}
              {!iconOnly && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* User Profile & Logout at bottom */}
        <div style={{ borderTop: '1px solid rgba(209,196,233,0.4)', paddingTop: '1rem', marginTop: 'auto' }}>
          <NavLink
            to="/profile"
            style={({ isActive }) => ({
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: iconOnly ? 'center' : 'flex-start',
              gap: iconOnly ? '0' : '0.75rem',
              padding: '0.75rem',
              borderRadius: '14px',
              background: isActive ? 'var(--surface-alt)' : 'transparent',
              transition: 'all 0.2s ease',
              marginBottom: '0.5rem'
            })}
            title={iconOnly ? 'Profile' : ''}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', flexShrink: 0
            }}>
              <User size={16} />
            </div>
            {!iconOnly && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-dark)' }}>{t('profile')}</div>
              </div>
            )}
          </NavLink>

          <button
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              navigate('/');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: iconOnly ? 'center' : 'flex-start',
              gap: iconOnly ? '0' : '0.75rem',
              padding: '0.75rem',
              borderRadius: '14px',
              background: 'transparent',
              border: 'none',
              color: '#D32F2F',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(211, 47, 47, 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            title={iconOnly ? 'Logout' : ''}
          >
            <LogOut size={18} />
            {!iconOnly && <span>{t('logout')}</span>}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content" style={{ overflow: isChatPage ? 'hidden' : 'auto' }}>
        {/* Desktop Topbar */}
        {!isChatPage && (
          <div className="desktop-topbar">
            <div style={{ fontSize: '0.875rem', color: '#9575CD', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                onClick={() => navigate('/profile')}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', cursor: 'pointer'
                }}
              >
                <User size={18} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        <header className="mobile-header">
          <span className="logo-text" style={{ fontSize: '1.25rem' }}>Solace</span>
          <div
            onClick={() => navigate('/profile')}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer'
            }}
          >
            <User size={16} />
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="content-wrapper"
          style={{ 
            maxWidth: 'none', 
            width: '100%', 
            padding: 0,
            overflow: isChatPage ? 'hidden' : 'visible',
            height: isChatPage ? '100%' : 'auto'
          }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
