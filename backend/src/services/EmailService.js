/**
 * Email Service
 * Handles sending emails for OTP verification
 */

const nodemailer = require('nodemailer');

// Configure transporter (using Gmail as example - replace with your SMTP)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // Or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

class EmailService {
  /**
   * Send OTP email
   * @param {string} to - Recipient email
   * @param {string} otp - OTP code
   * @returns {Promise<boolean>} Success status
   */
  static async sendOTP(to, otp) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Codice di verifica RoryCloud',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Verifica il tuo account RoryCloud</h2>
            <p>Ciao!</p>
            <p>Il tuo codice di verifica è:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
              ${otp}
            </div>
            <p>Questo codice scade tra 10 minuti.</p>
            <p>Se non hai richiesto questo codice, ignora questa email.</p>
            <br>
            <p>RoryCloud Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  /**
   * Generate random OTP
   * @returns {string} 6-digit OTP
   */
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

module.exports = EmailService;