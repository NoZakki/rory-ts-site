/**
 * Work In Progress Page
 * Placeholder for upcoming features
 */

import React from 'react';
import { Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkInProgressPage = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
    },
    icon: {
      fontSize: '80px',
      marginBottom: '20px',
    },
    title: {
      color: '#fff',
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '15px',
    },
    description: {
      color: '#888',
      fontSize: '16px',
      maxWidth: '500px',
      marginBottom: '30px',
      lineHeight: '1.6',
    },
    features: {
      background: 'rgba(233, 69, 96, 0.1)',
      border: '1px solid #e94560',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '30px',
      maxWidth: '500px',
      textAlign: 'left',
    },
    featureTitle: {
      color: '#e94560',
      fontWeight: 'bold',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    featureList: {
      color: '#888',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    button: {
      background: '#e94560',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>⚡</div>

      <h1 style={styles.title}>Work In Progress</h1>

      <p style={styles.description}>
        Exciting new features are coming soon! We're working hard to bring you amazing new capabilities.
      </p>

      <div style={styles.features}>
        <div style={styles.featureTitle}>
          <Zap size={20} /> Coming Soon
        </div>
        <div style={styles.featureList}>
          <div style={styles.featureItem}>
            ✨ Advanced file organization
          </div>
          <div style={styles.featureItem}>
            🔄 Batch file operations
          </div>
          <div style={styles.featureItem}>
            👥 Team collaboration features
          </div>
          <div style={styles.featureItem}>
            📊 Storage analytics & reports
          </div>
          <div style={styles.featureItem}>
            🔔 Real-time notifications
          </div>
          <div style={styles.featureItem}>
            🌍 Multi-language support
          </div>
        </div>
      </div>

      <button
        style={styles.button}
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>
    </div>
  );
};

export default WorkInProgressPage;
