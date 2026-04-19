/**
 * Setup Script
 * Generates encryption key and provides setup instructions
 * Usage: node scripts/setup.js
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

async function generateEncryptionKey() {
  const key = crypto.randomBytes(32).toString('hex');
  return key;
}

async function setup() {
  console.log('\n🔐 Cloud Storage Setup Script\n');
  console.log('========================================\n');

  // Generate encryption key
  console.log('1️⃣  Generating encryption key...');
  const encryptionKey = await generateEncryptionKey();
  console.log(`✅ Generated: ${encryptionKey}\n`);

  // Instructions
  console.log('2️⃣  Update your .env file with:\n');
  console.log(`ENCRYPTION_KEY=${encryptionKey}\n`);

  console.log('3️⃣  Database Setup Instructions:\n');
  console.log('   a. Ensure PostgreSQL is running');
  console.log('   b. Create database (or let the app auto-create schema):');
  console.log('      createdb cloud_storage_db\n');

  console.log('   c. Update .env with your database credentials:\n');
  console.log('      DB_HOST=localhost');
  console.log('      DB_PORT=5432');
  console.log('      DB_NAME=cloud_storage_db');
  console.log('      DB_USER=postgres');
  console.log('      DB_PASSWORD=your_password\n');

  console.log('4️⃣  Generate strong JWT secrets:\n');
  const jwtSecret = crypto.randomBytes(32).toString('hex');
  const refreshSecret = crypto.randomBytes(32).toString('hex');
  console.log(`   JWT_SECRET=${jwtSecret}`);
  console.log(`   REFRESH_TOKEN_SECRET=${refreshSecret}\n`);

  console.log('5️⃣  Install dependencies:\n');
  console.log('   npm install\n');

  console.log('6️⃣  Start development server:\n');
  console.log('   npm run dev\n');

  console.log('========================================\n');
  console.log('✅ Setup complete!\n');
}

setup().catch(console.error);
