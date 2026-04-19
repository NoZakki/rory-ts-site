#!/usr/bin/env node

/**
 * Automated Project Setup Script
 * Installs dependencies for both backend and frontend
 * Generates encryption key
 * Creates .env files
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function setupProject() {
  log('\n🚀 Secure Cloud Storage - Project Setup\n', 'bright');

  try {
    // Step 1: Generate encryption key
    log('Step 1: Generating encryption key...', 'blue');
    const encryptionKey = crypto.randomBytes(32).toString('hex');
    log(`✅ Generated: ${encryptionKey.substring(0, 16)}...`, 'green');

    // Step 2: Backend setup
    log('\nStep 2: Setting up backend...', 'blue');
    const backendDir = path.join(__dirname, 'backend');
    
    // Create .env if doesn't exist
    const backendEnvPath = path.join(backendDir, '.env');
    if (!fs.existsSync(backendEnvPath)) {
      log('Creating backend .env file...', 'yellow');
      const backendEnv = `DB_HOST=localhost
DB_PORT=5432
DB_NAME=cloud_storage_db
DB_USER=postgres
DB_PASSWORD=postgres_password

NODE_ENV=development
PORT=5000

JWT_SECRET=${crypto.randomBytes(32).toString('hex')}
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=${crypto.randomBytes(32).toString('hex')}
REFRESH_TOKEN_EXPIRY=30d

ENCRYPTION_KEY=${encryptionKey}

MAX_FILE_SIZE=52428800
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,application/pdf,text/plain,application/zip

CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=${crypto.randomBytes(16).toString('hex')}

LOG_LEVEL=info
`;
      fs.writeFileSync(backendEnvPath, backendEnv);
      log('✅ Created backend/.env', 'green');
    } else {
      log('backend/.env already exists', 'yellow');
    }

    log('Installing backend dependencies...', 'yellow');
    await runCommand(`cd ${backendDir} && npm install`);
    log('✅ Backend dependencies installed', 'green');

    // Step 3: Frontend setup
    log('\nStep 3: Setting up frontend...', 'blue');
    const frontendDir = path.join(__dirname, 'frontend');
    
    // Create .env if doesn't exist
    const frontendEnvPath = path.join(frontendDir, '.env');
    if (!fs.existsSync(frontendEnvPath)) {
      log('Creating frontend .env file...', 'yellow');
      const frontendEnv = `REACT_APP_API_URL=http://localhost:5000/api
`;
      fs.writeFileSync(frontendEnvPath, frontendEnv);
      log('✅ Created frontend/.env', 'green');
    } else {
      log('frontend/.env already exists', 'yellow');
    }

    log('Installing frontend dependencies...', 'yellow');
    await runCommand(`cd ${frontendDir} && npm install`);
    log('✅ Frontend dependencies installed', 'green');

    // Step 4: Summary
    log('\n✅ Setup Complete!\n', 'bright');
    log('📋 Next Steps:', 'blue');
    log('');
    log('1. Setup Database:', 'yellow');
    log('   createdb cloud_storage_db  (or create via PostgreSQL GUI)', '');
    log('');
    log('2. Start Backend:', 'yellow');
    log('   cd backend && npm run dev', '');
    log('');
    log('3. Start Frontend (new terminal):', 'yellow');
    log('   cd frontend && npm start', '');
    log('');
    log('4. Open Browser:', 'yellow');
    log('   http://localhost:3000', '');
    log('');
    log('📝 Generated Keys:', 'blue');
    log(`Encryption Key: ${encryptionKey.substring(0, 16)}...`, '');
    log('(Full key saved in backend/.env)', '');
    log('');
    log('⚠️  IMPORTANT:', 'red');
    log('- Database password in .env is DEV ONLY', '');
    log('- Change all secrets BEFORE production', '');
    log('- Create PostgreSQL database manually', '');
    log('');

  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run setup
setupProject();
