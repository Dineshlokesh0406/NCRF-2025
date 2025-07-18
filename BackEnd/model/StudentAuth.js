const mongoose = require('mongoose');

const studentAuthSchema = new mongoose.Schema({
    usn: {
        type: String,
        required: true,
        unique: true,
        ref: 'Student'
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentAuth', studentAuthSchema);
