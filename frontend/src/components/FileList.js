/**
 * FileList Component
 * Display user's files in a table
 */

import React, { useState } from 'react';
import { Download, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { FileNoteModal } from './FileNoteModal';

export const FileList = ({
  files = [],
  loading,
  onDelete,
  onDownload,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const handleDeleteClick = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      onDelete(fileId);
    }
  };

  if (loading) {
    return (
      <div style={styles.empty}>
        <div className="spinner"></div>
        <p>Loading files...</p>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div style={styles.empty}>
        <AlertCircle size={32} color="var(--text-secondary)" />
        <p>No files uploaded yet</p>
        <p style={styles.emptySubtext}>
          Upload your first file to get started
        </p>
      </div>
    );
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Size</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id}>
              <td style={styles.filename}>{file.original_name}</td>
              <td>{formatFileSize(file.size)}</td>
              <td>{formatDate(file.created_at)}</td>
              <td>
                <div style={styles.actions}>
                  <button
                    onClick={() => onDownload(file.id, file.original_name)}
                    style={styles.actionBtn}
                    title="Download"
                    className="btn btn-small btn-secondary"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFile(file);
                      setShowNoteModal(true);
                    }}
                    style={styles.actionBtn}
                    title="Add note"
                    className="btn btn-small btn-secondary"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(file.id)}
                    style={styles.actionBtn}
                    title="Delete"
                    className="btn btn-small btn-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFile && (
        <FileNoteModal
          file={selectedFile}
          isOpen={showNoteModal}
          onClose={() => {
            setShowNoteModal(false);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  emptySubtext: {
    margin: '8px 0 0 0',
    fontSize: '12px',
  },
  filename: {
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-start',
  },
  actionBtn: {
    padding: '6px 8px',
  },
};
