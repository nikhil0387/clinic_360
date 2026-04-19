import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Create a new appointment using ACID transactions
// @route   POST /api/appointments
// @access  Private (Patient/Admin)
export const createAppointment = async (req, res) => {
  const { doctorId, date, timeSlot, notes } = req.body;

  // We start a transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Verify doctor exists and is actually a doctor
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' }).session(session);
    if (!doctor) {
      throw new Error('Doctor not found or invalid doctor ID');
    }

    // 2. Check for double booking (atomic check within transaction)
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot
    }).session(session);

    if (existingAppointment) {
      throw new Error('Time slot is already booked for this doctor');
    }

    // 3. Create the appointment
    const appointment = await Appointment.create([{
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      notes
    }], { session: session });

    // 4. Commit the transaction if everything succeeded
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(appointment[0]);
  } catch (error) {
    // 5. Abort transaction on any error
    await session.abortTransaction();
    session.endSession();
    
    // Check if error is due to replica set (meaning local dev environment isn't setup for transactions)
    if (error.message.includes('Transaction numbers')) {
        console.warn('MongoDB Replica Set not detected. Falling back to non-transactional creation.');
        try {
            const fallbackAppointment = await Appointment.create({
                patient: req.user._id,
                doctor: doctorId,
                date: new Date(date),
                timeSlot,
                notes
            });
            return res.status(201).json(fallbackAppointment);
        } catch (fallbackError) {
             return res.status(400).json({ message: fallbackError.message });
        }
    }

    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all appointments for a user (doctor gets theirs, patient gets theirs)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName email');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
