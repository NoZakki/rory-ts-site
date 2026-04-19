/**
 * Database Models and Schema Initialization
 * Defines all database tables structure for the application
 */

const pool = require('../config/database');

// SQL Schema - Tables Definition
const SCHEMA = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      storage_used BIGINT DEFAULT 0,
      storage_limit BIGINT DEFAULT 524288000,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
    CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
  `,
  
  files: `
    CREATE TABLE IF NOT EXISTS files (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      size BIGINT NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
  `,
  
  file_notes: `
    CREATE TABLE IF NOT EXISTS file_notes (
      id SERIAL PRIMARY KEY,
      file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
      note_content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_file_notes_file_id ON file_notes(file_id);
  `,
  
  file_shares: `
    CREATE TABLE IF NOT EXISTS file_shares (
      id SERIAL PRIMARY KEY,
      file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
      share_token VARCHAR(64) UNIQUE NOT NULL,
      shared_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_file_shares_token ON file_shares(share_token);
    CREATE INDEX IF NOT EXISTS idx_file_shares_file_id ON file_shares(file_id);
  `,
  
  activity_logs: `
    CREATE TABLE IF NOT EXISTS activity_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      action VARCHAR(100) NOT NULL,
      details TEXT,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
  `
};

/**
 * Migrate existing tables with new columns
 * Adds missing columns if they don't exist
 */
async function migrateDatabase() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Add new columns to users table
    const migrationsSQL = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS storage_used BIGINT DEFAULT 0;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS storage_limit BIGINT DEFAULT 524288000;`,
    ];

    for (const migration of migrationsSQL) {
      try {
        await pool.query(migration);
        console.log(`✅ Migration executed: ${migration.substring(0, 50)}...`);
      } catch (err) {
        if (err.code !== '42701') { // Column already exists error
          console.warn('⚠️ Migration warning:', err.message);
        }
      }
    }
    
    console.log('✅ Database migrations completed');
    return true;
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

/**
 * Initialize all database tables
 * Runs CREATE TABLE IF NOT EXISTS queries
 */
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database schema...');
    
    for (const [tableName, schema] of Object.entries(SCHEMA)) {
      await pool.query(schema);
      console.log(`✅ Table '${tableName}' initialized`);
    }
    
    console.log('✅ Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  migrateDatabase,
};
