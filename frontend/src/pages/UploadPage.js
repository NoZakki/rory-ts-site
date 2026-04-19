/**
 * Upload Page
 * Advanced file upload with drag & drop
 */

import React, { useState } from 'react';
import { Upload, AlertCircle, X } from 'lucide-react';
import { filesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const maxFileSize = 52428800; // 50MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
  ];

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

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };

  const handleFiles = (fileList) => {
    setError('');
    const newFiles = [];

    for (let file of fileList) {
      // Validate file size
      if (file.size > maxFileSize) {
        setError(`File ${file.name} is too large (max 50MB)`);
        continue;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        setError(`File type not allowed: ${file.name}`);
        continue;
      }

      newFiles.push({
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        status: 'pending',
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleUpload = async () => {
    setUploading(true);
    setError('');

    for (const fileItem of files) {
      if (fileItem.status !== 'pending') continue;

      try {
        setUploadProgress((prev) => ({
          ...prev,
          [fileItem.id]: 0,
        }));

        await filesAPI.uploadFile(fileItem.file);

        setUploadProgress((prev) => ({
          ...prev,
          [fileItem.id]: 100,
        }));

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id ? { ...f, status: 'success' } : f
          )
        );
      } catch (err) {
        setError(`Failed to upload ${fileItem.name}`);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id ? { ...f, status: 'error' } : f
          )
        );
      }
    }

    setUploading(false);
  };

  const handleRemove = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClear = () => {
    setFiles([]);
    setError('');
  };

  const pendingFiles = files.filter((f) => f.status === 'pending');
  const successfulUploads = files.filter((f) => f.status === 'success').length;

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
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px',
    },
    dropZone: {
      border: dragActive ? '2px solid #e94560' : '2px dashed #e94560',
      borderRadius: '12px',
      padding: '40px 20px',
      textAlign: 'center',
      cursor: 'pointer',
      background: dragActive ? 'rgba(233, 69, 96, 0.1)' : 'transparent',
      transition: 'all 0.3s',
      marginBottom: '30px',
    },
    dropIcon: {
      color: '#e94560',
      marginBottom: '15px',
    },
    dropText: {
      color: '#fff',
      fontSize: '16px',
      marginBottom: '10px',
    },
    dropSubtext: {
      color: '#888',
      fontSize: '12px',
    },
    fileInput: {
      display: 'none',
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
      marginTop: '15px',
    },
    filesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '20px',
    },
    fileItem: {
      background: '#16213e',
      border: '1px solid #e94560',
      borderRadius: '8px',
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#fff',
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    fileSize: {
      fontSize: '12px',
      color: '#888',
    },
    progressBar: {
      background: '#0f3460',
      borderRadius: '4px',
      height: '4px',
      width: '100px',
      margin: '8px 0',
    },
    progressFill: {
      background: '#4ade80',
      height: '100%',
      borderRadius: '4px',
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    errorBadge: {
      background: 'rgba(255, 107, 107, 0.2)',
      color: '#ff6b6b',
    },
    successBadge: {
      background: 'rgba(74, 222, 128, 0.2)',
      color: '#4ade80',
    },
    pendingBadge: {
      background: 'rgba(233, 69, 96, 0.2)',
      color: '#e94560',
    },
    actions: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    actionBtn: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '14px',
    },
    uploadBtn: {
      background: '#e94560',
      color: '#fff',
    },
    viewBtn: {
      background: 'rgba(233, 69, 96, 0.2)',
      color: '#e94560',
      border: '1px solid #e94560',
    },
    clearBtn: {
      background: 'rgba(255, 107, 107, 0.2)',
      color: '#ff6b6b',
      border: '1px solid #ff6b6b',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Upload size={32} color="#e94560" /> Upload Files
        </h1>
        <p style={{ color: '#888' }}>Upload your files securely to the cloud</p>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            padding: '15px',
            color: '#ff6b6b',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div
        style={styles.dropZone}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload size={48} style={styles.dropIcon} />
        <div style={styles.dropText}>Drag and drop files here</div>
        <div style={styles.dropSubtext}>or click to browse</div>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          style={styles.fileInput}
          id="file-input"
          accept={allowedTypes.join(',')}
        />
        <button
          style={styles.button}
          onClick={() => document.getElementById('file-input').click()}
        >
          Browse Files
        </button>
      </div>

      {files.length > 0 && (
        <>
          <div style={styles.filesList}>
            {files.map((fileItem) => (
              <div key={fileItem.id} style={styles.fileItem}>
                <div style={styles.fileInfo}>
                  <div style={styles.fileName}>{fileItem.name}</div>
                  <div style={styles.fileSize}>
                    {(fileItem.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  {uploadProgress[fileItem.id] !== undefined && (
                    <>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${uploadProgress[fileItem.id]}%`,
                          }}
                        ></div>
                      </div>
                      <div style={{ fontSize: '10px', color: '#888' }}>
                        {uploadProgress[fileItem.id]}%
                      </div>
                    </>
                  )}
                </div>

                <div
                  style={{
                    ...styles.statusBadge,
                    ...(fileItem.status === 'success'
                      ? styles.successBadge
                      : fileItem.status === 'error'
                      ? styles.errorBadge
                      : styles.pendingBadge),
                  }}
                >
                  {fileItem.status === 'success' && '✓ Uploaded'}
                  {fileItem.status === 'error' && '✗ Failed'}
                  {fileItem.status === 'pending' && '⏳ Pending'}
                </div>

                {fileItem.status === 'pending' && (
                  <button
                    onClick={() => handleRemove(fileItem.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff6b6b',
                      cursor: 'pointer',
                      marginLeft: '10px',
                    }}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            {pendingFiles.length > 0 && (
              <button
                style={{ ...styles.actionBtn, ...styles.uploadBtn }}
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? '⏳ Uploading...' : `Upload ${pendingFiles.length} File(s)`}
              </button>
            )}

            {successfulUploads > 0 && (
              <button
                style={{ ...styles.actionBtn, ...styles.viewBtn }}
                onClick={() => navigate('/files')}
              >
                View Files
              </button>
            )}

            {files.length > 0 && (
              <button
                style={{ ...styles.actionBtn, ...styles.clearBtn }}
                onClick={handleClear}
                disabled={uploading}
              >
                Clear
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UploadPage;
