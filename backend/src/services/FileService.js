/**
 * File Service
 * Business logic for file upload, download, storage, and encryption
 */

const File = require('../models/File');
const FileNote = require('../models/FileNote');
const fs = require('fs').promises;
const path = require('path');
const {
  encrypt,
  decrypt,
  generateRandomFilename,
} = require('../utils/encryption');
const {
  isAllowedMimeType,
  isValidFileSize,
  sanitizeInput,
} = require('../utils/validation');
const { logActivity } = require('../utils/logging');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || 52428800); // 50MB
const ALLOWED_MIME_TYPES = process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/x-zip-compressed,application/x-rar-compressed,application/x-7z-compressed,video/mp4,video/quicktime,video/x-msvideo,audio/mpeg,audio/wav,audio/mp3,application/octet-stream';

class FileService {
  /**
   * Upload and store file with encryption
   * SECURITY: Encrypt file, store with random name, sanitize metadata
   * @param {number} userId - Owner user ID
   * @param {Object} fileData - {buffer, originalname, mimetype, size}
   * @param {string} ipAddress - IP address
   * @returns {Promise<Object>} Created file metadata
   */
  static async uploadFile(userId, fileData, ipAddress = null) {
    try {
      const { buffer, originalname, mimetype, size } = fileData;

      // SECURITY: Validate file size
      if (!isValidFileSize(size, MAX_FILE_SIZE)) {
        const error = new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        error.status = 413;
        throw error;
      }

      // SECURITY: Validate MIME type against whitelist
      if (!isAllowedMimeType(mimetype, ALLOWED_MIME_TYPES)) {
        const error = new Error('File type not allowed');
        error.status = 415;
        throw error;
      }

      // SECURITY: Sanitize original filename
      const safeName = sanitizeInput(originalname);

      // SECURITY: Generate random filename to prevent directory traversal
      const fileExtension = path.extname(safeName);
      const randomFilename = generateRandomFilename(fileExtension);

      // SECURITY: Encrypt file content
      const { encryptedData, iv } = encrypt(buffer);

      // Store encrypted file
      const filePath = path.join(UPLOADS_DIR, randomFilename);
      await fs.writeFile(filePath, encryptedData);

      // Store IV separately for decryption (or store in metadata)
      const ivPath = path.join(UPLOADS_DIR, `${randomFilename}.iv`);
      await fs.writeFile(ivPath, iv);

      // Save file metadata to database
      const fileRecord = await File.create(
        userId,
        randomFilename,
        safeName,
        size,
        mimetype
      );

      // Log upload activity
      await logActivity(
        userId,
        'FILE_UPLOAD',
        {
          fileId: fileRecord.id,
          originalName: safeName,
          size: size,
        },
        ipAddress
      );

      // Send email notification
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (user) {
        const EmailService = require('./EmailService');
        EmailService.sendFileUploadedNotification(user.email, safeName);
      }

      return {
        success: true,
        file: fileRecord
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all files for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of file metadata
   */
  static async getUserFiles(userId) {
    try {
      return await File.getAllByUser(userId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download and decrypt file
   * SECURITY: Verify ownership before decryption
   * @param {number} fileId - File ID
   * @param {number} userId - User ID (for ownership check)
   * @param {string} ipAddress - IP address
   * @returns {Promise<Object>} {filename, mimetype, buffer}
   */
  static async downloadFile(fileId, userId, ipAddress = null) {
    try {
      // SECURITY: Verify ownership
      const fileRecord = await File.getById(fileId, userId);
      
      if (!fileRecord) {
        const error = new Error('File not found or access denied');
        error.status = 404;
        throw error;
      }

      // Read encrypted file
      const filePath = path.join(UPLOADS_DIR, fileRecord.filename);
      const encryptedBuffer = await fs.readFile(filePath);

      // Read IV
      const ivPath = path.join(UPLOADS_DIR, `${fileRecord.filename}.iv`);
      const iv = await fs.readFile(ivPath);

      // SECURITY: Decrypt file
      const decryptedBuffer = decrypt(encryptedBuffer, iv);

      // Log download
      await logActivity(
        userId,
        'FILE_DOWNLOAD',
        {
          fileId: fileId,
          filename: fileRecord.original_name,
        },
        ipAddress
      );

      return {
        success: true,
        filename: fileRecord.original_name,
        mimetype: fileRecord.mime_type,
        buffer: decryptedBuffer,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        const err = new Error('File not found on disk');
        err.status = 404;
        throw err;
      }
      throw error;
    }
  }

  /**
   * Delete file (both metadata and physical file)
   * SECURITY: Verify ownership before deletion
   * @param {number} fileId - File ID
   * @param {number} userId - User ID
   * @param {string} ipAddress - IP address
   * @returns {Promise<Object>} {success: true}
   */
  static async deleteFile(fileId, userId, ipAddress = null) {
    try {
      // SECURITY: Get file to verify ownership
      const fileRecord = await File.getById(fileId, userId);
      
      if (!fileRecord) {
        const error = new Error('File not found or access denied');
        error.status = 404;
        throw error;
      }

      // Delete physical file
      const filePath = path.join(UPLOADS_DIR, fileRecord.filename);
      const ivPath = path.join(UPLOADS_DIR, `${fileRecord.filename}.iv`);

      try {
        await fs.unlink(filePath);
        await fs.unlink(ivPath);
      } catch (err) {
        // File might already be deleted, but continue
        console.warn(`Could not delete file at ${filePath}:`, err.message);
      }

      // Delete metadata from database (CASCADE will delete notes)
      await File.delete(fileId, userId);

      // Log deletion
      await logActivity(
        userId,
        'FILE_DELETE',
        {
          fileId: fileId,
          filename: fileRecord.original_name,
        },
        ipAddress
      );

      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add or update note for a file
   * SECURITY: Verify ownership before updating
   * @param {number} fileId - File ID
   * @param {number} userId - User ID
   * @param {string} noteContent - Note text
   * @param {string} ipAddress - IP address
   * @returns {Promise<Object>} Updated note
   */
  static async updateFileNote(fileId, userId, noteContent, ipAddress = null) {
    try {
      // SECURITY: Verify file ownership
      const fileRecord = await File.getById(fileId, userId);
      
      if (!fileRecord) {
        const error = new Error('File not found or access denied');
        error.status = 404;
        throw error;
      }

      // SECURITY: Sanitize note content
      const sanitizedNote = sanitizeInput(noteContent);

      // Create or update note
      const note = await FileNote.upsert(fileId, sanitizedNote);

      // Log note update
      await logActivity(
        userId,
        'FILE_NOTE_UPDATE',
        {
          fileId: fileId,
        },
        ipAddress
      );

      return {
        success: true,
        note
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get note for a file
   * @param {number} fileId - File ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Note object or null
   */
  static async getFileNote(fileId, userId) {
    try {
      // SECURITY: Verify ownership
      const fileRecord = await File.getById(fileId, userId);
      
      if (!fileRecord) {
        const error = new Error('File not found or access denied');
        error.status = 404;
        throw error;
      }

      return await FileNote.getByFileId(fileId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get file by ID with metadata
   * @param {number} fileId - File ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} File metadata
   */
  static async getFileById(fileId, userId) {
    try {
      const fileRecord = await File.getById(fileId, userId);
      
      if (!fileRecord) {
        const error = new Error('File not found or access denied');
        error.status = 404;
        throw error;
      }

      return fileRecord;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FileService;
