const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { verifyToken } = require('../middleware/auth');

// Check if SuperAdmin exists
router.get('/exists', superAdminController.checkSuperAdminExists);

// Register a new SuperAdmin (only if none exists)
router.post('/register', superAdminController.register);

// Login SuperAdmin
router.post('/login', superAdminController.login);

// Verify SuperAdmin token
router.get('/verify', verifyToken, superAdminController.verify);

// Forgot password
router.post('/forgot-password', superAdminController.forgotPassword);

// Reset password - verify token
router.get('/reset-password/:token', superAdminController.verifyResetToken);

// Reset password - update password
router.post('/reset-password/:token', superAdminController.resetPassword);

// Update profile
router.put('/profile', verifyToken, superAdminController.updateProfile);

// Get settings
router.get('/settings', verifyToken, superAdminController.getSettings);

// Update settings
router.post('/settings', verifyToken, superAdminController.updateSettings);

// 2FA Routes
router.post('/2fa/setup', verifyToken, superAdminController.setup2FA);
router.post('/2fa/verify', verifyToken, superAdminController.verify2FA);
router.post('/2fa/enable', verifyToken, superAdminController.enable2FA);
router.post('/2fa/disable', verifyToken, superAdminController.disable2FA);
router.get('/2fa/status', verifyToken, superAdminController.get2FAStatus);

// Login History Routes
router.get('/login-history', verifyToken, superAdminController.getLoginHistory);

module.exports = router;
