/**
 * FileUpload Component
 * Drag-and-drop file upload form
 * SECURITY: Validates file type and size on client before sending
 */

import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

export const FileUpload = ({ onUpload, loading }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 52428800; // 50MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/zip',
  ];

  const validateFile = (file) => {
    setError('');

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return false;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('File type not allowed. Allowed: images, PDF, text, ZIP');
      return false;
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      onUpload(file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <div
        style={{
          ...styles.dropZone,
          ...(dragActive ? styles.dropZoneActive : {}),
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={40} color="var(--primary)" />
        <h3 style={styles.dropTitle}>Drop files here</h3>
        <p style={styles.dropText}>
          or click to browse (Max 50MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        style={styles.hiddenInput}
        onChange={handleChange}
        disabled={loading}
      />

      {error && (
        <div style={styles.error} className="alert alert-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading && (
        <div style={styles.loading}>
          <div className="spinner"></div>
          <p>Uploading file...</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  dropZone: {
    border: '2px dashed var(--primary)',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'rgba(102, 126, 234, 0.05)',
  },
  dropZoneActive: {
    background: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'var(--secondary)',
  },
  dropTitle: {
    margin: '12px 0 4px 0',
    color: 'var(--text-primary)',
  },
  dropText: {
    margin: 0,
    color: 'var(--text-secondary)',
    fontSize: '12px',
  },
  hiddenInput: {
    display: 'none',
  },
  error: {
    marginTop: '12px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginTop: '12px',
  },
};
