const mongoose = require('mongoose');

const LoginHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SuperAdmin',
        required: false // Changed to false to allow null values for failed login attempts
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    browser: {
        type: String
    },
    os: {
        type: String
    },
    device: {
        type: String
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LoginHistory', LoginHistorySchema);
