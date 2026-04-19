/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

const AuthService = require('../services/AuthService');
const { getValidationErrors } = require('../utils/validation');
const { verifyRefreshToken } = require('../middleware/auth');

class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async register(req, res) {
    try {
      // Check for validation errors
      const errors = getValidationErrors(req);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      const { email, password } = req.body;
      const ipAddress = req.ip;

      const result = await AuthService.register(email, password, ipAddress);

      // SECURITY: Set refresh token in HttpOnly cookie
      res.cookie('token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: result.user,
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/auth/login
   * Login user and return tokens
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async login(req, res) {
    try {
      // Check for validation errors
      const errors = getValidationErrors(req);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      const { email, password } = req.body;
      const ipAddress = req.ip;

      const result = await AuthService.login(email, password, ipAddress);

      // SECURITY: Set refresh token in HttpOnly cookie
      res.cookie('token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: result.user,
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async logout(req, res) {
    try {
      const userId = req.user.userId;
      const ipAddress = req.ip;

      await AuthService.logout(userId, ipAddress);

      // Clear cookies
      res.clearCookie('token');
      res.clearCookie('refreshToken');

      return res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      const { accessToken, userId } = verifyRefreshToken(refreshToken);

      // SECURITY: Set new access token in HttpOnly cookie
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Token refreshed',
        accessToken
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current user info
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async getCurrentUser(req, res) {
    try {
      const userId = req.user.userId;

      const user = await AuthService.getUserById(userId);

      return res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  }
}

module.exports = AuthController;
