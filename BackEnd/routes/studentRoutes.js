const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken } = require('../middleware/auth');

// Cleanup route (development only)
router.get('/:usn/cleanup', studentController.cleanupStudent);

// Public routes (accessible without authentication)
// Get all students
router.get('/', studentController.getAllStudents);

// Get all USN numbers
router.get('/usn-list', studentController.getAllUsn);

// Add new student
router.post('/', studentController.addStudent);

// Protected routes (require authentication)
router.use(verifyToken);

// Get student statistics for dashboard
router.get('/stats', studentController.getStudentStats);

// Get recent credit updates
router.get('/recent-updates', studentController.getRecentCreditUpdates);

// Get student by USN - must be after other specific routes to avoid catching them
router.get('/:usn', studentController.getStudentByUsn);

// Get all changes for a student (must be before /:usn update route)
router.get('/:usn/changes', studentController.getStudentChanges);

// Get credit history for a student
router.get('/:usn/credit-history', studentController.getStudentCreditHistory);

// Update student
router.put('/:usn', studentController.updateStudent);

// Update student credits only
router.patch('/:usn/credits', studentController.updateStudentCredits);

// Delete student
router.delete('/:usn', studentController.deleteStudent);

module.exports = router;
