/**
 * FileShare Model
 * Database operations for file sharing
 */

const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class FileShare {
  /**
   * Create share link with advanced options
   */
  static async create(fileId, sharedBy, options = {}) {
    try {
      const shareToken = crypto.randomBytes(32).toString('hex');
      const passwordHash = options.password ? await bcrypt.hash(options.password, 10) : null;
      const expiresAt = options.expiresAt || null;
      const maxDownloads = options.maxDownloads || -1; // -1 = unlimited

      const query = `
        INSERT INTO file_shares (file_id, share_token, shared_by, expires_at, password_hash, max_downloads, download_count)
        VALUES ($1, $2, $3, $4, $5, $6, 0)
        RETURNING *
      `;

      const result = await pool.query(query, [fileId, shareToken, sharedBy, expiresAt, passwordHash, maxDownloads]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find share by token
   */
  static async findByToken(token) {
    try {
      const query = 'SELECT * FROM file_shares WHERE share_token = $1';
      const result = await pool.query(query, [token]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if share is valid (not expired, not exceeded downloads)
   */
  static async isValid(token, password = null) {
    try {
      const share = await this.findByToken(token);
      if (!share) return false;

      // Check expiration
      if (share.expires_at && new Date() > new Date(share.expires_at)) return false;

      // Check download limit
      if (share.max_downloads > 0 && share.download_count >= share.max_downloads) return false;

      // Check password if required
      if (share.password_hash) {
        if (!password) return false;
        const isValidPassword = await bcrypt.compare(password, share.password_hash);
        if (!isValidPassword) return false;
      }

      return share;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Increment download count
   */
  static async incrementDownloadCount(token) {
    try {
      const query = 'UPDATE file_shares SET download_count = download_count + 1 WHERE share_token = $1';
      await pool.query(query, [token]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete share link
   */
  static async delete(token, userId) {
    try {
      const query = `
        DELETE FROM file_shares 
        WHERE share_token = $1 AND shared_by = $2
      `;
      await pool.query(query, [token, userId]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all shares for a user
   */
  static async getUserShares(userId) {
    try {
      const query = `
        SELECT fs.*, f.original_name, f.size, f.created_at
        FROM file_shares fs
        JOIN files f ON fs.file_id = f.id
        WHERE fs.shared_by = $1
        ORDER BY fs.created_at DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FileShare;
