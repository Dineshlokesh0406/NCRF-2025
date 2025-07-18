const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all courses (with optional semester filter)
router.get('/', courseController.getAllCourses);

// Get a single course
router.get('/:id', courseController.getCourse);

// Create a new course
router.post('/', courseController.createCourse);

// Update a course
router.put('/:id', courseController.updateCourse);

// Delete a course
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
