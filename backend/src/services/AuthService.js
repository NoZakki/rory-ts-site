/**
 * Authentication Service
 * Business logic for user registration and login
 */

const User = require('../models/User');
const { isValidEmail, validatePasswordStrength, sanitizeInput } = require('../utils/validation');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const { logActivity } = require('../utils/logging');

class AuthService {
  /**
   * Register a new user
   * SECURITY: Validates email and strong password before creating user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} ipAddress - IP address of requester
   * @returns {Promise<Object>} {accessToken, refreshToken, user}
   */
  static async register(email, password, ipAddress = null) {
    try {
      // SECURITY: Sanitize and validate email
      email = sanitizeInput(email).toLowerCase().trim();
      
      if (!isValidEmail(email)) {
        const error = new Error('Invalid email format');
        error.status = 400;
        throw error;
      }

      // SECURITY: Check password strength
      const passwordCheck = validatePasswordStrength(password);
      if (!passwordCheck.valid) {
        const error = new Error(passwordCheck.errors.join('; '));
        error.status = 400;
        throw error;
      }

      // SECURITY: Check if email already exists
      const exists = await User.emailExists(email);
      if (exists) {
        const error = new Error('Email already registered');
        error.status = 409; // Conflict
        throw error;
      }

      // Create user with hashed password
      const user = await User.create(email, password);

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id);

      // Log registration
      await logActivity(user.id, 'REGISTER', { email }, ipAddress);

      return {
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   * SECURITY: Verify email and password, generate tokens
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} ipAddress - IP address of requester
   * @returns {Promise<Object>} {accessToken, refreshToken, user}
   */
  static async login(email, password, ipAddress = null) {
    try {
      // SECURITY: Sanitize email
      email = sanitizeInput(email).toLowerCase().trim();

      // Find user by email
      const user = await User.findByEmail(email);
      
      if (!user) {
        // SECURITY: Generic error message to prevent email enumeration
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
      }

      // SECURITY: Verify password using bcrypt comparison
      const passwordValid = await User.verifyPassword(password, user.password_hash);
      
      if (!passwordValid) {
        // SECURITY: Log failed login attempt for security monitoring
        await logActivity(user.id, 'LOGIN_FAILED', { reason: 'invalid_password' }, ipAddress);
        
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
      }

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id);

      // Log successful login
      await logActivity(user.id, 'LOGIN', { email }, ipAddress);

      return {
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user (mainly for cleanup/logging)
   * @param {number} userId - User ID
   * @param {string} ipAddress - IP address
   * @returns {Promise<void>}
   */
  static async logout(userId, ipAddress = null) {
    try {
      await logActivity(userId, 'LOGOUT', {}, ipAddress);
    } catch (error) {
      console.error('Error during logout:', error);
      // Don't throw - logout should always succeed
    }
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User object
   */
  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
