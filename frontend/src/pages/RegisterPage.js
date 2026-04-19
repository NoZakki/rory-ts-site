/**
 * Register Page — Cybersecurity Dark Theme
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';

const RequirementCheck = ({ met, text }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: met ? '#00ff41' : '#3a4a5a',
    transition: 'color 0.2s ease',
  }}>
    <CheckCircle size={13} color={met ? '#00ff41' : '#2a3a4a'} />
    {text}
  </div>
);

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [formError, setFormError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Mini matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const chars = '01アイウエオ01'.split('');
    const fontSize = 12;
    let drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(5,10,15,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0,255,65,0.18)';
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const interval = setInterval(draw, 60);
    return () => { clearInterval(interval); window.removeEventListener('resize', resize); };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (formData.password !== formData.passwordConfirm) {
      setFormError('Le password non coincidono');
      return;
    }
    if (!Object.values(passwordStrength).every(v => v)) {
      setFormError('La password non soddisfa i requisiti di sicurezza');
      return;
    }
    try {
      await register(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Registrazione fallita');
    }
  };

  const allMet = Object.values(passwordStrength).every(v => v);

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={styles.card}>
        <div style={styles.accentBar} />

        <div style={styles.header}>
          <div style={styles.iconRing}>
            <UserPlus size={32} color="#00f5ff" style={{ filter: 'drop-shadow(0 0 10px #00f5ff)' }} />
          </div>
          <div style={styles.badge}>&gt;_ NEW_USER_INIT</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join CloudeStorage — 500MB free</p>
        </div>

        {(error || formError) && (
          <div style={styles.errorBox}>
            <AlertCircle size={15} />
            <span>{error || formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="reg-email">
              <Mail size={12} /> Email
            </label>
            <input
              id="reg-email"
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
            <label style={styles.label} htmlFor="reg-password">
              <Lock size={12} /> Password
            </label>
            <input
              id="reg-password"
              type="password"
              name="password"
              placeholder="Crea una password sicura"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
              autoComplete="new-password"
            />
            {formData.password && (
              <div style={styles.strengthBox}>
                <div style={styles.strengthTitle}>REQUISITI PASSWORD</div>
                <RequirementCheck met={passwordStrength.length} text="Minimo 8 caratteri" />
                <RequirementCheck met={passwordStrength.uppercase} text="Una lettera maiuscola" />
                <RequirementCheck met={passwordStrength.lowercase} text="Una lettera minuscola" />
                <RequirementCheck met={passwordStrength.number} text="Un numero" />
                <RequirementCheck met={passwordStrength.special} text="Un carattere speciale (!@#$%)" />
              </div>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="reg-confirm">
              <Lock size={12} /> Conferma Password
            </label>
            <input
              id="reg-confirm"
              type="password"
              name="passwordConfirm"
              placeholder="Ripeti la password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(formData.passwordConfirm && {
                  borderColor: formData.password === formData.passwordConfirm
                    ? 'rgba(0,255,65,0.5)'
                    : 'rgba(255,0,64,0.5)',
                }),
              }}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              opacity: loading || !allMet ? 0.5 : 1,
              cursor: loading || !allMet ? 'not-allowed' : 'pointer',
            }}
            disabled={loading || !allMet}
          >
            {loading ? (
              <><span style={styles.spinner} /> CREANDO ACCOUNT...</>
            ) : (
              <><UserPlus size={15} /> REGISTRATI</>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Hai già un account?{' '}
            <Link to="/login" style={styles.footerLink}>Accedi &rarr;</Link>
          </p>
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
    opacity: 0.5,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(10,14,26,0.96)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,245,255,0.2)',
    borderRadius: '16px',
    padding: '44px 36px 32px',
    maxWidth: '440px',
    width: '100%',
    boxShadow: '0 24px 80px rgba(0,0,0,0.9)',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #00f5ff 40%, #e94560 80%, transparent)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  iconRing: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70px',
    height: '70px',
    background: 'rgba(0,245,255,0.06)',
    border: '1px solid rgba(0,245,255,0.2)',
    borderRadius: '50%',
    marginBottom: '14px',
  },
  badge: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#00ff41',
    letterSpacing: '0.15em',
    marginBottom: '10px',
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '20px',
    fontWeight: 900,
    color: '#e0e6f0',
    letterSpacing: '0.08em',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#3a4a5a',
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
    marginBottom: '16px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#ff0040',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
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
    padding: '12px 14px',
    color: '#00f5ff',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '13px',
    transition: 'all 0.25s ease',
    width: '100%',
    outline: 'none',
  },
  strengthBox: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(0,245,255,0.08)',
    borderRadius: '8px',
    padding: '12px 14px',
    marginTop: '6px',
  },
  strengthTitle: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '9px',
    color: '#3a4a5a',
    letterSpacing: '0.15em',
    marginBottom: '8px',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #00f5ff 0%, #0099aa 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '12px',
    fontWeight: 700,
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
    width: '13px',
    height: '13px',
    border: '2px solid rgba(0,0,0,0.25)',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '16px',
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
};
