import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const doctors = [
  {
    firstName: 'Julian',
    lastName: 'Vance',
    email: 'j.vance@clinic360.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Nephrology',
    consultationFee: 250
  },
  {
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 's.jenkins@clinic360.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Pediatric Surgeon',
    consultationFee: 180
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'm.chen@clinic360.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Cardiology',
    consultationFee: 300
  },
  {
    firstName: 'Elena',
    lastName: 'Rodriguez',
    email: 'e.rodriguez@clinic360.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Neurologist',
    consultationFee: 350
  }
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Hash passwords before inserting
    const salt = await bcrypt.genSalt(10);
    const doctorsToInsert = await Promise.all(doctors.map(async (doc) => {
        const hashedPassword = await bcrypt.hash(doc.password, salt);
        return { ...doc, password: hashedPassword };
    }));

    // Delete existing doctors to prevent duplicates if ran multiple times
    await User.deleteMany({ role: 'doctor' });
    console.log('Old Doctors cleared');

    await User.insertMany(doctorsToInsert);
    console.log('Doctors Imported Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDoctors();
