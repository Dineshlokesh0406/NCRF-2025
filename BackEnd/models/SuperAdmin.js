const mongoose = require('mongoose');

const SuperAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String
    },
    twoFactorBackupCodes: [{
        code: String,
        used: {
            type: Boolean,
            default: false
        }
    }],
    photo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);
