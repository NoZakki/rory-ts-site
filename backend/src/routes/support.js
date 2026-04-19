/**
 * Support Routes
 */

const express = require('express');
const router = express.Router();
const SupportController = require('../controllers/SupportController');
const { authenticateToken } = require('../middleware/auth');

// Send support message (requires auth)
router.post('/message', authenticateToken, SupportController.sendMessage);

// Get bot info (public)
router.get('/bot-info', SupportController.getBotInfo);

module.exports = router;
