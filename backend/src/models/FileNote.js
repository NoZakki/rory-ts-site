/**
 * FileNote Model - Database operations for file annotations
 * Handles notes/comments associated with files
 */

const pool = require('../config/database');

class FileNote {
  /**
   * Create or update a note for a file
   * @param {number} fileId - File ID
   * @param {string} noteContent - Note text
   * @returns {Promise<Object>} Created/updated note
   */
  static async upsert(fileId, noteContent) {
    try {
      // First, try to get existing note
      const existing = await pool.query(
        'SELECT id FROM file_notes WHERE file_id = $1',
        [fileId]
      );

      if (existing.rows.length > 0) {
        // Update existing note
        const result = await pool.query(
          `UPDATE file_notes
           SET note_content = $1, updated_at = CURRENT_TIMESTAMP
           WHERE file_id = $2
           RETURNING id, file_id, note_content, created_at, updated_at`,
          [noteContent, fileId]
        );
        return result.rows[0];
      } else {
        // Create new note
        const result = await pool.query(
          `INSERT INTO file_notes (file_id, note_content)
           VALUES ($1, $2)
           RETURNING id, file_id, note_content, created_at, updated_at`,
          [fileId, noteContent]
        );
        return result.rows[0];
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get note for a specific file
   * @param {number} fileId - File ID
   * @returns {Promise<Object>} Note object or null
   */
  static async getByFileId(fileId) {
    try {
      const result = await pool.query(
        'SELECT id, file_id, note_content, created_at, updated_at FROM file_notes WHERE file_id = $1',
        [fileId]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete note for a file
   * @param {number} fileId - File ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(fileId) {
    try {
      const result = await pool.query(
        'DELETE FROM file_notes WHERE file_id = $1 RETURNING id',
        [fileId]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FileNote;
