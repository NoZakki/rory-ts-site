/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

// Admin middleware - check if admin session exists
const adminAuth = (req, res, next) => {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }
  next();
};

// Admin login (no auth required)
router.post('/login', AdminController.adminLogin);

// Protected admin routes
router.get('/users', adminAuth, AdminController.getAllUsers);
router.put('/users/:userId/toggle', adminAuth, AdminController.toggleUserStatus);
router.delete('/users/:userId', adminAuth, AdminController.deleteUser);
router.get('/logs', adminAuth, AdminController.getActivityLogs);
router.get('/stats', adminAuth, AdminController.getSystemStats);

module.exports = router;
