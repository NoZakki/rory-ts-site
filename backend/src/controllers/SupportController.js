/**
 * Support Controller
 * Handles user support requests and Telegram integration
 */

const TelegramService = require('../services/TelegramService');
const { log } = require('../utils/logging');

class SupportController {
  /**
   * Send support message
   */
  static async sendMessage(req, res) {
    try {
      const { message } = req.body;
      const userId = req.user?.id;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: 'Message cannot be empty' });
      }

      if (message.length > 1000) {
        return res.status(400).json({ message: 'Message too long (max 1000 chars)' });
      }

      // Get AI response from Telegram bot service
      const response = await TelegramService.sendMessage(message);

      log('INFO', 'Support message sent', {
        userId,
        messageLength: message.length,
        hasResponse: !!response.message,
      });

      res.json({
        success: true,
        userMessage: message,
        botResponse: response.message,
        isAI: response.isAI ?? true,
        supportEmail: response.supportEmail,
      });
    } catch (error) {
      log('ERROR', 'Send support message error', { error: error.message });
      res.status(500).json({ message: 'Failed to send message' });
    }
  }

  /**
   * Get bot info
   */
  static async getBotInfo(req, res) {
    try {
      const botInfo = TelegramService.getBotInfo();
      res.json(botInfo);
    } catch (error) {
      log('ERROR', 'Get bot info error', { error: error.message });
      res.status(500).json({ message: 'Failed to get bot info' });
    }
  }
}

module.exports = SupportController;
