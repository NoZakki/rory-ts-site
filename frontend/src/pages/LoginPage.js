/**
 * Login Page — Cybersecurity Dark Theme
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  // Matrix rain canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコサシスセソタチTSUTETO ABCDEFG0101'.split('');
    const fontSize = 13;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 255, 65, 0.2)';
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={styles.card}>
        <div style={styles.accentBar} />

        <div style={styles.header}>
          <div style={styles.iconRing}>
            <ShieldCheck size={36} color="#00f5ff" style={{ filter: 'drop-shadow(0 0 10px #00f5ff)' }} />
          </div>
          <div style={styles.terminalBadge}>&gt;_ SECURE AUTH</div>
          <h1 style={styles.title}>CloudeStorage</h1>
          <p style={styles.subtitle}>Enter your credentials to access the system</p>
        </div>

        {(error || formError) && (
          <div style={styles.errorBox}>
            <AlertCircle size={15} />
            <span>{error || formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="login-email">
              <Mail size={12} /> Email Address
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
              autoComplete="username"
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="login-password">
              <Lock size={12} /> Password
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? (
              <><span style={styles.spinner} /> AUTHENTICATING...</>
            ) : (
              <><ShieldCheck size={15} /> ACCESS SYSTEM</>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            No account?{' '}
            <Link to="/register" style={styles.footerLink}>
              Register &rarr;
            </Link>
          </p>
          <Link to="/admin-login" style={styles.adminLink}>
            &gt;_ Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: '#050a0f',
    position: 'relative',
    overflow: 'hidden',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(10, 14, 26, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,245,255,0.2)',
    borderRadius: '16px',
    padding: '48px 40px 36px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 24px 80px rgba(0,0,0,0.9), 0 0 40px rgba(0,245,255,0.05)',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #00f5ff 40%, #e94560 80%, transparent)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  iconRing: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '76px',
    height: '76px',
    background: 'rgba(0,245,255,0.06)',
    border: '1px solid rgba(0,245,255,0.2)',
    borderRadius: '50%',
    marginBottom: '16px',
  },
  terminalBadge: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#00ff41',
    letterSpacing: '0.15em',
    marginBottom: '10px',
    opacity: 0.9,
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '22px',
    fontWeight: 900,
    color: '#e0e6f0',
    letterSpacing: '0.08em',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#3a4a5a',
    letterSpacing: '0.04em',
    margin: 0,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,0,64,0.08)',
    border: '1px solid rgba(255,0,64,0.35)',
    borderRadius: '8px',
    padding: '11px 14px',
    marginBottom: '20px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#ff0040',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#00f5ff',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  input: {
    background: '#060b14',
    border: '1px solid rgba(0,245,255,0.18)',
    borderRadius: '8px',
    padding: '13px 16px',
    color: '#00f5ff',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '14px',
    transition: 'all 0.25s ease',
    width: '100%',
    outline: 'none',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #00f5ff 0%, #0099aa 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: "'Orbitron', monospace",
    letterSpacing: '0.1em',
    boxShadow: '0 4px 20px rgba(0,245,255,0.35)',
    transition: 'all 0.25s ease',
    marginTop: '4px',
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(0,0,0,0.25)',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(0,245,255,0.08)',
  },
  footerText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#3a4a5a',
    margin: 0,
  },
  footerLink: {
    color: '#00f5ff',
    textDecoration: 'none',
    fontWeight: 600,
  },
  adminLink: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#e94560',
    textDecoration: 'none',
    opacity: 0.7,
    letterSpacing: '0.06em',
    transition: 'opacity 0.2s',
  },
};
