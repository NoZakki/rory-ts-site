/**
 * File Share Routes
 */

const express = require('express');
const router = express.Router();
const FileShareController = require('../controllers/FileShareController');
const { authenticateToken } = require('../middleware/auth');

// Create share link (requires auth)
router.post('/:fileId/share', authenticateToken, FileShareController.createShare);

// Get all shares for user (requires auth)
router.get('/my-shares', authenticateToken, FileShareController.getUserShares);

// Delete share (requires auth)
router.delete('/:fileId/share', authenticateToken, FileShareController.deleteShare);

// Get shared file info (public)
router.get('/shared/:shareToken', FileShareController.getSharedFile);

// Download shared file (public)
router.get('/shared/:shareToken/download', FileShareController.downloadSharedFile);

module.exports = router;
