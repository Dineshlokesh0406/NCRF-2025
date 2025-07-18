import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import NotificationList from './NotificationList';
import './Notifications.css';

const NotificationBell = ({ url }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const notificationRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    // Add click event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${url}/api/notifications?limit=5&unreadOnly=false`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });
      
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${url}/api/notifications/${id}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${url}/api/notifications/read-all`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const archiveNotification = async (id) => {
    try {
      await axios.put(`${url}/api/notifications/${id}/archive`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });
      
      // Remove from local state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== id)
      );
      
      // Update unread count if the notification was unread
      const wasUnread = notifications.find(n => n._id === id && !n.isRead);
      if (wasUnread) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (error) {
      console.error('Error archiving notification:', error);
    }
  };

  return (
    <div className="notification-bell-container" ref={notificationRef}>
      <button 
        className="notification-bell-button" 
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <i className="notification-icon">🔔</i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      
      {isOpen && (
        <NotificationList 
          notifications={notifications}
          loading={loading}
          error={error}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          archiveNotification={archiveNotification}
          viewAllNotifications={() => {/* Navigate to all notifications */}}
        />
      )}
    </div>
  );
};

export default NotificationBell;
