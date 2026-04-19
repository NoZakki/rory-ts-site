require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Database Pool Configuration
 * Supporta sia DATABASE_URL (Neon/cloud) che variabili singole (sviluppo locale)
 * SSL abilitato automaticamente in produzione
 */
const poolConfig = process.env.DATABASE_URL
  ? {
      // Produzione: usa la connection string completa (es. Neon)
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction
        ? { rejectUnauthorized: false } // Neon richiede SSL
        : false,
      max: 10,                  // max connessioni nel pool
      idleTimeoutMillis: 30000, // chiude connessioni idle dopo 30s
      connectionTimeoutMillis: 2000,
    }
  : {
      // Sviluppo locale: variabili singole
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'cloud_storage_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

const pool = new Pool(poolConfig);

// Log connessione
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
