const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    credits: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 3
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create compound index for courseId and semester
courseSchema.index({ courseId: 1, semester: 1 });

module.exports = mongoose.model('Course', courseSchema);
