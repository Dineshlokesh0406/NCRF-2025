const Student = require('../model/Student');
const StudentAuth = require('../model/StudentAuth');
const jwt = require('jsonwebtoken');

// Student login
exports.login = async (req, res) => {
    try {
        const { usn, dateOfBirth } = req.body;
        console.log('Login attempt:', { usn, dateOfBirth });

        // Find student
        const student = await Student.findOne({ usn: usn.toUpperCase() });
        console.log('Student found:', student ? 'Yes' : 'No');
        
        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid USN or Date of Birth'
            });
        }

        // Parse date in DD-MM-YYYY format
        const [day, month, year] = dateOfBirth.split('-').map(num => parseInt(num, 10));
        console.log('Parsed date:', { day, month, year });
        
        if (!day || !month || !year) {
            console.log('Invalid date format received');
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use DD-MM-YYYY'
            });
        }

        // Check date of birth
        const inputDate = new Date(year, month - 1, day);
        const storedDate = new Date(student.dateOfBirth);
        
        // Convert both dates to YYYY-MM-DD format for comparison
        const formatToDateString = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        const inputDateStr = formatToDateString(inputDate);
        const storedDateStr = formatToDateString(storedDate);

        console.log('Date comparison (YYYY-MM-DD):', {
            input: inputDateStr,
            stored: storedDateStr
        });
        
        if (inputDateStr !== storedDateStr) {
            console.log('Date of birth mismatch');
            return res.status(401).json({
                success: false,
                message: 'Invalid USN or Date of Birth'
            });
        }

        // Get or create auth record
        let auth = await StudentAuth.findOne({ usn: student.usn });
        console.log('Auth record found:', auth ? 'Yes' : 'No');
        if (!auth) {
            auth = await StudentAuth.create({
                usn: student.usn,
                dateOfBirth: student.dateOfBirth
            });
            console.log('Auth record created');
        }

        // Check if account is active
        if (!auth.isActive) {
            console.log('Account is inactive');
            return res.status(403).json({
                success: false,
                message: 'Account is inactive. Please contact administrator.'
            });
        }

        // Update last login
        auth.lastLogin = new Date();
        await auth.save();
        console.log('Last login updated');

        // Generate token
        const token = jwt.sign(
            { 
                id: student._id,
                usn: student.usn
            },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Token generated');

        res.status(200).json({
            success: true,
            token,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get student profile
exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ usn: req.user.usn })
            .select('-password');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            student
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
