import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nodemailer config (using Ethereal for testing if no env vars are provided)
// Nodemailer config for Gmail - Dynamic initialization
const getTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('WARNING: SMTP credentials missing in .env file');
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role, otp } = req.body;

  try {
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, remove it
    await OTP.deleteOne({ email });
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'patient',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Remove any existing OTP for this email
    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp: hashedOtp,
    });

    // Send email
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"Clinic 360" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Registration OTP - Clinic 360',
      text: `Your OTP for registration is ${otp}. It is valid for 10 minutes.`,
      html: `<b>Your OTP for registration is ${otp}.</b><br>It is valid for 10 minutes.`,
    });
    
    console.log('OTP Email sent: %s', info.messageId);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: hashedOtp });

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Clinic 360" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset OTP - Clinic 360',
      text: `Your OTP for password reset is ${otp}. Valid for 10 minutes.`,
      html: `<b>Your OTP for password reset is ${otp}.</b><br>Valid for 10 minutes.`,
    });

    res.status(200).json({ message: 'Reset OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: 'OTP expired or invalid' });

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) return res.status(400).json({ message: 'Invalid OTP' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await OTP.deleteOne({ email });
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
