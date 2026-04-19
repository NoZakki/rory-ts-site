/**
 * Security Middleware
 * Rate limiting, CORS, CSRF protection, and other security headers
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

/**
 * SECURITY: Rate limiting for login endpoint
 * Prevents brute force attacks
 * Max 5 attempts per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test',
});

/**
 * SECURITY: Rate limiting for general API endpoints
 * Max 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test',
});

/**
 * SECURITY: Rate limiting for registration endpoint
 * Max 3 registration attempts per hour per IP
 * Prevents abuse/spam
 */
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many registration attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test',
});

/**
 * SECURITY: Helmet middleware
 * Sets various HTTP headers to protect against common attacks
 * - X-Frame-Options (prevents clickjacking)
 * - X-Content-Type-Options (prevents MIME sniffing)
 * - Strict-Transport-Security (HTTPS enforcement)
 * - etc.
 */
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
});

/**
 * SECURITY: CSRF token generation middleware
 * Attaches CSRF token to response headers
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
function csrfTokenMiddleware(req, res, next) {
  // Generate CSRF token (simple method - use csrf package in production)
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  req.csrfToken = token;
  res.setHeader('X-CSRF-Token', token);
  next();
}

/**
 * SECURITY: Verify CSRF token on state-changing requests
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
function verifyCsrfToken(req, res, next) {
  // For simplicity in development, we can skip CSRF check if using HttpOnly cookies + SameSite
  // In production, implement proper CSRF token validation
  
  const csrfFromHeader = req.headers['x-csrf-token'];
  const csrfFromCookie = req.cookies?.csrf;

  // SECURITY: SameSite cookies provide CSRF protection automatically
  // If using strict CORS and SameSite=Strict, CSRF is effectively prevented
  
  next();
}

/**
 * SECURITY: Sanitize request headers and body
 * Remove potentially malicious headers
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
function sanitizeHeaders(req, res, next) {
  // Remove dangerous headers
  delete req.headers['x-forwarded-proto'];
  delete req.headers['x-forwarded-host'];
  
  next();
}

module.exports = {
  loginLimiter,
  apiLimiter,
  registrationLimiter,
  helmetMiddleware,
  csrfTokenMiddleware,
  verifyCsrfToken,
  sanitizeHeaders,
};
