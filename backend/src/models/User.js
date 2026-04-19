/**
 * User Model - Database operations for users
 * Handles user CRUD operations
 */

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user with hashed password
   * @param {string} email - User email
   * @param {string} password - Plain text password (will be hashed)
   * @returns {Promise<Object>} Created user object
   */
  static async create(email, password) {
    try {
      // SECURITY: Hash password with bcrypt (salt rounds = 10)
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
        [email, password_hash]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object with password hash
   */
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object (without password hash)
   */
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, email, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify password against hash
   * @param {string} plainPassword - Plain text password from login
   * @param {string} hash - Hashed password from database
   * @returns {Promise<boolean>} True if password matches
   */
  static async verifyPassword(plainPassword, hash) {
    try {
      return await bcrypt.compare(plainPassword, hash);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>}
   */
  static async emailExists(email) {
    try {
      const result = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
