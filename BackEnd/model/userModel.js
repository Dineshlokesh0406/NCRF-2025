const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Faculty', 'user'],
    default: 'Faculty'
  },
  department: {
    type: String,
    default: null
  },
  photo: {
    type: String,
    default: null
  },
  cartData:{type:Object,default:{}}
},{minimize:false, timestamps: true})

const userModel=mongoose.models.User || mongoose.model('User', userSchema);

module.exports=userModel;
