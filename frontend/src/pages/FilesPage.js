/**
 * Files Page
 * Display all uploaded files with storage quota and sharing options
 */

import React, { useState, useEffect } from 'react';
import { Download, Trash2, Share2, Copy, Check } from 'lucide-react';
import { filesAPI } from '../services/api';
import { shareAPI } from '../services/api';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [shares, setShares] = useState({});
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(null);
  const [storageUsed] = useState(0); // Will be fetched from user profile
  const storageLimit = 500; // 500MB for testing

  useEffect(() => {
    loadFiles();
    loadShares();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await filesAPI.getUserFiles();
      setFiles(res.data.files || []);
    } catch (err) {
      console.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const loadShares = async () => {
    try {
      const res = await shareAPI.getUserShares();
      const sharesMap = {};
      res.data.shares.forEach((share) => {
        sharesMap[share.id] = share;
      });
      setShares(sharesMap);
    } catch (err) {
      console.error('Failed to load shares');
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const blob = await filesAPI.downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download file');
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Delete this file?')) return;

    try {
      await filesAPI.deleteFile(fileId);
      loadFiles();
    } catch (err) {
      console.error('Failed to delete file');
    }
  };

  const handleShare = async (fileId) => {
    try {
      const res = await shareAPI.createShare(fileId);
      setShares((prev) => ({
        ...prev,
        [fileId]: { share_token: res.data.shareToken },
      }));
    } catch (err) {
      console.error('Failed to create share');
    }
  };

  const handleCopyLink = (token) => {
    const shareLink = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(shareLink);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
      padding: '20px',
    },
    header: {
      color: '#fff',
      marginBottom: '30px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    storageContainer: {
      background: '#16213e',
      border: '1px solid #e94560',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '30px',
    },
    storageLabel: {
      color: '#fff',
      marginBottom: '10px',
      fontSize: '14px',
    },
    storageBar: {
      background: '#0f3460',
      borderRadius: '8px',
      height: '10px',
      overflow: 'hidden',
      marginBottom: '10px',
    },
    storageUsed: {
      background: '#e94560',
      height: '100%',
      width: `${(storageUsed / storageLimit) * 100}%`,
      transition: 'width 0.3s',
    },
    storageText: {
      color: '#888',
      fontSize: '12px',
    },
    filesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
    },
    fileCard: {
      background: '#16213e',
      border: '1px solid #e94560',
      borderRadius: '12px',
      padding: '20px',
      color: '#fff',
    },
    filename: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#fff',
      wordBreak: 'break-word',
    },
    fileInfo: {
      fontSize: '12px',
      color: '#888',
      marginBottom: '15px',
    },
    actions: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    actionBtn: {
      background: '#e94560',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '12px',
      flex: '1',
      minWidth: '80px',
      justifyContent: 'center',
    },
    deleteBtn: {
      background: '#ff6b6b',
    },
    shareSection: {
      background: 'rgba(233, 69, 96, 0.1)',
      border: '1px solid #e94560',
      borderRadius: '8px',
      padding: '10px',
      marginTop: '15px',
    },
    shareLink: {
      background: '#0f3460',
      border: '1px solid #e94560',
      borderRadius: '6px',
      padding: '8px',
      color: '#888',
      fontSize: '11px',
      wordBreak: 'break-all',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    copyBtn: {
      background: '#e94560',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      cursor: 'pointer',
      fontSize: '11px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📁 Your Files</h1>
      </div>

      <div style={styles.storageContainer}>
        <div style={styles.storageLabel}>Storage Quota</div>
        <div style={styles.storageBar}>
          <div style={styles.storageUsed}></div>
        </div>
        <div style={styles.storageText}>
          {storageUsed.toFixed(2)} MB / {storageLimit} MB used
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#fff', textAlign: 'center' }}>Loading files...</div>
      ) : files.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
          No files uploaded yet. Upload your first file to get started!
        </div>
      ) : (
        <div style={styles.filesGrid}>
          {files.map((file) => (
            <div key={file.id} style={styles.fileCard}>
              <div style={styles.filename}>{file.original_name}</div>
              <div style={styles.fileInfo}>
                {(file.size / 1024).toFixed(2)} KB • {new Date(file.created_at).toLocaleDateString()}
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.actionBtn}
                  onClick={() => handleDownload(file.id, file.original_name)}
                >
                  <Download size={16} /> Download
                </button>
                <button
                  style={styles.actionBtn}
                  onClick={() => handleShare(file.id)}
                >
                  <Share2 size={16} /> Share
                </button>
                <button
                  style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                  onClick={() => handleDelete(file.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>

              {shares[file.id] && (
                <div style={styles.shareSection}>
                  <div style={{ fontSize: '12px', color: '#fff', marginBottom: '8px' }}>
                    ✅ Shared
                  </div>
                  <div style={styles.shareLink}>
                    <span>/share/{shares[file.id].share_token.substring(0, 10)}...</span>
                    <button
                      style={styles.copyBtn}
                      onClick={() => handleCopyLink(shares[file.id].share_token)}
                    >
                      {copiedToken === shares[file.id].share_token ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilesPage;
