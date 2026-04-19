/**
 * File Routes
 * /api/files/* endpoints
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const FileController = require('../controllers/FileController');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// SECURITY: Configure multer for file uploads
// Store files in memory before encryption
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || 52428800), // 50MB
  },
  fileFilter: (req, file, cb) => {
    // SECURITY: Validate file extension to prevent malicious uploads
    const allowedExtensions = [
      // Immagini
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.tiff',
      // Documenti
      '.pdf', '.doc', '.docx', '.odt', '.rtf', '.txt',
      // Fogli di calcolo
      '.xls', '.xlsx', '.ods', '.csv',
      // Presentazioni
      '.ppt', '.pptx', '.odp',
      // Archivi
      '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2',
      // Audio
      '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a',
      // Video
      '.mp4', '.avi', '.mov', '.mkv', '.webm', '.wmv',
      // Dati
      '.json', '.xml', '.yaml', '.yml',
      // Codice
      '.js', '.ts', '.html', '.css', '.py', '.java', '.cpp', '.c', '.sh',
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return cb(new Error(`Tipo di file ${ext} non supportato`));
    }

    cb(null, true);
  },
});

/**
 * POST /api/files/upload
 * Upload a file
 * Requires: authenticated user, multipart/form-data with 'file' field
 */
router.post(
  '/upload',
  authenticateToken,
  upload.single('file'),
  asyncHandler(FileController.uploadFile)
);

/**
 * GET /api/files
 * Get all files for current user
 * Returns paginated file list with metadata
 */
router.get(
  '/',
  authenticateToken,
  asyncHandler(FileController.getUserFiles)
);

/**
 * GET /api/files/:fileId
 * Get single file metadata (without downloading)
 */
router.get(
  '/:fileId',
  authenticateToken,
  asyncHandler(FileController.getFile)
);

/**
 * GET /api/files/:fileId/download
 * Download and decrypt file
 * User receives the decrypted file
 */
router.get(
  '/:fileId/download',
  authenticateToken,
  asyncHandler(FileController.downloadFile)
);

/**
 * DELETE /api/files/:fileId
 * Delete file and all associated notes
 */
router.delete(
  '/:fileId',
  authenticateToken,
  asyncHandler(FileController.deleteFile)
);

/**
 * POST /api/files/:fileId/notes
 * Create or update note for a file
 * Body: {noteContent}
 */
router.post(
  '/:fileId/notes',
  authenticateToken,
  asyncHandler(FileController.updateFileNote)
);

/**
 * GET /api/files/:fileId/notes
 * Get note for a specific file
 */
router.get(
  '/:fileId/notes',
  authenticateToken,
  asyncHandler(FileController.getFileNote)
);

module.exports = router;
