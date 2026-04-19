/**
 * Logging Utilities
 * Activity tracking and security event logging
 */

const pool = require('../config/database');

/**
 * Log user activity (security events)
 * SECURITY: Track suspicious activities for audit trail
 * @param {number} userId - User ID
 * @param {string} action - Action performed (e.g., 'LOGIN', 'UPLOAD', 'DELETE')
 * @param {Object} details - Additional details about the action
 * @param {string} ipAddress - IP address of the request
 * @returns {Promise<void>}
 */
async function logActivity(userId, action, details = null, ipAddress = null) {
  try {
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, details, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [userId, action, details ? JSON.stringify(details) : null, ipAddress]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - logging errors shouldn't break the application
  }
}

/**
 * Get activity logs for a user (admin/user view)
 * @param {number} userId - User ID
 * @param {number} limit - Max records to return
 * @returns {Promise<Array>} Activity logs
 */
async function getUserActivityLogs(userId, limit = 50) {
  try {
    const result = await pool.query(
      `SELECT action, details, ip_address, created_at
       FROM activity_logs
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
}

/**
 * Console logging with levels
 * @param {string} level - 'INFO', 'WARN', 'ERROR'
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 */
function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}`;

  if (Object.keys(meta).length > 0) {
    console.log(logEntry, JSON.stringify(meta));
  } else {
    console.log(logEntry);
  }
}

module.exports = {
  logActivity,
  getUserActivityLogs,
  log,
};
