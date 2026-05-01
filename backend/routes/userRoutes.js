import express from 'express';
import { getDoctors, updateProfile, addDoctor } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/doctors', getDoctors);
router.post('/doctors', protect, authorize('admin'), addDoctor);
router.put('/profile', protect, updateProfile);

export default router;
