/**
 * Server Startup
 * Entry point for the application
 */

require('dotenv').config();
const app = require('./app');
const { initializeDatabase, migrateDatabase } = require('./models/database');
const { log } = require('./utils/logging');
const fs = require('fs').promises;
const path = require('path');

const PORT = process.env.PORT || 5000;

/**
 * Ensure uploads directory exists
 */
async function ensureUploadsDir() {
  const uploadsDir = path.join(__dirname, '../uploads');
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    log('INFO', '✅ Uploads directory ready', { path: uploadsDir });
  } catch (error) {
    log('ERROR', 'Failed to create uploads directory', { error: error.message });
    throw error;
  }
}

/**
 * Start server
 */
async function startServer() {
  try {
    log('INFO', '🚀 Starting Cloud Storage Server...');
    log('INFO', `Environment: ${process.env.NODE_ENV || 'development'}`);

    // Initialize database schema
    await initializeDatabase();

    // Run migrations
    await migrateDatabase();

    // Ensure uploads directory exists
    await ensureUploadsDir();

    // Verify encryption key
    try {
      const { getEncryptionKey } = require('./utils/encryption');
      getEncryptionKey();
      log('INFO', '✅ Encryption key verified');
    } catch (error) {
      log('ERROR', 'Invalid ENCRYPTION_KEY in .env', { error: error.message });
      throw error;
    }

    // Start listening
    const server = app.listen(PORT, () => {
      log('INFO', `✅ Server running on port ${PORT}`);
      log('INFO', `📍 API URL: http://localhost:${PORT}/api`);
      log('INFO', `🏥 Health check: http://localhost:${PORT}/health`);
      
      if (process.env.NODE_ENV !== 'production') {
        log('INFO', '⚠️  Development mode - ensure to set strong values in .env for production');
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      log('INFO', '📛 SIGTERM received, shutting down gracefully');
      server.close(() => {
        log('INFO', '✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      log('INFO', '📛 SIGINT received, shutting down gracefully');
      server.close(() => {
        log('INFO', '✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    log('ERROR', '❌ Failed to start server', { error: error.message });
    process.exit(1);
  }
}

// Start the server
startServer();
