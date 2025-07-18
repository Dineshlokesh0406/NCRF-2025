const mongoose = require('mongoose');
const userModel = require('./model/userModel');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    return userModel.find();
  })
  .then(users => {
    console.log('All users:');
    users.forEach(user => {
      console.log(`Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
    });
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
