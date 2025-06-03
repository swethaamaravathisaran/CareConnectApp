const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const authMiddleware = require('../Middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// New route for Google OAuth login
router.post('/google-login', authController.googleLogin);

// Protected route
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
