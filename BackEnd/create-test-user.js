const mongoose = require('mongoose');
const userModel = require('./model/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: 'faculty@test.com' });
    if (existingUser) {
      console.log('Test user already exists');
      mongoose.disconnect();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Faculty@123', salt);

    // Create new user
    const newUser = new userModel({
      name: 'Test Faculty',
      email: 'faculty@test.com',
      password: hashedPassword,
      role: 'Faculty'
    });

    await newUser.save();
    console.log('Test user created successfully');
    
    // List all users
    const users = await userModel.find();
    console.log('All users:');
    users.forEach(user => {
      console.log(`Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
    });

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

createTestUser();
