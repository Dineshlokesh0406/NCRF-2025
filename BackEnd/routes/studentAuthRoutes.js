const express = require('express');
const router = express.Router();
const studentAuthController = require('../controllers/studentAuthController');
const { verifyToken } = require('../middleware/auth');

// Student login
router.post('/login', studentAuthController.login);

// Get student profile (protected route)
router.get('/profile', verifyToken, studentAuthController.getProfile);

module.exports = router;
