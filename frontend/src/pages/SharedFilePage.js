/**
 * Shared File Page
 * Public page for accessing shared files
 * Redirects to login if user not authenticated
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, AlertCircle, Lock } from 'lucide-react';
import { shareAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SharedFilePage = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadSharedFile();
  }, [loadSharedFile]);

  const loadSharedFile = useCallback(async () => {
    try {
      const res = await shareAPI.getSharedFile(shareToken);
      setFile(res.data.file);
    } catch (err) {
      setError('Share link not found or expired');
    } finally {
      setLoading(false);
    }
  }, [shareToken]);

  const handleDownload = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setDownloading(true);
      const blob = await shareAPI.downloadSharedFile(shareToken);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.original_name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    card: {
      background: '#16213e',
      border: '1px solid #e94560',
      borderRadius: '12px',
      padding: '40px',
      maxWidth: '500px',
      width: '100%',
    },
    icon: {
      width: '80px',
      height: '80px',
      margin: '0 auto 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(233, 69, 96, 0.1)',
      borderRadius: '12px',
      color: '#e94560',
    },
    title: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '20px',
    },
    error: {
      background: 'rgba(255, 107, 107, 0.1)',
      border: '1px solid #ff6b6b',
      borderRadius: '8px',
      padding: '15px',
      color: '#ff6b6b',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    fileInfo: {
      background: 'rgba(233, 69, 96, 0.1)',
      border: '1px solid #e94560',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      color: '#fff',
    },
    fileName: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    fileDetails: {
      fontSize: '12px',
      color: '#888',
    },
    button: {
      background: '#e94560',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '12px',
      width: '100%',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '10px',
    },
    secondaryButton: {
      background: 'rgba(233, 69, 96, 0.2)',
      color: '#e94560',
      border: '1px solid #e94560',
    },
    message: {
      color: '#888',
      textAlign: 'center',
      padding: '20px',
      fontSize: '12px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>
          <Lock size={40} />
        </div>

        <h1 style={styles.title}>
          {loading ? 'Loading...' : error ? 'File Not Found' : 'Shared File'}
        </h1>

        {error && (
          <div style={styles.error}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {!loading && file && (
          <>
            <div style={styles.fileInfo}>
              <div style={styles.fileName}>📄 {file.original_name}</div>
              <div style={styles.fileDetails}>
                Size: {(file.size / 1024).toFixed(2)} KB
              </div>
              <div style={styles.fileDetails}>
                Shared by: {file.email}
              </div>
            </div>

            {!user ? (
              <>
                <button
                  style={styles.button}
                  onClick={() => navigate('/login')}
                >
                  <Lock size={18} /> Login to Download
                </button>
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </button>
              </>
            ) : (
              <button
                style={styles.button}
                onClick={handleDownload}
                disabled={downloading}
              >
                <Download size={18} />
                {downloading ? 'Downloading...' : 'Download File'}
              </button>
            )}

            <div style={styles.message}>
              ℹ️ This file is shared with you for {user ? 'download' : 'viewing after login'}.
            </div>
          </>
        )}

        {loading && (
          <div style={styles.message}>
            Loading file details...
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedFilePage;
