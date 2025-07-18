const Student = require('../model/Student');
const StudentChange = require('../model/StudentChange');
const StudentAuth = require('../model/StudentAuth');
// Removed notificationController import
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Cleanup route for development
exports.cleanupStudent = async (req, res) => {
    try {
        const { usn } = req.params;
        await Student.deleteOne({ usn: usn.toUpperCase() });
        await StudentChange.deleteMany({ usn: usn.toUpperCase() });
        res.json({ success: true, message: 'Cleanup successful' });
    } catch (error) {
        console.error('Error in cleanup:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/students/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}).single('photo');

// Add new student
exports.addStudent = async (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: 'File upload error: ' + err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        try {
            console.log('Raw form data:', req.body);
            console.log('File:', req.file);

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a photo'
                });
            }

            const usn = req.body.usn.toUpperCase();
            console.log('Processing USN:', usn);

            // Delete all existing records first
            await Promise.all([
                Student.deleteOne({ usn }),
                StudentAuth.deleteOne({ usn }),
                StudentChange.deleteMany({ usn })
            ]);

            const studentData = {
                name: req.body.name,
                usn: usn,
                dateOfBirth: new Date(req.body.dateOfBirth),
                department: req.body.department || 'MCA',
                semester: parseInt(req.body.semester) || 1,
                credits: parseInt(req.body.credits) || 0,
                academicYear: req.body.academicYear,
                photo: req.file.path.replace(/\\/g, '/')
            };

            // Create all records in sequence to ensure proper order
            const student = await Student.create(studentData);
            console.log('Student created:', student);

            const studentAuth = await StudentAuth.create({
                usn: student.usn,
                dateOfBirth: student.dateOfBirth
            });
            console.log('Auth created:', studentAuth);

            const studentChange = await StudentChange.create({
                usn: student.usn,
                changeType: 'new',
                changes: studentData
            });
            console.log('Change created:', studentChange);

            // Removed notification creation code

            res.status(201).json({
                success: true,
                data: student
            });
        } catch (error) {
            console.error('Error in addStudent:', error);

            // Clean up the uploaded file
            if (req.file) {
                const fs = require('fs');
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }

            res.status(400).json({
                success: false,
                message: error.message || 'Error adding student'
            });
        }
    });
};

// Delete student and all associated data
exports.deleteStudent = async (req, res) => {
    try {
        const usn = req.params.usn.toUpperCase();

        // Find the student first
        const student = await Student.findOne({ usn });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Delete all related records first
        await Promise.all([
            Student.deleteOne({ usn }),
            StudentChange.deleteMany({ usn })
        ]);

        // Delete the photo file if it exists
        if (student.photo) {
            const fs = require('fs').promises;
            const path = require('path');
            try {
                const photoPath = path.join(__dirname, '..', 'uploads', student.photo);
                await fs.unlink(photoPath);
            } catch (photoError) {
                console.error('Error deleting photo:', photoError);
                // Continue execution even if photo deletion fails
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting student: ' + (error.message || 'Unknown error')
        });
    }
};

