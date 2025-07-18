const mongoose = require('mongoose');

// We're not dropping indexes anymore as per user request
// This ensures better query performance and stability

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    usn: {
        type: String,
        required: true,
        uppercase: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true,
        default: 'MCA'
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
        default: 1
    },
    credits: {
        type: Number,
        required: true,
        default: 0
    },
    creditBreakdown: {
        theory: {
            type: Number,
            default: 0
        },
        practical: {
            type: Number,
            default: 0
        },
        experimental: {
            type: Number,
            default: 0
        }
    },
    academicYear: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    gpa: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    attendance: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    activitiesCompleted: {
        type: Number,
        default: 0
    },
    skillsAcquired: {
        type: [String],
        default: []
    },
    courses: {
        type: [{
            courseId: String,
            courseName: String,
            semester: Number,
            credits: Number,
            grade: String,
            status: {
                type: String,
                enum: ['Completed', 'In Progress', 'Upcoming'],
                default: 'Upcoming'
            },
            enrollmentDate: Date
        }],
        default: []
    },
    achievements: {
        type: [{
            title: String,
            description: String,
            category: String,
            level: {
                type: String,
                enum: ['gold', 'silver', 'bronze'],
                default: 'bronze'
            },
            date: Date
        }],
        default: []
    }
}, {
    timestamps: true
});

// Create index after schema definition
studentSchema.post('save', async function() {
    try {
        await this.constructor.collection.createIndex({ usn: 1 });
        console.log('Created index on usn field');
    } catch (err) {
        console.error('Error creating index:', err);
    }
});

module.exports = mongoose.model('Student', studentSchema);
