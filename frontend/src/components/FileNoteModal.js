/**
 * FileNoteModal Component
 * Modal for viewing and editing file notes
 */

import React, { useState, useEffect, useCallback } from 'react';
import { filesAPI } from '../services/api';
import { X, AlertCircle } from 'lucide-react';

export const FileNoteModal = ({ file, isOpen, onClose }) => {
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadNote = useCallback(async () => {
    try {
      setLoading(true);
      const response = await filesAPI.getFileNote(file.id);
      setNoteContent(response.data.note?.note_content || '');
    } catch (err) {
      console.error('Error loading note:', err);
    } finally {
      setLoading(false);
    }
  }, [file]);

  useEffect(() => {
    if (isOpen && file) {
      loadNote();
    }
  }, [isOpen, file, loadNote]);

  const handleSave = async () => {
    try {
      setError('');
      setLoading(true);
      await filesAPI.updateFileNote(file.id, noteContent);
      onClose();
    } catch (err) {
      setError('Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="modal">
        <div style={styles.header}>
          <h2 style={styles.title}>Notes for {file.original_name}</h2>
          <button
            onClick={onClose}
            style={styles.closeBtn}
            className="btn btn-secondary btn-small"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={styles.alert}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Add your notes here..."
          style={styles.textarea}
          disabled={loading}
        />

        <div style={styles.actions}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
  },
  closeBtn: {
    padding: '4px 8px',
  },
  alert: {
    marginBottom: '16px',
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '12px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontFamily: 'inherit',
    marginBottom: '16px',
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
};