// Get all USN numbers
exports.getAllUsn = async (req, res) => {
    try {
        const usns = await Student.find().select('usn -_id');
        res.json(usns.map(item => item.usn));
    } catch (error) {
        console.error('Error in getAllUsn:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get student by USN
exports.getStudentByUsn = async (req, res) => {
    try {
        const student = await Student.findOne({ usn: req.params.usn.toUpperCase() });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error getting student:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        console.log('Update request received for USN:', req.params.usn);
        console.log('Update data:', req.body);

        // Get current student data
        const currentStudent = await Student.findOne({ usn: req.params.usn.toUpperCase() });
        if (!currentStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Create a copy of the request body to avoid modifying it
        const updateData = { ...req.body };

        // Determine change type and prepare previous values
        let changeType = 'info';
        const previousValues = {};

        // If only credits is being updated
        if (Object.keys(updateData).length === 1 && 'credits' in updateData) {
            changeType = 'credits';
            previousValues.credits = currentStudent.credits;
            console.log('Credit update detected. Previous credits:', previousValues.credits);
            console.log('New credits:', updateData.credits);
        } else {
            // For info updates, only include changed fields
            Object.keys(updateData).forEach(key => {
                previousValues[key] = currentStudent[key];
            });
            console.log('Info update detected. Previous values:', previousValues);
            console.log('New values:', updateData);
        }

        // Update student
        const student = await Student.findOneAndUpdate(
            { usn: req.params.usn.toUpperCase() },
            updateData,
            { new: true, runValidators: true }
        );

        // Record the change
        const change = await StudentChange.create({
            usn: student.usn,
            changeType,
            changes: updateData,
            previousValues,
            changedBy: 'admin'
        });

        console.log('Change recorded:', change);

        res.json({
            success: true,
            message: 'Student updated successfully',
            student
        });
    } catch (error) {
        console.error('Error in updateStudent:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all changes for a student
exports.getStudentChanges = async (req, res) => {
    try {
        console.log('Fetching changes for USN:', req.params.usn);
        const changes = await StudentChange.find({ usn: req.params.usn.toUpperCase() })
            .sort('-createdAt');

        console.log('Found changes:', changes);
        res.json(changes);
    } catch (error) {
        console.error('Error in getStudentChanges:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const { semester, department } = req.query;

        // Build query based on filters
        let query = {};
        if (semester) {
            query.semester = parseInt(semester);
        }
        if (department) {
            query.department = department;
        }

        const students = await Student.find(query);
        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Error in getAllStudents:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update only student credits
exports.updateStudentCredits = async (req, res) => {
    try {
        console.log('Credits update request received for USN:', req.params.usn);
        console.log('Credits data:', req.body);

        // Validate that credits are being updated
        if (!req.body.credits && req.body.credits !== 0) {
            return res.status(400).json({
                success: false,
                message: 'Credits value is required'
            });
        }

        // Get current student data
        const currentStudent = await Student.findOne({ usn: req.params.usn.toUpperCase() });
        if (!currentStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const previousCredits = currentStudent.credits;
        const newCredits = parseInt(req.body.credits);

        // Prepare update data
        const updateData = { credits: newCredits };

        // If credit breakdown is provided, store it as well
        if (req.body.creditBreakdown) {
            updateData.creditBreakdown = {
                theory: parseInt(req.body.creditBreakdown.theory) || 0,
                practical: parseInt(req.body.creditBreakdown.practical) || 0,
                experimental: parseInt(req.body.creditBreakdown.experimental) || 0
            };
        }

        // Update student credits
        const student = await Student.findOneAndUpdate(
            { usn: req.params.usn.toUpperCase() },
            updateData,
            { new: true, runValidators: true }
        );

        // Get user ID from token
        const authHeader = req.headers.authorization;
        let userId = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
                userId = decoded.id;
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        // Prepare change data
        const changeData = { credits: newCredits };
        const previousData = { credits: previousCredits };

        // Include credit breakdown in change record if provided
        if (req.body.creditBreakdown) {
            changeData.creditBreakdown = updateData.creditBreakdown;
            previousData.creditBreakdown = currentStudent.creditBreakdown || {
                theory: 0,
                practical: 0,
                experimental: 0
            };
        }

        // Record the change
        const change = await StudentChange.create({
            usn: student.usn,
            changeType: 'credits',
            changes: changeData,
            previousValues: previousData,
            changedBy: userId || 'faculty'
        });

        console.log('Credits change recorded:', change);

        // Removed notification creation code

        res.json({
            success: true,
            message: 'Student credits updated successfully',
            student
        });
    } catch (error) {
        console.error('Error in updateStudentCredits:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get student statistics for dashboard
exports.getStudentStats = async (req, res) => {
    try {
        const { department } = req.query;

        // Create match stage for filtering by department if provided
        const matchStage = department ? { department } : {};

        // Get total number of students
        const totalStudents = await Student.countDocuments(matchStage);

        // Get average credits
        const creditsResult = await Student.aggregate([
            { $match: matchStage },
            { $group: { _id: null, averageCredits: { $avg: "$credits" } } }
        ]);
        const averageCredits = creditsResult.length > 0 ? creditsResult[0].averageCredits : 0;

        // If department is provided, we don't need department breakdown
        let departmentBreakdown = [];
        if (!department) {
            departmentBreakdown = await Student.aggregate([
                { $group: {
                    _id: "$department",
                    count: { $sum: 1 },
                    averageCredits: { $avg: "$credits" }
                }},
                { $project: {
                    _id: 0,
                    department: "$_id",
                    count: 1,
                    averageCredits: 1
                }},
                { $sort: { department: 1 } }
            ]);
        }

        // Get semester breakdown (filtered by department if provided)
        const semesterBreakdown = await Student.aggregate([
            { $match: matchStage },
            { $group: {
                _id: "$semester",
                count: { $sum: 1 },
                averageCredits: { $avg: "$credits" }
            }},
            { $project: {
                _id: 0,
                semester: "$_id",
                count: 1,
                averageCredits: 1
            }},
            { $sort: { semester: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalStudents,
                averageCredits,
                departmentBreakdown,
                semesterBreakdown
            }
        });
    } catch (error) {
        console.error('Error in getStudentStats:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get recent credit updates
exports.getRecentCreditUpdates = async (req, res) => {
    try {
        const { department } = req.query;

        // Create pipeline for aggregation
        const pipeline = [
            { $match: { changeType: 'credits' } },
            { $sort: { createdAt: -1 } },
            { $limit: 20 }, // Get more than we need initially
            { $lookup: {
                from: 'students',
                localField: 'usn',
                foreignField: 'usn',
                as: 'student'
            }},
            { $unwind: '$student' }
        ];

        // Add department filter if provided
        if (department) {
            pipeline.push({ $match: { 'student.department': department } });
            pipeline.push({ $limit: 10 }); // Limit to 10 after filtering
        } else {
            pipeline.push({ $limit: 10 }); // Limit to 10 if no filter
        }

        // Add projection stage
        pipeline.push({
            $project: {
                usn: 1,
                name: '$student.name',
                department: '$student.department',
                oldCredits: '$previousValues.credits',
                newCredits: '$changes.credits',
                updatedAt: '$createdAt'
            }
        });

        const recentUpdates = await StudentChange.aggregate(pipeline);

        res.json({
            success: true,
            data: recentUpdates
        });
    } catch (error) {
        console.error('Error in getRecentCreditUpdates:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get credit history for a student
exports.getStudentCreditHistory = async (req, res) => {
    try {
        const { usn } = req.params;

        const creditHistory = await StudentChange.aggregate([
            {
                $match: {
                    usn: usn.toUpperCase(),
                    changeType: 'credits'
                }
            },
            { $sort: { createdAt: -1 } },
            { $project: {
                id: '$_id',
                usn: 1,
                previousCredits: '$previousValues.credits',
                newCredits: '$changes.credits',
                timestamp: '$createdAt',
                updatedBy: '$changedBy',
                reason: '$reason'
            }}
        ]);

        res.json({
            success: true,
            data: creditHistory
        });
    } catch (error) {
        console.error('Error in getStudentCreditHistory:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};