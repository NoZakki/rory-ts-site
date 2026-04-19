/**
 * Admin Panel Page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ToggleRight, ToggleLeft, LogOut, BarChart3 } from 'lucide-react';
import { adminAPI } from '../services/api';

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getSystemStats(),
      ]);
      setUsers(usersRes.data.users);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId, currentStatus) => {
    try {
      await adminAPI.toggleUserStatus(userId, !currentStatus);
      loadData();
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(userId);
      loadData();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
      padding: '20px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      color: '#fff',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      background: '#16213e',
      border: '1px solid #e94560',
      borderRadius: '12px',
      padding: '20px',
      color: '#fff',
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#e94560',
    },
    tableContainer: {
      background: '#16213e',
      border: '1px solid #e94560',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      background: 'rgba(233, 69, 96, 0.1)',
      color: '#fff',
      padding: '15px',
      textAlign: 'left',
      borderBottom: '1px solid #e94560',
    },
    td: {
      color: '#fff',
      padding: '15px',
      borderBottom: '1px solid rgba(233, 69, 96, 0.3)',
    },
    actions: {
      display: 'flex',
      gap: '10px',
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
    },
    logoutBtn: {
      background: '#e94560',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '10px 15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <BarChart3 size={32} /> Admin Dashboard
        </h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {stats && (
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div>Total Users</div>
            <div style={styles.statValue}>{stats.users.total}</div>
          </div>
          <div style={styles.statCard}>
            <div>Total Files</div>
            <div style={styles.statValue}>{stats.files.total}</div>
          </div>
          <div style={styles.statCard}>
            <div>Storage Used</div>
            <div style={styles.statValue}>{(stats.files.totalSize / 1024 / 1024).toFixed(2)} MB</div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Storage Used</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={{ color: user.is_active ? '#4ade80' : '#ff6b6b' }}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>{(user.storage_used / 1024 / 1024).toFixed(2)} MB</td>
                  <td style={styles.td}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => handleToggleUser(user.id, user.is_active)}
                      >
                        {user.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {user.is_active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        style={{ ...styles.actionBtn, background: '#ff6b6b' }}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
