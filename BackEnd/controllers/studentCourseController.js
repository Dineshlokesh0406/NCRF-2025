const Student = require('../model/Student');
const Course = require('../model/Course');

// Enroll a student in a course
exports.enrollStudentInCourse = async (req, res) => {
    try {
        const { usn } = req.params;
        const { courseId } = req.body;
        
        // Find the student
        const student = await Student.findOne({ usn: usn.toUpperCase() });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Find the course
        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        
        // Check if student is already enrolled in this course
        const isEnrolled = student.courses.some(c => c.courseId === courseId);
        if (isEnrolled) {
            return res.status(400).json({
                success: false,
                message: 'Student is already enrolled in this course'
            });
        }
        
        // Add course to student's courses
        student.courses.push({
            courseId: course.courseId,
            courseName: course.courseName,
            semester: course.semester,
            credits: course.credits,
            grade: 'Pending',
            status: 'In Progress',
            enrollmentDate: new Date()
        });
        
        await student.save();
        
        res.status(200).json({
            success: true,
            message: 'Student enrolled in course successfully',
            data: student
        });
    } catch (error) {
        console.error('Error enrolling student in course:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all courses for a student
exports.getStudentCourses = async (req, res) => {
    try {
        const { usn } = req.params;
        
        // Find the student
        const student = await Student.findOne({ usn: usn.toUpperCase() });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        res.status(200).json({
            success: true,
            courses: student.courses
        });
    } catch (error) {
        console.error('Error getting student courses:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update a student's course (grade, status)
exports.updateStudentCourse = async (req, res) => {
    try {
        const { usn, courseId } = req.params;
        const { grade, status } = req.body;
        
        // Find the student
        const student = await Student.findOne({ usn: usn.toUpperCase() });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Find the course in student's courses
        const courseIndex = student.courses.findIndex(c => c.courseId === courseId);
        if (courseIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Course not found in student\'s courses'
            });
        }
        
        // Update the course
        if (grade) student.courses[courseIndex].grade = grade;
        if (status) student.courses[courseIndex].status = status;
        
        await student.save();
        
        res.status(200).json({
            success: true,
            message: 'Student course updated successfully',
            data: student.courses[courseIndex]
        });
    } catch (error) {
        console.error('Error updating student course:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Remove a course from a student
exports.removeStudentCourse = async (req, res) => {
    try {
        const { usn, courseId } = req.params;
        
        // Find the student
        const student = await Student.findOne({ usn: usn.toUpperCase() });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Find the course in student's courses
        const courseIndex = student.courses.findIndex(c => c.courseId === courseId);
        if (courseIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Course not found in student\'s courses'
            });
        }
        
        // Remove the course
        student.courses.splice(courseIndex, 1);
        
        await student.save();
        
        res.status(200).json({
            success: true,
            message: 'Course removed from student successfully'
        });
    } catch (error) {
        console.error('Error removing student course:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Bulk enroll students in courses based on semester
exports.bulkEnrollStudents = async (req, res) => {
    try {
        const { semester, courseIds } = req.body;
        
        if (!semester || !courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request. Provide semester and courseIds array'
            });
        }
        
        // Find all students in the specified semester
        const students = await Student.find({ semester: parseInt(semester) });
        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No students found in this semester'
            });
        }
        
        // Find all courses
        const courses = await Course.find({ courseId: { $in: courseIds } });
        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No courses found with the provided IDs'
            });
        }
        
        // Map course IDs to course objects for quick lookup
        const courseMap = {};
        courses.forEach(course => {
            courseMap[course.courseId] = course;
        });
        
        // Enroll each student in each course
        const results = [];
        for (const student of students) {
            const enrolledCourses = [];
            
            for (const courseId of courseIds) {
                const course = courseMap[courseId];
                if (!course) continue;
                
                // Check if student is already enrolled in this course
                const isEnrolled = student.courses.some(c => c.courseId === courseId);
                if (isEnrolled) continue;
                
                // Add course to student's courses
                student.courses.push({
                    courseId: course.courseId,
                    courseName: course.courseName,
                    semester: course.semester,
                    credits: course.credits,
                    grade: 'Pending',
                    status: 'In Progress',
                    enrollmentDate: new Date()
                });
                
                enrolledCourses.push(course.courseId);
            }
            
            if (enrolledCourses.length > 0) {
                await student.save();
                results.push({
                    usn: student.usn,
                    name: student.name,
                    enrolledCourses
                });
            }
        }
        
        res.status(200).json({
            success: true,
            message: `Enrolled ${results.length} students in courses`,
            results
        });
    } catch (error) {
        console.error('Error in bulk enrollment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
