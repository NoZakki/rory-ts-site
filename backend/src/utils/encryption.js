/**
 * Encryption Utilities
 * AES-256 encryption/decryption for file storage
 * SECURITY: Files are encrypted at rest on the server
 * Structure allows for easy migration to client-side encryption later
 */

const crypto = require('crypto');

/**
 * Get encryption key from environment
 * The key should be 32 bytes (256 bits) for AES-256
 * @returns {Buffer} Encryption key
 */
function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) { // 64 hex chars = 32 bytes
    throw new Error('Invalid ENCRYPTION_KEY in .env - must be 64 hex characters (32 bytes)');
  }
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt data using AES-256-CBC
 * SECURITY: Uses random IV for each encryption
 * @param {Buffer} data - Data to encrypt
 * @returns {Object} {encryptedData: Buffer, iv: Buffer}
 */
function encrypt(data) {
  try {
    const key = getEncryptionKey();
    // SECURITY: Generate random IV (16 bytes for CBC mode)
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedData = cipher.update(data);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    return {
      encryptedData,
      iv
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt data using AES-256-CBC
 * @param {Buffer} encryptedData - Data to decrypt
 * @param {Buffer} iv - Initialization vector used during encryption
 * @returns {Buffer} Decrypted data
 */
function decrypt(encryptedData, iv) {
  try {
    const key = getEncryptionKey();

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

/**
 * Generate a random file identifier
 * SECURITY: Files are stored with randomized names, not original names
 * Format: random-uuid-timestamp
 * @param {string} originalExtension - File extension from original file
 * @returns {string} Randomized filename
 */
function generateRandomFilename(originalExtension) {
  const { v4: uuidv4 } = require('uuid');
  const timestamp = Date.now();
  const randomId = uuidv4().replace(/-/g, '').substring(0, 8);
  return `${randomId}-${timestamp}${originalExtension}`;
}

/**
 * Generate encryption key (for initial setup)
 * SECURITY: Use this to generate a strong key for .env
 * @returns {string} 64-character hex string (32 bytes)
 */
function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  encrypt,
  decrypt,
  generateRandomFilename,
  generateEncryptionKey,
  getEncryptionKey,
};
