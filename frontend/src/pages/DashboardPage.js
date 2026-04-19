/**
 * Dashboard Page — Cybersecurity Theme
 */

import React, { useState, useEffect } from 'react';
import { filesAPI } from '../services/api';
import { FileList } from '../components/FileList';
import { FileUpload } from '../components/FileUpload';
import { Navigation } from '../components/Navigation';
import { AlertCircle, FolderOpen, HardDrive, Activity, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => { loadFiles(); }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await filesAPI.getUserFiles();
      setFiles(response.data.files || []);
    } catch (err) {
      setError('Impossibile caricare i file. Verifica la connessione.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setError('');
      setUploadSuccess('');
      await filesAPI.uploadFile(file);
      setUploadSuccess(`File "${file.name}" caricato con successo!`);
      await loadFiles();
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il caricamento del file');
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      await filesAPI.deleteFile(fileId);
      setUploadSuccess('File eliminato con successo');
      await loadFiles();
    } catch (err) {
      setError('Errore durante l\'eliminazione del file');
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await filesAPI.downloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Errore durante il download del file');
    }
  };

  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
  const quotaMB = 500;
  const usagePercent = Math.min((totalMB / quotaMB) * 100, 100).toFixed(1);

  return (
    <div style={styles.page}>
      <Navigation />

      <div style={styles.container}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.breadcrumb}>&gt;_ dashboard / my_files</div>
            <h1 style={styles.title}>
              <FolderOpen size={24} color="#00f5ff" style={{ marginRight: 12, filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
              My Files
            </h1>
            <p style={styles.subtitle}>
              Encrypted storage — {user?.email || ''}
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><HardDrive size={20} color="#00f5ff" /></div>
            <div>
              <div style={styles.statValue}>{totalMB} MB</div>
              <div style={styles.statLabel}>Usato / 500MB</div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${usagePercent}%` }} />
              </div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><Activity size={20} color="#00ff41" /></div>
            <div>
              <div style={styles.statValue}>{files.length}</div>
              <div style={styles.statLabel}>File totali</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><Shield size={20} color="#e94560" /></div>
            <div>
              <div style={styles.statValue}>AES-256</div>
              <div style={styles.statLabel}>Crittografia attiva</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        {uploadSuccess && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            <AlertCircle size={16} />
            {uploadSuccess}
          </div>
        )}

        {/* Main grid */}
        <div style={styles.grid}>
          <div style={styles.uploadSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>&gt;_ UPLOAD_FILE</span>
            </div>
            <FileUpload onUpload={handleFileUpload} loading={loading} />
          </div>

          <div style={styles.filesSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>&gt;_ FILE_LIST</span>
              <span style={styles.fileCount}>{files.length} files</span>
            </div>
            <FileList
              files={files}
              loading={loading}
              onDelete={handleFileDelete}
              onDownload={handleDownloadFile}
            />
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
    paddingBottom: '60px',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  pageHeader: {
    marginBottom: '28px',
  },
  breadcrumb: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#3a4a5a',
    letterSpacing: '0.06em',
    marginBottom: '8px',
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '24px',
    fontWeight: 900,
    color: '#e0e6f0',
    display: 'flex',
    alignItems: 'center',
    margin: '0 0 6px 0',
    letterSpacing: '0.06em',
  },
  subtitle: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#3a4a5a',
    letterSpacing: '0.04em',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  statCard: {
    background: '#0d1117',
    border: '1px solid rgba(0,245,255,0.1)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    width: '44px',
    height: '44px',
    background: 'rgba(0,245,255,0.06)',
    border: '1px solid rgba(0,245,255,0.15)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statValue: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '18px',
    fontWeight: 700,
    color: '#e0e6f0',
    marginBottom: '4px',
    letterSpacing: '0.04em',
  },
  statLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#3a4a5a',
    letterSpacing: '0.06em',
  },
  progressBar: {
    width: '120px',
    height: '4px',
    background: 'rgba(0,245,255,0.1)',
    borderRadius: '2px',
    marginTop: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00f5ff, #e94560)',
    borderRadius: '2px',
    transition: 'width 0.6s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '20px',
  },
  uploadSection: {
    background: '#0d1117',
    border: '1px solid rgba(0,245,255,0.12)',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  filesSection: {
    background: '#0d1117',
    border: '1px solid rgba(0,245,255,0.12)',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid rgba(0,245,255,0.08)',
    background: 'rgba(0,245,255,0.02)',
  },
  sectionTitle: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    color: '#00ff41',
    letterSpacing: '0.1em',
  },
  fileCount: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: '#3a4a5a',
    letterSpacing: '0.06em',
  },
};
