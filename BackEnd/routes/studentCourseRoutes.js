const express = require('express');
const router = express.Router();
const studentCourseController = require('../controllers/studentCourseController');
const { verifyToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Bulk enroll students in courses based on semester
router.post('/bulk-enroll', studentCourseController.bulkEnrollStudents);

// Enroll a student in a course
router.post('/:usn/enroll', studentCourseController.enrollStudentInCourse);

// Get all courses for a student
router.get('/:usn/courses', studentCourseController.getStudentCourses);

// Update a student's course (grade, status)
router.put('/:usn/courses/:courseId', studentCourseController.updateStudentCourse);

// Remove a course from a student
router.delete('/:usn/courses/:courseId', studentCourseController.removeStudentCourse);

module.exports = router;
