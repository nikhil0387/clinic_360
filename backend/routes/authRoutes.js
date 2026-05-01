import express from 'express';
import {
  registerUser,
  loginUser,
  sendOtp,
  forgotPassword,
  resetPassword,
  quickAdmit
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/quick-admit', quickAdmit);

export default router;
