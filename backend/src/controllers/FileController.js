/**
 * File Controller
 * Handles HTTP requests for file endpoints
 */

const FileService = require('../services/FileService');
const { getValidationErrors } = require('../utils/validation');

class FileController {
  /**
   * POST /api/files/upload
   * Upload a file
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided'
        });
      }

      const userId = req.user.userId;
      const ipAddress = req.ip;

      const result = await FileService.uploadFile(userId, req.file, ipAddress);

      return res.status(201).json(result);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/files
   * Get all files for current user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async getUserFiles(req, res) {
    try {
      const userId = req.user.userId;

      const files = await FileService.getUserFiles(userId);

      return res.status(200).json({
        success: true,
        files: files || []
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/files/:fileId
   * Get single file metadata
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async getFile(req, res) {
    try {
      const { fileId } = req.params;
      const userId = req.user.userId;

      const file = await FileService.getFileById(parseInt(fileId), userId);

      return res.status(200).json({
        success: true,
        file
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/files/:fileId/download
   * Download and decrypt file
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async downloadFile(req, res) {
    try {
      const { fileId } = req.params;
      const userId = req.user.userId;
      const ipAddress = req.ip;

      const result = await FileService.downloadFile(parseInt(fileId), userId, ipAddress);

      // SECURITY: Set proper headers for file download
      res.setHeader('Content-Type', result.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME sniffing

      return res.send(result.buffer);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/files/:fileId
   * Delete file and all associated data
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async deleteFile(req, res) {
    try {
      const { fileId } = req.params;
      const userId = req.user.userId;
      const ipAddress = req.ip;

      const result = await FileService.deleteFile(parseInt(fileId), userId, ipAddress);

      return res.status(200).json(result);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/files/:fileId/notes
   * Create or update note for a file
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async updateFileNote(req, res) {
    try {
      const { fileId } = req.params;
      const { noteContent } = req.body;
      const userId = req.user.userId;
      const ipAddress = req.ip;

      if (!noteContent || typeof noteContent !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Note content must be a non-empty string'
        });
      }

      const result = await FileService.updateFileNote(
        parseInt(fileId),
        userId,
        noteContent,
        ipAddress
      );

      return res.status(200).json(result);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/files/:fileId/notes
   * Get note for a file
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async getFileNote(req, res) {
    try {
      const { fileId } = req.params;
      const userId = req.user.userId;

      const note = await FileService.getFileNote(parseInt(fileId), userId);

      return res.status(200).json({
        success: true,
        note: note || null
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = FileController;
