#!/usr/bin/env node

/**
 * Run Backend and Frontend Scripts
 * Windows: npm run dev:all
 * macOS/Linux: npm run dev:all
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Cloud Storage Application...\n');

// Start backend
console.log('📍 Starting Backend on http://localhost:5000');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
});

// Start frontend
console.log('📍 Starting Frontend on http://localhost:3000');
const frontend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true,
});

// Handle termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down...');
  backend.kill();
  frontend.kill();
  process.exit();
});

backend.on('exit', (code) => {
  console.log('Backend exited with code', code);
  frontend.kill();
  process.exit(code);
});

frontend.on('exit', (code) => {
  console.log('Frontend exited with code', code);
  backend.kill();
  process.exit(code);
});
