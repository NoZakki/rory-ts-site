/**
 * Support Routes
 */

const express = require('express');
const router = express.Router();
const SupportController = require('../controllers/SupportController');

// Send support message (no auth required - AI response is local)
router.post('/message', SupportController.sendMessage);

// Get bot info (public)
router.get('/bot-info', SupportController.getBotInfo);

module.exports = router;
