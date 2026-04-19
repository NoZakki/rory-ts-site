/**
 * Admin Controller
 * Manage users, view logs, and system settings
 */

const bcryptjs = require('bcryptjs');
const pool = require('../config/database');
const { log } = require('../utils/logging');

class AdminController {
  /**
   * Admin Login - Special credentials
   */
  static async adminLogin(req, res) {
    try {
      const { email, password } = req.body;

      // Hard-coded admin credentials (email-based)
      const ADMIN_EMAIL = 'admin@admin.com';
      const ADMIN_PASSWORD = '123!ciao123!';

      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }

      const adminUser = {
        id: 0,
        email: ADMIN_EMAIL,
        is_admin: true,
      };

      req.session.admin = adminUser;
      req.session.isAdmin = true;

      res.json({
        success: true,
        message: 'Admin login successful',
        admin: adminUser,
      });
    } catch (error) {
      console.error('Admin login error', error.message);
      res.status(500).json({ success: false, message: 'Admin login failed' });
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers(req, res) {
    try {
      const result = await pool.query(
        'SELECT id, email, is_active, is_admin, storage_used, storage_limit, created_at FROM users ORDER BY created_at DESC'
      );

      res.json({
        success: true,
        users: result.rows,
        total: result.rows.length,
      });
    } catch (error) {
      log('ERROR', 'Get users error', { error: error.message });
      res.status(500).json({ success: false, message: 'Failed to get users' });
    }
  }

  /**
   * Get system stats
   */
  static async getSystemStats(req, res) {
    try {
      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      const fileCount = await pool.query('SELECT COUNT(*) FROM files');
      const totalSize = await pool.query('SELECT COALESCE(SUM(size), 0) as total FROM files');

      res.json({
        success: true,
        stats: {
          totalUsers: parseInt(userCount.rows[0].count),
          totalFiles: parseInt(fileCount.rows[0].count),
          totalSize: parseInt(totalSize.rows[0].total),
        },
      });
    } catch (error) {
      log('ERROR', 'Get stats error', { error: error.message });
      res.status(500).json({ success: false, message: 'Failed to get stats' });
    }
  }

  /**
   * Get activity logs
   */
  static async getActivityLogs(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50'
      );

      res.json({
        success: true,
        logs: result.rows,
      });
    } catch (error) {
      log('ERROR', 'Get logs error', { error: error.message });
      res.status(500).json({ success: false, message: 'Failed to get logs' });
    }
  }

  /**
   * Toggle user active status
   */
  static async toggleUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      await pool.query(
        'UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [isActive, userId]
      );

      log('INFO', `User ${userId} status toggled to ${isActive}`);

      res.json({ message: 'User status updated successfully' });
    } catch (error) {
      log('ERROR', 'Toggle user status error', { error: error.message });
      res.status(500).json({ message: 'Failed to update user status' });
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      // Delete user (cascade will delete files, notes, etc.)
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);

      log('INFO', `User ${userId} deleted`);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      log('ERROR', 'Delete user error', { error: error.message });
      res.status(500).json({ message: 'Failed to delete user' });
    }
  }

  /**
   * Get activity logs
   */
  static async getActivityLogs(req, res) {
    try {
      const { limit = 100 } = req.query;

      const result = await pool.query(
        'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT $1',
        [limit]
      );

      res.json({
        logs: result.rows,
        total: result.rows.length,
      });
    } catch (error) {
      log('ERROR', 'Get activity logs error', { error: error.message });
      res.status(500).json({ message: 'Failed to get activity logs' });
    }
  }

  /**
   * Get system stats
   */
  static async getSystemStats(req, res) {
    try {
      const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
      const filesResult = await pool.query('SELECT COUNT(*) as count, SUM(size) as total_size FROM files');
      const logsResult = await pool.query('SELECT COUNT(*) as count FROM activity_logs');

      res.json({
        users: {
          total: parseInt(usersResult.rows[0].count),
        },
        files: {
          total: parseInt(filesResult.rows[0].count),
          totalSize: filesResult.rows[0].total_size || 0,
        },
        logs: {
          total: parseInt(logsResult.rows[0].count),
        },
      });
    } catch (error) {
      log('ERROR', 'Get system stats error', { error: error.message });
      res.status(500).json({ message: 'Failed to get system stats' });
    }
  }
}

module.exports = AdminController;
