/**
 * Authentication Middleware
 * JWT verification and token validation
 * SECURITY: Protects routes that require authentication
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token from HttpOnly cookie or Authorization header
 * SECURITY: Extract and validate token, attach user to request
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
function authenticateToken(req, res, next) {
  try {
    // Try to get token from HttpOnly cookie first (most secure)
    let token = req.cookies?.token;

    // Fallback to Authorization header (Bearer token)
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // SECURITY: Verify JWT signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}

/**
 * Generate JWT access token
 * @param {number} userId - User ID
 * @param {string} email - User email
 * @returns {string} JWT token
 */
function generateAccessToken(userId, email) {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
}

/**
 * Generate JWT refresh token
 * Used to issue new access tokens without re-login
 * @param {number} userId - User ID
 * @returns {string} JWT refresh token
 */
function generateRefreshToken(userId) {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d' }
  );
}

/**
 * Verify refresh token and return new access token
 * @param {string} refreshToken - Refresh token to verify
 * @returns {Object} {accessToken, userId}
 */
function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(decoded.userId, decoded.email);
    return { accessToken: newAccessToken, userId: decoded.userId };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

/**
 * Require admin role
 * Must be used after authenticateToken
 */
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
}

module.exports = {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  requireAdmin,
};
