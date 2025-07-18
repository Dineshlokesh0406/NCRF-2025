import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css';

const NotificationsPage = ({ url }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // all, unread, type-specific
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, currentPage, filter]);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
      let endpoint = `${url}/api/notifications?page=${currentPage}&limit=10`;
      
      if (filter === 'unread') {
        endpoint += '&unreadOnly=true';
      } else if (filter !== 'all') {
        endpoint += `&type=${filter}`;
      }
      
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });
      
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
      console.error('Error archiving notification:', error);
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
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when changing filters
  };
  
  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <div className="notifications-actions">
          {notifications.length > 0 && (
            <button 
              className="mark-all-read-btn"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>
      
      <div className="notifications-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => handleFilterChange('unread')}
        >
          Unread
        </button>
        <button 
          className={`filter-btn ${filter === 'low_credits' ? 'active' : ''}`}
          onClick={() => handleFilterChange('low_credits')}
        >
          Low Credits
        </button>
        <button 
          className={`filter-btn ${filter === 'new_student' ? 'active' : ''}`}
          onClick={() => handleFilterChange('new_student')}
        >
          New Students
        </button>
        <button 
          className={`filter-btn ${filter === 'deadline' ? 'active' : ''}`}
          onClick={() => handleFilterChange('deadline')}
        >
          Deadlines
        </button>
        <button 
          className={`filter-btn ${filter === 'credit_update' ? 'active' : ''}`}
          onClick={() => handleFilterChange('credit_update')}
        >
          Credit Updates
        </button>
      </div>
      
      <div className="notifications-content">
        {loading ? (
          <div className="notifications-loading">Loading notifications...</div>
        ) : error ? (
          <div className="notifications-error">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">
            <div className="no-notifications-icon">🔔</div>
            <h3>No notifications</h3>
            <p>You don't have any notifications at the moment.</p>
          </div>
        ) : (
          <ul className="notifications-list">
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
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
