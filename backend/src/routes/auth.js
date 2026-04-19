/**
 * Authentication Routes
 * /api/auth/* endpoints
 */

const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');
const { loginLimiter, registrationLimiter } = require('../middleware/security');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: {email, password}
 */
router.post(
  '/register',
  registrationLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  asyncHandler(AuthController.register)
);

/**
 * POST /api/auth/login
 * Login user and receive tokens
 * Body: {email, password}
 */
router.post(
  '/login',
  loginLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password required'),
  ],
  asyncHandler(AuthController.login)
);

/**
 * POST /api/auth/logout
 * Logout user (requires authentication)
 */
router.post(
  '/logout',
  authenticateToken,
  asyncHandler(AuthController.logout)
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  '/refresh',
  asyncHandler(AuthController.refreshToken)
);

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
router.get(
  '/me',
  authenticateToken,
  asyncHandler(AuthController.getCurrentUser)
);

module.exports = router;
