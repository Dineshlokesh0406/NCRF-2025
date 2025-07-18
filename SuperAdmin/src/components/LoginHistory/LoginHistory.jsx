import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './LoginHistory.css';

const LoginHistory = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  useEffect(() => {
    fetchLoginHistory(1);
  }, []);

  const fetchLoginHistory = async (page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('superAdminToken');
      const response = await axios.get(`${url}/api/superadmin/login-history?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setLoginHistory(response.data.loginHistory);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching login history:', error);
      toast.error('Failed to fetch login history');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchLoginHistory(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getBrowserIcon = (browser) => {
    switch (browser) {
      case 'Chrome':
        return '🌐';
      case 'Firefox':
        return '🦊';
      case 'Safari':
        return '🧭';
      case 'Edge':
        return '🔵';
      case 'Internet Explorer':
        return '🔍';
      default:
        return '🌐';
    }
  };

  const getOSIcon = (os) => {
    switch (os) {
      case 'Windows':
        return '🪟';
      case 'MacOS':
        return '🍎';
      case 'Linux':
        return '🐧';
      case 'Android':
        return '🤖';
      case 'iOS':
        return '📱';
      default:
        return '💻';
    }
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Mobile':
        return '📱';
      case 'Tablet':
        return '📟';
      case 'Desktop':
        return '🖥️';
      default:
        return '💻';
    }
  };

  const getStatusBadge = (status) => {
    return status === 'success' ? 
      <span className="status-badge success">Success</span> : 
      <span className="status-badge failed">Failed</span>;
  };

  return (
    <div className="login-history-container">
      <h2>Login History</h2>
      <p className="login-history-description">
        View your recent login activity to monitor your account security.
      </p>

      {loading && loginHistory.length === 0 ? (
        <div className="login-history-loading">
          <div className="login-history-spinner"></div>
          <p>Loading login history...</p>
        </div>
      ) : loginHistory.length === 0 ? (
        <div className="no-history">
          <p>No login history available</p>
        </div>
      ) : (
        <>
          <div className="login-history-table-container">
            <table className="login-history-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Browser</th>
                  <th>OS</th>
                  <th>Device</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((entry, index) => (
                  <tr key={index} className={entry.status === 'failed' ? 'failed-login' : ''}>
                    <td>{formatDate(entry.timestamp)}</td>
                    <td>{getStatusBadge(entry.status)}</td>
                    <td>{entry.ipAddress}</td>
                    <td>
                      <span className="browser-info">
                        <span className="browser-icon">{getBrowserIcon(entry.browser)}</span>
                        {entry.browser}
                      </span>
                    </td>
                    <td>
                      <span className="os-info">
                        <span className="os-icon">{getOSIcon(entry.os)}</span>
                        {entry.os}
                      </span>
                    </td>
                    <td>
                      <span className="device-info">
                        <span className="device-icon">{getDeviceIcon(entry.device)}</span>
                        {entry.device}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </div>
              
              <button
                className="pagination-button"
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <div className="security-tips">
        <h3>Security Tips</h3>
        <ul>
          <li>Always log out when using shared computers</li>
          <li>Enable two-factor authentication for additional security</li>
          <li>Check your login history regularly for suspicious activity</li>
          <li>Use a strong, unique password for your account</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginHistory;
