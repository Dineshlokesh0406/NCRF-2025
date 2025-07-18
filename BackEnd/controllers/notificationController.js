const Notification = require('../model/notificationModel');
const Student = require('../model/Student');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

// Get all notifications for the current user
exports.getNotifications = async (req, res) => {
  try {
    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // Get query parameters
    const { page = 1, limit = 10, unreadOnly = false, type } = req.query;

    // Build query
    const query = {
      recipient: id,
      isArchived: false
    };

    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    if (type) {
      query.type = type;
    }

    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count for pagination
    const totalCount = await Notification.countDocuments(query);

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      recipient: id,
      isRead: false,
      isArchived: false
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        totalCount,
        unreadCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const { id: userId } = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // Find notification and ensure it belongs to the user
    const notification = await Notification.findOne({
      _id: id,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Update notification
    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const { id: userId } = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // Update all unread notifications
    await Notification.updateMany(
      { recipient: userId, isRead: false, isArchived: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Archive notification
exports.archiveNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const { id: userId } = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // Find notification and ensure it belongs to the user
    const notification = await Notification.findOne({
      _id: id,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Update notification
    notification.isArchived = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification archived'
    });
  } catch (error) {
    console.error('Error archiving notification:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create notification for low credits
exports.createLowCreditsNotification = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) return;

    // Find faculty members for this department
    const faculty = await User.find({
      role: 'Faculty',
      department: student.department
    });

    if (!faculty.length) return;

    // Create notification for each faculty member
    const notifications = faculty.map(f => ({
      recipient: f._id,
      type: 'low_credits',
      title: 'Low Credits Alert',
      message: `Student ${student.name} (${student.usn}) has critically low credits: ${student.credits}`,
      relatedTo: {
        studentId: student._id,
        usn: student.usn
      }
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error creating low credits notification:', error);
  }
};

// Create notification for new student
exports.createNewStudentNotification = async (student) => {
  try {
    // Find faculty members for this department
    const faculty = await User.find({
      role: 'Faculty',
      department: student.department
    });

    if (!faculty.length) return;

    // Create notification for each faculty member
    const notifications = faculty.map(f => ({
      recipient: f._id,
      type: 'new_student',
      title: 'New Student Added',
      message: `A new student ${student.name} (${student.usn}) has been added to your department`,
      relatedTo: {
        studentId: student._id,
        usn: student.usn
      }
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error creating new student notification:', error);
  }
};

// Create notification for credit update
exports.createCreditUpdateNotification = async (student, oldCredits, newCredits, updatedBy) => {
  try {
    // Find faculty members who have subscribed to this student
    // This would require a subscription model, but for now we'll notify all faculty in the department
    const faculty = await User.find({
      role: 'Faculty',
      department: student.department,
      _id: { $ne: updatedBy } // Don't notify the person who made the update
    });

    if (!faculty.length) return;

    // Create notification for each faculty member
    const notifications = faculty.map(f => ({
      recipient: f._id,
      type: 'credit_update',
      title: 'Student Credits Updated',
      message: `${student.name}'s (${student.usn}) credits have been updated from ${oldCredits} to ${newCredits}`,
      relatedTo: {
        studentId: student._id,
        usn: student.usn
      }
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error creating credit update notification:', error);
  }
};

// Create deadline notification
exports.createDeadlineNotification = async (title, message, deadline, departments = []) => {
  try {
    // Find faculty members for specified departments, or all if none specified
    const query = { role: 'Faculty' };
    if (departments.length > 0) {
      query.department = { $in: departments };
    }

    const faculty = await User.find(query);

    if (!faculty.length) return;

    // Create notification for each faculty member
    const notifications = faculty.map(f => ({
      recipient: f._id,
      type: 'deadline',
      title,
      message,
      relatedTo: {
        deadline: new Date(deadline)
      }
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error creating deadline notification:', error);
  }
};

// Check for students with low credits and create notifications
exports.checkLowCredits = async () => {
  try {
    // Define what "low credits" means - for example, less than 20
    const lowCreditsThreshold = 20;

    // Find students with low credits
    const lowCreditsStudents = await Student.find({ credits: { $lt: lowCreditsThreshold } });

    // Create notifications for each student
    for (const student of lowCreditsStudents) {
      await exports.createLowCreditsNotification(student._id);
    }
  } catch (error) {
    console.error('Error checking for low credits:', error);
  }
};
