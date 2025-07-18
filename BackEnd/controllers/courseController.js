const Course = require('../model/Course');
const Student = require('../model/Student');

// Get all courses (with optional semester filter)
exports.getAllCourses = async (req, res) => {
    try {
        const { semester } = req.query;

        let query = {};
        if (semester) {
            query.semester = parseInt(semester);
        }

        const courses = await Course.find(query).sort({ courseId: 1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get a single course
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create a new course and automatically enroll students in that semester
exports.createCourse = async (req, res) => {
    try {
        // Check if course with same ID already exists
        const existingCourse = await Course.findOne({ courseId: req.body.courseId });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: 'A course with this ID already exists'
            });
        }

        // Create the course
        const course = await Course.create(req.body);

        // Find all students in the same semester and enroll them in this course
        const semester = parseInt(req.body.semester);
        const students = await Student.find({ semester });

        // Track enrollment results
        const enrollmentResults = [];

        // Enroll each student in the course
        for (const student of students) {
            // Check if student is already enrolled in this course
            const isEnrolled = student.courses.some(c => c.courseId === course.courseId);
            if (!isEnrolled) {
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
                enrollmentResults.push({
                    usn: student.usn,
                    name: student.name,
                    status: 'enrolled'
                });
            } else {
                enrollmentResults.push({
                    usn: student.usn,
                    name: student.name,
                    status: 'already enrolled'
                });
            }
        }

        res.status(201).json({
            success: true,
            course,
            message: `Course created and ${enrollmentResults.filter(r => r.status === 'enrolled').length} students enrolled`,
            enrollmentResults
        });
    } catch (error) {
        console.error('Error creating course:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update a course and update enrolled students if needed
exports.updateCourse = async (req, res) => {
    try {
        // Get the original course before updating
        const originalCourse = await Course.findById(req.params.id);
        if (!originalCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Update the course
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Check if semester or credits changed
        const semesterChanged = originalCourse.semester !== course.semester;
        const creditsChanged = originalCourse.credits !== course.credits;
        const nameChanged = originalCourse.courseName !== course.courseName;

        // If any relevant fields changed, update enrolled students
        if (semesterChanged || creditsChanged || nameChanged) {
            // Find all students enrolled in this course
            const students = await Student.find({ 'courses.courseId': course.courseId });

            // Track update results
            const updateResults = [];

            for (const student of students) {
                // Find the course in student's courses
                const courseIndex = student.courses.findIndex(c => c.courseId === course.courseId);
                if (courseIndex !== -1) {
                    // Update course details
                    if (nameChanged) {
                        student.courses[courseIndex].courseName = course.courseName;
                    }
                    if (creditsChanged) {
                        student.courses[courseIndex].credits = course.credits;
                    }
                    if (semesterChanged) {
                        student.courses[courseIndex].semester = course.semester;
                    }

                    await student.save();
                    updateResults.push({
                        usn: student.usn,
                        name: student.name,
                        status: 'updated'
                    });
                }
            }

            // If semester changed, enroll students in the new semester
            if (semesterChanged) {
                // Find all students in the new semester who aren't already enrolled
                const newSemesterStudents = await Student.find({
                    semester: course.semester,
                    'courses.courseId': { $ne: course.courseId }
                });

                // Enroll each student in the course
                for (const student of newSemesterStudents) {
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
                    updateResults.push({
                        usn: student.usn,
                        name: student.name,
                        status: 'enrolled'
                    });
                }
            }

            return res.status(200).json({
                success: true,
                course,
                message: `Course updated and ${updateResults.length} student enrollments affected`,
                updateResults
            });
        }

        res.status(200).json({
            success: true,
            course,
            message: 'Course updated successfully'
        });
    } catch (error) {
        console.error('Error updating course:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete a course and remove it from all students
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Find all students enrolled in this course
        const students = await Student.find({ 'courses.courseId': course.courseId });

        // Track removal results
        const removalResults = [];

        // Remove course from each student
        for (const student of students) {
            const initialCoursesCount = student.courses.length;

            // Filter out the course to be removed
            student.courses = student.courses.filter(c => c.courseId !== course.courseId);

            if (initialCoursesCount > student.courses.length) {
                await student.save();
                removalResults.push({
                    usn: student.usn,
                    name: student.name,
                    status: 'removed'
                });
            }
        }

        // Delete the course
        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: `Course deleted and removed from ${removalResults.length} students`,
            removalResults
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
