const mongoose = require('mongoose');

const studentChangeSchema = new mongoose.Schema({
    usn: {
        type: String,
        required: true,
        ref: 'Student'
    },
    changeType: {
        type: String,
        required: true,
        enum: ['info', 'credits', 'new']
    },
    changes: {
        type: Object,
        required: true
    },
    previousValues: {
        type: Object,
        default: {}  
    },
    changedBy: {
        type: String,
        default: 'admin'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentChange', studentChangeSchema);
