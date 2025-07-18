import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const NotificationList = ({ 
  notifications, 
  loading, 
  error, 
  markAsRead, 
  markAllAsRead, 
  archiveNotification,
  viewAllNotifications
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    // Navigate based on notification type
    if (notification.type === 'low_credits' || notification.type === 'credit_update') {
      if (notification.relatedTo && notification.relatedTo.usn) {
        navigate(`/credits?usn=${notification.relatedTo.usn}`);
      } else {
        navigate('/credits');
      }
    } else if (notification.type === 'new_student') {
      if (notification.relatedTo && notification.relatedTo.usn) {
        navigate(`/credits?usn=${notification.relatedTo.usn}`);
      } else {
        navigate('/credits');
      }
    } else if (notification.type === 'deadline') {
      // Could navigate to a calendar or dashboard
      navigate('/dashboard');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'low_credits':
        return '⚠️';
      case 'new_student':
        return '👤';
      case 'deadline':
        return '⏰';
      case 'credit_update':
        return '📝';
      case 'system':
        return '🔔';
      default:
        return '🔔';
    }
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        {notifications.length > 0 && (
          <button 
            className="mark-all-read-button"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="notification-content">
        {loading ? (
          <div className="notification-loading">Loading notifications...</div>
        ) : error ? (
          <div className="notification-error">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications</p>
          </div>
        ) : (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li 
                key={notification._id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              >
                <div 
                  className="notification-item-content"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-details">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{formatDate(notification.createdAt)}</div>
                  </div>
                </div>
                <button 
                  className="notification-dismiss"
                  onClick={(e) => {
                    e.stopPropagation();
                    archiveNotification(notification._id);
                  }}
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="notification-footer">
        <button 
          className="view-all-button"
          onClick={viewAllNotifications}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationList;
