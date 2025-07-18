const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('./model/userModel');
const Student = require('./model/Student');
require('dotenv').config();

const createMockData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await userModel.deleteMany({});
    await Student.deleteMany({});
    console.log('Cleared existing data');

    // Create faculty user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Faculty@123', salt);

    const faculty = new userModel({
      name: 'Test Faculty',
      email: 'faculty@test.com',
      password: hashedPassword,
      role: 'Faculty',
      department: 'MCA'
    });

    await faculty.save();
    console.log('Created faculty user');

    // Create some students
    const students = [
      {
        name: 'Aditya Sharma',
        usn: '1SI23MC001',
        dateOfBirth: new Date('2000-05-15'),
        department: 'MCA',
        semester: 1,
        credits: 42,
        academicYear: '2023'
      },
      {
        name: 'Priya Patel',
        usn: '1SI23MB015',
        dateOfBirth: new Date('2001-03-22'),
        department: 'MBA',
        semester: 1,
        credits: 39,
        academicYear: '2023'
      },
      {
        name: 'Rahul Verma',
        usn: '1SI23MT008',
        dateOfBirth: new Date('1999-11-10'),
        department: 'M.Tech',
        semester: 2,
        credits: 45,
        academicYear: '2022'
      },
      {
        name: 'Sneha Gupta',
        usn: '1SI23MC012',
        dateOfBirth: new Date('2000-08-05'),
        department: 'MCA',
        semester: 2,
        credits: 43,
        academicYear: '2022'
      },
      {
        name: 'Vikram Singh',
        usn: '1SI23BT003',
        dateOfBirth: new Date('2002-01-30'),
        department: 'B.Tech',
        semester: 3,
        credits: 38,
        academicYear: '2021'
      }
    ];

    await Student.insertMany(students);
    console.log('Created students');

    console.log('Mock data created successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating mock data:', error);
    mongoose.disconnect();
  }
};

createMockData();
