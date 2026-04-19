/**
 * Validation Utilities
 * Input validation and sanitization for security
 */

const xss = require('xss');
const { validationResult } = require('express-validator');

/**
 * Extract and format validation errors from request
 * @param {Object} req - Express request object
 * @returns {Array} Array of error messages
 */
function getValidationErrors(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
  }
  return [];
}

/**
 * Sanitize user input to prevent XSS attacks
 * SECURITY: Removes any HTML/JS that could be malicious
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return xss(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoredTag: true,
  });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param {string} password - Password to validate
 * @returns {Object} {valid: boolean, errors: [string]}
 */
function validatePasswordStrength(password) {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate file type based on MIME type
 * SECURITY: Check allowed MIME types against whitelist
 * @param {string} mimeType - MIME type from file
 * @param {string} allowedTypes - Comma-separated allowed MIME types
 * @returns {boolean}
 */
function isAllowedMimeType(mimeType, allowedTypes) {
  if (!allowedTypes) {
    return true; // No restrictions if not specified
  }
  const allowed = allowedTypes.split(',').map(t => t.trim());
  return allowed.includes(mimeType);
}

/**
 * Validate file size
 * @param {number} fileSize - Size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {boolean}
 */
function isValidFileSize(fileSize, maxSize) {
  return fileSize > 0 && fileSize <= maxSize;
}

module.exports = {
  getValidationErrors,
  sanitizeInput,
  isValidEmail,
  validatePasswordStrength,
  isAllowedMimeType,
  isValidFileSize,
};
