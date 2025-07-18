const mongoose = require('mongoose');
const userModel = require('./model/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createFacultyUser() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: 'faculty@test.com' });
    if (existingUser) {
      console.log('Test user already exists with role:', existingUser.role);
      
      // Update role to Faculty if it's not already
      if (existingUser.role !== 'Faculty') {
        await userModel.updateOne(
          { email: 'faculty@test.com' },
          { $set: { role: 'Faculty' } }
        );
        console.log('Updated user role to Faculty');
      }
      
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
    console.log('Test user created successfully with role: Faculty');
    
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

createFacultyUser();
