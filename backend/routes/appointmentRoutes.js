import express from 'express';
import { createAppointment, getAppointments } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

export default router;
