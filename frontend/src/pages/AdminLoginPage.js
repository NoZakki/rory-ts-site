/**
 * Admin Login Page — Cybersecurity Theme
 * Fixed: email field (was erroneously using 'username' state)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertTriangle } from 'lucide-react';
import { adminAPI } from '../services/api';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminAPI.login(email, password);
      if (response.data.admin) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access denied. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated bg grid */}
      <div style={styles.bgGrid} />

      <div style={styles.card}>
        {/* Top accent bar */}
        <div style={styles.accentBar} />

        <div style={styles.header}>
          <div style={styles.shieldWrapper}>
            <Shield size={48} color="#00f5ff" style={{ filter: 'drop-shadow(0 0 12px #00f5ff)' }} />
          </div>
          <div style={styles.titleBlock}>
            <div style={styles.terminalLine}>&gt;_ ADMIN ACCESS</div>
            <h1 style={styles.title}>SECURE PANEL</h1>
            <p style={styles.subtitle}>Authorized personnel only</p>
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            <AlertTriangle size={16} color="#ff0040" />
            <span>{error}</span>
          </div>
        )}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <Mail size={14} color="#00f5ff" style={styles.inputIcon} />
            <label style={styles.label} htmlFor="admin-email">EMAIL</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@admin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={14} color="#00f5ff" style={styles.inputIcon} />
            <label style={styles.label} htmlFor="admin-password">PASSWORD</label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner} />
                AUTHENTICATING...
              </>
            ) : (
              <>
                <Shield size={16} />
                ACCESS PANEL
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>
            &gt; CloudeStorage v2.0 — Admin Interface
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 60% 40%, #0a1628 0%, #050a0f 70%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  card: {
    background: 'linear-gradient(145deg, #0d1117 0%, #0a0e1a 100%)',
    border: '1px solid rgba(0, 245, 255, 0.25)',
    borderRadius: '16px',
    padding: '48px 40px 32px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,245,255,0.04)',
    position: 'relative',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #00f5ff, #e94560, transparent)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  shieldWrapper: {
    marginBottom: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    background: 'rgba(0,245,255,0.06)',
    borderRadius: '50%',
    border: '1px solid rgba(0,245,255,0.2)',
  },
  titleBlock: {},
  terminalLine: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#00ff41',
    letterSpacing: '0.15em',
    marginBottom: '8px',
    opacity: 0.8,
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '24px',
    fontWeight: 900,
    color: '#e0e6f0',
    letterSpacing: '0.12em',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#e94560',
    opacity: 0.7,
    letterSpacing: '0.08em',
    margin: 0,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,0,64,0.08)',
    border: '1px solid rgba(255,0,64,0.35)',
    borderRadius: '8px',
    padding: '12px 14px',
    marginBottom: '20px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '13px',
    color: '#ff0040',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputIcon: {
    display: 'none',
  },
  label: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#00f5ff',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  input: {
    background: '#060b14',
    border: '1px solid rgba(0,245,255,0.2)',
    borderRadius: '8px',
    padding: '13px 16px',
    color: '#00f5ff',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '14px',
    transition: 'all 0.25s ease',
    width: '100%',
  },
  button: {
    background: 'linear-gradient(135deg, #00f5ff 0%, #0099aa 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: "'Orbitron', monospace",
    letterSpacing: '0.12em',
    boxShadow: '0 4px 20px rgba(0,245,255,0.35)',
    transition: 'all 0.25s ease',
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(0,0,0,0.3)',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  footer: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(0,245,255,0.08)',
    textAlign: 'center',
  },
  footerText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#3a4a5a',
    letterSpacing: '0.06em',
  },
};

export default AdminLoginPage;
