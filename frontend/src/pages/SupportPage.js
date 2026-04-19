/**
 * Support Chat Page — AI-Powered with Cybersecurity Theme
 */

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Bot, User, Zap, HelpCircle, Upload, Lock, FolderOpen, Share2 } from 'lucide-react';
import { supportAPI } from '../services/api';
import { Navigation } from '../components/Navigation';

const QUICK_ACTIONS = [
  { label: 'Come carico file?', icon: Upload },
  { label: 'Come funziona la sicurezza?', icon: Lock },
  { label: 'Come condivido un file?', icon: Share2 },
  { label: 'Quanto spazio ho?', icon: FolderOpen },
  { label: 'Ho un problema con il login', icon: HelpCircle },
];

const TypingDots = () => (
  <div style={styles.typingDots}>
    {[0, 1, 2].map(i => (
      <span
        key={i}
        style={{
          ...styles.dot,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

const SupportPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Welcome message
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: 'Sistema di supporto AI attivo. Sono addestrato per rispondere a domande su upload, file, sicurezza, account e funzionalità della piattaforma. Come posso aiutarti?',
          isAI: true,
          timestamp: new Date(),
        },
      ]);
    }, 600);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await supportAPI.sendMessage(text);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          content: res.data.botResponse,
          isAI: res.data.isAI,
          supportEmail: res.data.supportEmail,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'error',
          content: 'Connessione al server di supporto interrotta. Riprova o contatta: 404@404.com',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (label) => {
    sendMessage(label);
    inputRef.current?.focus();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  // Simple bold markdown renderer
  const renderContent = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} style={{ color: '#00f5ff', fontWeight: 700 }}>{part}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div style={styles.page}>
      <Navigation />

      <div style={styles.main}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconBox}>
              <Bot size={24} color="#00f5ff" />
            </div>
            <div>
              <h1 style={styles.title}>AI Support Terminal</h1>
              <div style={styles.statusRow}>
                <span style={styles.statusDot} />
                <span style={styles.statusText}>Sistema attivo — Risposta immediata</span>
              </div>
            </div>
          </div>
          <div style={styles.aiPill}>
            <Zap size={12} color="#00ff41" />
            AI-Powered
          </div>
        </div>

        <div style={styles.layout}>
          {/* Chat window */}
          <div style={styles.chatWindow}>
            {/* Messages */}
            <div style={styles.messagesArea}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    ...styles.messageRow,
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    animation: 'fadeInUp 0.3s ease',
                  }}
                >
                  {msg.type !== 'user' && (
                    <div style={styles.avatarBot}>
                      <Bot size={14} color={msg.type === 'error' ? '#ff0040' : '#00f5ff'} />
                    </div>
                  )}

                  <div style={{
                    ...styles.bubble,
                    ...(msg.type === 'user' ? styles.bubbleUser : {}),
                    ...(msg.type === 'error' ? styles.bubbleError : {}),
                    ...(msg.type === 'bot' ? styles.bubbleBot : {}),
                  }}>
                    <div style={styles.bubbleContent}>
                      {renderContent(msg.content)}
                    </div>
                    {msg.supportEmail && (
                      <div style={styles.emailHint}>
                        📧 {msg.supportEmail}
                      </div>
                    )}
                    <div style={styles.timestamp}>
                      {msg.timestamp ? formatTime(msg.timestamp) : ''}
                    </div>
                  </div>

                  {msg.type === 'user' && (
                    <div style={styles.avatarUser}>
                      <User size={14} color="#00f5ff" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
                  <div style={styles.avatarBot}>
                    <Bot size={14} color="#00f5ff" />
                  </div>
                  <div style={{ ...styles.bubble, ...styles.bubbleBot }}>
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div style={styles.quickActions}>
              {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => handleQuickAction(label)}
                  style={styles.quickBtn}
                  disabled={loading}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>

            {/* Input area */}
            <form style={styles.inputArea} onSubmit={handleSubmit}>
              <div style={styles.inputWrapper}>
                <span style={styles.inputPrefix}>&gt;_</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Scrivi un messaggio al sistema di supporto..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={styles.input}
                  disabled={loading}
                  maxLength={1000}
                />
              </div>
              <button
                type="submit"
                style={{ ...styles.sendBtn, opacity: loading || !input.trim() ? 0.5 : 1 }}
                disabled={loading || !input.trim()}
              >
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Info sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.sideCard}>
              <div style={styles.sideCardTitle}>
                <Terminal size={14} color="#00f5ff" />
                Capacità AI
              </div>
              {[
                'Gestione file e upload',
                'Sicurezza e crittografia',
                'Condivisione link',
                'Gestione account',
                'Quota storage',
                'Troubleshooting login',
                'Funzionalità piattaforma',
              ].map(cap => (
                <div key={cap} style={styles.capItem}>
                  <span style={styles.capDot} />
                  {cap}
                </div>
              ))}
            </div>

            <div style={styles.sideCard}>
              <div style={styles.sideCardTitle}>
                <Lock size={14} color="#e94560" />
                Supporto Diretto
              </div>
              <p style={styles.sideDesc}>
                Per problemi complessi o assistenza urgente, contatta il team via email.
              </p>
              <a href="mailto:404@404.com" style={styles.emailLink}>
                📧 404@404.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#050a0f',
  },
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconBox: {
    width: '52px',
    height: '52px',
    background: 'rgba(0,245,255,0.08)',
    border: '1px solid rgba(0,245,255,0.25)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '20px',
    fontWeight: 900,
    color: '#e0e6f0',
    letterSpacing: '0.08em',
    margin: '0 0 6px 0',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#00ff41',
    boxShadow: '0 0 8px #00ff41',
    animation: 'neonPulse 2s infinite',
  },
  statusText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#3a4a5a',
    letterSpacing: '0.04em',
  },
  aiPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(0,255,65,0.06)',
    border: '1px solid rgba(0,255,65,0.25)',
    borderRadius: '20px',
    padding: '6px 14px',
    fontFamily: "'Orbitron', monospace",
    fontSize: '11px',
    color: '#00ff41',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 260px',
    gap: '20px',
    alignItems: 'start',
  },
  chatWindow: {
    background: '#0d1117',
    border: '1px solid rgba(0,245,255,0.15)',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '640px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  avatarBot: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: 'rgba(0,245,255,0.08)',
    border: '1px solid rgba(0,245,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarUser: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: 'rgba(233,69,96,0.1)',
    border: '1px solid rgba(233,69,96,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '70%',
    padding: '12px 14px',
    borderRadius: '12px',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '14px',
    lineHeight: 1.6,
    wordBreak: 'break-word',
  },
  bubbleBot: {
    background: 'rgba(0,245,255,0.06)',
    border: '1px solid rgba(0,245,255,0.15)',
    color: '#c0c8d4',
    borderBottomLeftRadius: '4px',
  },
  bubbleUser: {
    background: 'linear-gradient(135deg, rgba(233,69,96,0.25) 0%, rgba(180,50,75,0.2) 100%)',
    border: '1px solid rgba(233,69,96,0.3)',
    color: '#e0e6f0',
    borderBottomRightRadius: '4px',
  },
  bubbleError: {
    background: 'rgba(255,0,64,0.07)',
    border: '1px solid rgba(255,0,64,0.25)',
    color: '#ff6060',
    borderBottomLeftRadius: '4px',
  },
  bubbleContent: {
    marginBottom: '4px',
  },
  emailHint: {
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(0,245,255,0.1)',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#00f5ff',
    opacity: 0.7,
  },
  timestamp: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '10px',
    color: '#3a4a5a',
    marginTop: '4px',
    textAlign: 'right',
  },
  typingDots: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 0',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#00f5ff',
    opacity: 0.5,
    animation: 'neonPulse 1.2s ease-in-out infinite',
  },
  quickActions: {
    padding: '12px 16px',
    borderTop: '1px solid rgba(0,245,255,0.08)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    background: 'rgba(0,0,0,0.2)',
  },
  quickBtn: {
    background: 'rgba(0,245,255,0.05)',
    border: '1px solid rgba(0,245,255,0.15)',
    color: '#7a8a9a',
    borderRadius: '20px',
    padding: '5px 12px',
    fontSize: '11px',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    letterSpacing: '0.02em',
    transition: 'all 0.2s ease',
    textTransform: 'none',
  },
  inputArea: {
    borderTop: '1px solid rgba(0,245,255,0.12)',
    padding: '14px 16px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    background: 'rgba(6,11,20,0.6)',
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#060b14',
    border: '1px solid rgba(0,245,255,0.18)',
    borderRadius: '8px',
    padding: '0 14px',
  },
  inputPrefix: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '13px',
    color: '#00ff41',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e0e6f0',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '13px',
    padding: '12px 0',
    width: '100%',
    boxShadow: 'none',
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #00f5ff 0%, #0099aa 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,245,255,0.3)',
    transition: 'all 0.2s ease',
    flexShrink: 0,
    padding: 0,
    textTransform: 'none',
    letterSpacing: 'normal',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sideCard: {
    background: '#0d1117',
    border: '1px solid rgba(0,245,255,0.1)',
    borderRadius: '12px',
    padding: '20px',
  },
  sideCardTitle: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '11px',
    color: '#e0e6f0',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  capItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 0',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '13px',
    color: '#7a8a9a',
    borderBottom: '1px solid rgba(0,245,255,0.05)',
  },
  capDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#00f5ff',
    flexShrink: 0,
    opacity: 0.6,
  },
  sideDesc: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '13px',
    color: '#7a8a9a',
    lineHeight: 1.6,
    margin: '0 0 12px 0',
  },
  emailLink: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#00f5ff',
    textDecoration: 'none',
    display: 'block',
  },
};

export default SupportPage;
