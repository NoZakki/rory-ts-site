/**
 * API Service
 * Centralized API client for all backend communication
 * SECURITY: Handles token storage and request/response interceptors
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Auth API endpoints
 */
export const authAPI = {
  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{accessToken, refreshToken, user}>}
   */
  register: (email, password) =>
    apiClient.post('/auth/register', { email, password }),

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{accessToken, refreshToken, user}>}
   */
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  /**
   * Logout user
   */
  logout: () =>
    apiClient.post('/auth/logout'),

  /**
   * Get current user info
   */
  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  /**
   * Refresh access token
   */
  refreshToken: () =>
    apiClient.post('/auth/refresh'),
};

/**
 * Files API endpoints
 */
export const filesAPI = {
  /**
   * Upload file
   * @param {File} file - File to upload
   * @returns {Promise<{file}>}
   */
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get all user files
   */
  getUserFiles: () =>
    apiClient.get('/files'),

  /**
   * Get single file metadata
   * @param {number} fileId - File ID
   */
  getFile: (fileId) =>
    apiClient.get(`/files/${fileId}`),

  /**
   * Download file (encrypted on server, decrypted before sending)
   * @param {number} fileId - File ID
   */
  downloadFile: (fileId) =>
    apiClient.get(`/files/${fileId}/download`, {
      responseType: 'blob',
    }),

  /**
   * Delete file
   * @param {number} fileId - File ID
   */
  deleteFile: (fileId) =>
    apiClient.delete(`/files/${fileId}`),

  /**
   * Update file note
   * @param {number} fileId - File ID
   * @param {string} noteContent - Note text
   */
  updateFileNote: (fileId, noteContent) =>
    apiClient.post(`/files/${fileId}/notes`, { noteContent }),

  /**
   * Get file note
   * @param {number} fileId - File ID
   */
  getFileNote: (fileId) =>
    apiClient.get(`/files/${fileId}/notes`),
};

/**
 * Admin API endpoints
 */
export const adminAPI = {
  /**
   * Admin login
   */
  login: (email, password) =>
    apiClient.post('/admin/login', { email, password }),

  /**
   * Get all users
   */
  getAllUsers: () =>
    apiClient.get('/admin/users'),

  /**
   * Toggle user status (active/inactive)
   */
  toggleUserStatus: (userId, isActive) =>
    apiClient.put(`/admin/users/${userId}/toggle`, { isActive }),

  /**
   * Delete user
   */
  deleteUser: (userId) =>
    apiClient.delete(`/admin/users/${userId}`),

  /**
   * Get activity logs
   */
  getActivityLogs: () =>
    apiClient.get('/admin/logs'),

  /**
   * Get system stats
   */
  getSystemStats: () =>
    apiClient.get('/admin/stats'),
};

/**
 * Support API endpoints
 */
export const supportAPI = {
  /**
   * Send support message
   */
  sendMessage: (message) =>
    apiClient.post('/support/message', { message }),

  /**
   * Get bot info
   */
  getBotInfo: () =>
    apiClient.get('/support/bot-info'),
};

/**
 * File Share API endpoints
 */
export const shareAPI = {
  /**
   * Create share link
   */
  createShare: (fileId) =>
    apiClient.post(`/share/${fileId}/share`),

  /**
   * Get all shares for user
   */
  getUserShares: () =>
    apiClient.get('/share/my-shares'),

  /**
   * Delete share
   */
  deleteShare: (fileId) =>
    apiClient.delete(`/share/${fileId}/share`),

  /**
   * Get shared file info (public)
   */
  getSharedFile: (shareToken) =>
    apiClient.get(`/share/shared/${shareToken}`),

  /**
   * Download shared file (public)
   */
  downloadSharedFile: (shareToken) =>
    apiClient.get(`/share/shared/${shareToken}/download`, {
      responseType: 'blob',
    }),
};

export default apiClient;
