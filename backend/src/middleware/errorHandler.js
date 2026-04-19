/**
 * Error Handling Middleware
 * Centralized error handling for all routes
 * SECURITY: Don't expose sensitive error details to clients
 */

const { log } = require('../utils/logging');

/**
 * Global error handler
 * SECURITY: Sanitize error messages before sending to client
 * @param {Error} error - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
function errorHandler(error, req, res, next) {
  // Log the full error for debugging
  log('ERROR', `${error.message}`, {
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  const status = error.status || error.statusCode || 500;

  // Sanitized error message for client (don't leak implementation details)
  let message = error.message || 'Internal server error';
  
  // SECURITY: Hide sensitive error details in production
  if (process.env.NODE_ENV === 'production') {
    if (status === 500) {
      message = 'Internal server error. Please try again later.';
    }
  }

  res.status(status).json({
    success: false,
    message,
    code: error.code || 'ERROR',
    ...(process.env.NODE_ENV !== 'production' && { details: error.message })
  });
}

/**
 * 404 Not Found handler
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
}

/**
 * Async error wrapper for route handlers
 * SECURITY: Prevents unhandled promise rejections
 * Usage: router.get('/', asyncHandler(async (req, res) => {...}))
 * @param {Function} fn - Async route handler
 * @returns {Function} Wrapped handler with error catching
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
