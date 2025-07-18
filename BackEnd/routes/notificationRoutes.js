const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications for the current user
router.get('/', notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// Archive notification
router.put('/:id/archive', notificationController.archiveNotification);

module.exports = router;
