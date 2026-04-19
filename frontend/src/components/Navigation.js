/**
 * Navigation Component — Cybersecurity Dark Theme
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, Upload, FolderOpen, MessageSquare, Settings, Shield } from 'lucide-react';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('isAdmin');
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Upload', path: '/upload', icon: Upload },
    { label: 'Files', path: '/files', icon: FolderOpen },
    { label: 'Support', path: '/support', icon: MessageSquare },
    { label: 'Settings', path: '/wip', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      {/* top line accent */}
      <div style={styles.topAccent} />

      <div style={styles.container}>
        {/* Brand */}
        <div style={styles.brand} onClick={() => navigate('/dashboard')}>
          <div style={styles.logoBox}>
            <span style={styles.logoIcon}>&gt;_</span>
          </div>
          <div>
            <span style={styles.logoTitle}>Cloude</span>
            <span style={styles.logoSuffix}>Storage</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div style={styles.desktopNav}>
          {user && navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.navLink,
                  ...(active ? styles.navLinkActive : {}),
                }}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              style={{
                ...styles.navLink,
                ...styles.adminLink,
                ...(isActive('/admin') ? styles.adminLinkActive : {}),
              }}
            >
              <Shield size={15} />
              Admin
            </button>
          )}
        </div>

        {/* Right side: user info + hamburger */}
        <div style={styles.rightSide}>
          {user && (
            <div style={styles.userEmail}>
              <span style={styles.userDot} />
              {user.email}
            </div>
          )}

          <button
            style={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {user && (
            <button style={styles.logoutDesktop} onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && user && (
        <div style={styles.mobileMenu}>
          <div style={styles.mobileHeader}>
            <span style={styles.mobileEmail}>{user.email}</span>
            {isAdmin && <span style={styles.adminBadge}>ADMIN</span>}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                style={styles.mobileItem}
              >
                <Icon size={16} color="#00f5ff" />
                {item.label}
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
              style={{ ...styles.mobileItem, color: '#e94560' }}
            >
              <Shield size={16} color="#e94560" />
              Admin Panel
            </button>
          )}

          <button onClick={handleLogout} style={styles.mobileLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(90deg, #070d15 0%, #0a0e1a 100%)',
    borderBottom: '1px solid rgba(0, 245, 255, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
  },
  topAccent: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #00f5ff 30%, #e94560 70%, transparent)',
    opacity: 0.7,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    height: '62px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    flex: '0 0 auto',
    textDecoration: 'none',
  },
  logoBox: {
    width: '38px',
    height: '38px',
    background: 'rgba(0, 245, 255, 0.08)',
    border: '1px solid rgba(0, 245, 255, 0.3)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '14px',
    color: '#00f5ff',
    textShadow: '0 0 8px #00f5ff',
    fontWeight: 700,
  },
  logoTitle: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '16px',
    fontWeight: 900,
    color: '#e0e6f0',
    letterSpacing: '0.04em',
  },
  logoSuffix: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '16px',
    fontWeight: 400,
    color: '#00f5ff',
    letterSpacing: '0.04em',
    textShadow: '0 0 8px rgba(0,245,255,0.5)',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    background: 'transparent',
    border: '1px solid transparent',
    color: '#7a8a9a',
    cursor: 'pointer',
    padding: '7px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.25s ease',
  },
  navLinkActive: {
    background: 'rgba(0, 245, 255, 0.08)',
    border: '1px solid rgba(0, 245, 255, 0.25)',
    color: '#00f5ff',
    textShadow: '0 0 6px rgba(0,245,255,0.5)',
  },
  adminLink: {
    color: '#e94560',
    borderColor: 'rgba(233, 69, 96, 0.2)',
    background: 'rgba(233, 69, 96, 0.05)',
  },
  adminLinkActive: {
    background: 'rgba(233, 69, 96, 0.12)',
    borderColor: 'rgba(233, 69, 96, 0.5)',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: '0 0 auto',
  },
  userEmail: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#3a4a5a',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    maxWidth: '160px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#00ff41',
    boxShadow: '0 0 6px #00ff41',
    flexShrink: 0,
  },
  logoutDesktop: {
    background: 'transparent',
    border: '1px solid rgba(233,69,96,0.3)',
    color: '#e94560',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.25s ease',
  },
  menuButton: {
    background: 'transparent',
    border: '1px solid rgba(0,245,255,0.15)',
    color: '#00f5ff',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'none',
    alignItems: 'center',
    transition: 'all 0.25s ease',
  },
  mobileMenu: {
    background: '#070d15',
    borderTop: '1px solid rgba(0,245,255,0.1)',
    padding: '12px 24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mobileHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0 12px',
    borderBottom: '1px solid rgba(0,245,255,0.08)',
    marginBottom: '8px',
  },
  mobileEmail: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#00f5ff',
  },
  adminBadge: {
    background: 'rgba(233,69,96,0.15)',
    color: '#e94560',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontFamily: "'Orbitron', monospace",
    fontWeight: 700,
    letterSpacing: '0.1em',
    border: '1px solid rgba(233,69,96,0.3)',
  },
  mobileItem: {
    background: 'transparent',
    border: 'none',
    color: '#e0e6f0',
    cursor: 'pointer',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s ease',
  },
  mobileLogout: {
    background: 'rgba(233,69,96,0.08)',
    border: '1px solid rgba(233,69,96,0.3)',
    color: '#e94560',
    cursor: 'pointer',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px',
    transition: 'all 0.25s ease',
  },
};
