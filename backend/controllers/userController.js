import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).sort({ createdAt: -1 }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        token: jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new doctor
// @route   POST /api/users/doctors
// @access  Private/Admin
export const addDoctor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, specialization, experience, bio, consultationFee } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'doctor',
      specialization,
      experience,
      bio,
      consultationFee: consultationFee || 150
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
