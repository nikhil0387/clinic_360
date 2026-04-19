import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for advanced seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Cleared existing data.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Admin
    const admin = await User.create({
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@clinic360.com',
      password: hashedPassword,
      role: 'admin'
    });

    // 2. Create 6 Doctors
    const doctorsData = [
      { firstName: 'Alistair', lastName: 'Thorne', email: 'thorne@clinic360.com', specialization: 'Neurosurgery', experience: '15', consultationFee: 150, bio: 'Senior Consultant at the Neurological Institute.' },
      { firstName: 'Sarah', lastName: 'Jenkins', email: 'jenkins@clinic360.com', specialization: 'Cardiology', experience: '12', consultationFee: 120, bio: 'Expert in non-invasive cardiology.' },
      { firstName: 'Mark', lastName: 'Vance', email: 'vance@clinic360.com', specialization: 'Pediatrics', experience: '8', consultationFee: 90, bio: 'Dedicated to pediatric wellness.' },
      { firstName: 'Elena', lastName: 'Rodriguez', email: 'rodriguez@clinic360.com', specialization: 'Dermatology', experience: '10', consultationFee: 110, bio: 'Specialist in clinical and aesthetic dermatology.' },
      { firstName: 'James', lastName: 'Wilson', email: 'wilson@clinic360.com', specialization: 'Orthopedics', experience: '20', consultationFee: 200, bio: 'Focus on sports medicine and joint replacement.' },
      { firstName: 'Sofia', lastName: 'Chen', email: 'chen@clinic360.com', specialization: 'General Medicine', experience: '6', consultationFee: 80, bio: 'Primary care physician with focus on preventative health.' }
    ];

    const doctors = await User.insertMany(doctorsData.map(d => ({ ...d, password: hashedPassword, role: 'doctor' })));
    console.log('Created 6 Doctors.');

    // 3. Create 5 Patients
    const patientsData = [
      { firstName: 'Nikhil', lastName: 'Sharma', email: 'sharmanikhil3154@gmail.com' },
      { firstName: 'Marianne', lastName: 'Sutherland', email: 'marianne@example.com' },
      { firstName: 'Robert', lastName: 'Kaufman', email: 'robert@example.com' },
      { firstName: 'Alice', lastName: 'Vanderbilt', email: 'alice@example.com' },
      { firstName: 'Thomas', lastName: 'Wright', email: 'thomas@example.com' }
    ];

    const patients = await User.insertMany(patientsData.map(p => ({ ...p, password: hashedPassword, role: 'patient' })));
    console.log('Created 5 Patients.');

    // 4. Create 20+ Appointments (Mix of completed and scheduled)
    const appointmentsData = [];
    const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];
    const statuses = ['scheduled', 'completed', 'cancelled'];

    // Generate appointments for the last 30 days and next 7 days
    for (let i = 0; i < 25; i++) {
      const randomDoc = doctors[Math.floor(Math.random() * doctors.length)];
      const randomPatient = patients[Math.floor(Math.random() * patients.length)];
      const randomSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      
      // Random date between 30 days ago and 7 days from now
      const daysOffset = Math.floor(Math.random() * 37) - 30;
      const date = new Date();
      date.setDate(date.getDate() + daysOffset);

      // Status logic: past dates are usually completed, future are scheduled
      let status = 'scheduled';
      if (daysOffset < 0) {
        status = Math.random() > 0.2 ? 'completed' : 'cancelled';
      }

      appointmentsData.push({
        patient: randomPatient._id,
        doctor: randomDoc._id,
        date: date,
        timeSlot: randomSlot,
        status: status,
        notes: `Simulated appointment for ${status} record.`
      });
    }

    // Ensure at least one appointment for the main user today or tomorrow
    appointmentsData.push({
      patient: patients[0]._id,
      doctor: doctors[0]._id,
      date: new Date(),
      timeSlot: '09:00 AM',
      status: 'scheduled',
      notes: 'Main user initial checkup'
    });

    await Appointment.insertMany(appointmentsData);
    console.log(`Created ${appointmentsData.length} Appointments for Analytics.`);

    console.log('Database seeded successfully with advanced entries!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
