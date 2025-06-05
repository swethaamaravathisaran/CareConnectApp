// Routes/authRoutes.js
import express from 'express';
import * as authController from '../Controllers/authController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
