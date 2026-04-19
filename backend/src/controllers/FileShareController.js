/**
 * File Share Controller
 * Handle file sharing with public links
 */

const crypto = require('crypto');
const pool = require('../config/database');
const { log } = require('../utils/logging');

class FileShareController {
  /**
   * Create share link for file
   */
  static async createShare(req, res) {
    try {
      const userId = req.user.id;
      const { fileId } = req.params;

      // Verify file belongs to user
      const fileResult = await pool.query(
        'SELECT id FROM files WHERE id = $1 AND user_id = $2',
        [fileId, userId]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Generate unique share token
      const shareToken = crypto.randomBytes(32).toString('hex');

      // Create share
      await pool.query(
        'INSERT INTO file_shares (file_id, share_token, shared_by) VALUES ($1, $2, $3)',
        [fileId, shareToken, userId]
      );

      log('INFO', 'File shared', { userId, fileId });

      res.json({
        shareToken,
        shareLink: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/share/${shareToken}`,
      });
    } catch (error) {
      log('ERROR', 'Create share error', { error: error.message });
      res.status(500).json({ message: 'Failed to create share' });
    }
  }

  /**
   * Get file by share token
   */
  static async getSharedFile(req, res) {
    try {
      const { shareToken } = req.params;

      // Get share and file info
      const result = await pool.query(
        `SELECT f.id, f.filename, f.original_name, f.size, f.mime_type, f.created_at, u.email
         FROM file_shares fs
         JOIN files f ON fs.file_id = f.id
         JOIN users u ON f.user_id = u.id
         WHERE fs.share_token = $1`,
        [shareToken]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Share link not found or expired' });
      }

      res.json({
        file: result.rows[0],
        shareToken,
      });
    } catch (error) {
      log('ERROR', 'Get shared file error', { error: error.message });
      res.status(500).json({ message: 'Failed to get shared file' });
    }
  }

  /**
   * Download shared file
   */
  static async downloadSharedFile(req, res) {
    try {
      const { shareToken } = req.params;
      const fs = require('fs').promises;
      const path = require('path');

      // Verify share exists and get file info
      const result = await pool.query(
        `SELECT f.id, f.filename, f.original_name
         FROM file_shares fs
         JOIN files f ON fs.file_id = f.id
         WHERE fs.share_token = $1`,
        [shareToken]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Share link not found' });
      }

      const { filename, original_name } = result.rows[0];
      const filePath = path.join(__dirname, '../../uploads', filename);

      // Check file exists
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ message: 'File not found' });
      }

      res.download(filePath, original_name);
    } catch (error) {
      log('ERROR', 'Download shared file error', { error: error.message });
      res.status(500).json({ message: 'Failed to download file' });
    }
  }

  /**
   * Delete share link
   */
  static async deleteShare(req, res) {
    try {
      const userId = req.user.id;
      const { fileId } = req.params;

      // Verify file belongs to user
      const fileResult = await pool.query(
        'SELECT id FROM files WHERE id = $1 AND user_id = $2',
        [fileId, userId]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Delete share
      await pool.query(
        'DELETE FROM file_shares WHERE file_id = $1',
        [fileId]
      );

      log('INFO', 'Share deleted', { userId, fileId });

      res.json({ message: 'Share deleted successfully' });
    } catch (error) {
      log('ERROR', 'Delete share error', { error: error.message });
      res.status(500).json({ message: 'Failed to delete share' });
    }
  }

  /**
   * Get all shares for user
   */
  static async getUserShares(req, res) {
    try {
      const userId = req.user.id;

      const result = await pool.query(
        `SELECT fs.share_token, fs.created_at, f.id, f.filename, f.original_name
         FROM file_shares fs
         JOIN files f ON fs.file_id = f.id
         WHERE f.user_id = $1
         ORDER BY fs.created_at DESC`,
        [userId]
      );

      res.json({
        shares: result.rows.map(row => ({
          ...row,
          shareLink: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/share/${row.share_token}`,
        })),
      });
    } catch (error) {
      log('ERROR', 'Get user shares error', { error: error.message });
      res.status(500).json({ message: 'Failed to get shares' });
    }
  }
}

module.exports = FileShareController;
