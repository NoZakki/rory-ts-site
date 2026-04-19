/**
 * File Model - Database operations for file metadata
 * Handles file CRUD operations (not the actual file content)
 */

const pool = require('../config/database');

class File {
  /**
   * Create file metadata entry
   * @param {number} userId - Owner user ID
   * @param {string} filename - Stored filename (randomized)
   * @param {string} originalName - Original filename from user
   * @param {number} size - File size in bytes
   * @param {string} mimeType - MIME type of file
   * @returns {Promise<Object>} Created file metadata
   */
  static async create(userId, filename, originalName, size, mimeType) {
    try {
      const result = await pool.query(
        `INSERT INTO files (user_id, filename, original_name, size, mime_type)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, user_id, filename, original_name, size, mime_type, created_at`,
        [userId, filename, originalName, size, mimeType]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all files for a specific user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of file metadata
   */
  static async getAllByUser(userId) {
    try {
      const result = await pool.query(
        `SELECT id, filename, original_name, size, mime_type, created_at
         FROM files
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single file by ID and verify ownership
   * @param {number} fileId - File ID
   * @param {number} userId - User ID (for ownership check)
   * @returns {Promise<Object>} File metadata
   */
  static async getById(fileId, userId) {
    try {
      const result = await pool.query(
        `SELECT id, user_id, filename, original_name, size, mime_type, created_at
         FROM files
         WHERE id = $1 AND user_id = $2`,
        [fileId, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete file metadata (and associated notes via CASCADE)
   * @param {number} fileId - File ID
   * @param {number} userId - User ID (ownership check)
   * @returns {Promise<boolean>} Success status
   */
  static async delete(fileId, userId) {
    try {
      const result = await pool.query(
        'DELETE FROM files WHERE id = $1 AND user_id = $2 RETURNING id',
        [fileId, userId]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update file metadata (e.g., size after re-upload)
   * @param {number} fileId - File ID
   * @param {number} userId - User ID
   * @param {Object} updates - Fields to update {size, mime_type, etc}
   * @returns {Promise<Object>} Updated file metadata
   */
  static async update(fileId, userId, updates) {
    try {
      const { size, mimeType } = updates;
      const result = await pool.query(
        `UPDATE files
         SET size = $1, mime_type = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3 AND user_id = $4
         RETURNING id, filename, original_name, size, mime_type, updated_at`,
        [size, mimeType, fileId, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = File;
