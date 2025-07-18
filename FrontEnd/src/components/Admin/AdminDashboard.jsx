import React, { useState } from 'react';
import AttendanceManagement from './AttendanceManagement/AttendanceManagement';
import TestComponent from './TestComponent';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <img src="/logo.png" alt="Institution Logo" className="admin-logo-img" />
          <h2>Admin Panel</h2>
        </div>

        <div className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance Management
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Student Management
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Course Management
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="admin-logout">
          <button className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <div className="admin-title">
            <h1>
              {activeTab === 'attendance' && 'Attendance Management'}
              {activeTab === 'students' && 'Student Management'}
              {activeTab === 'courses' && 'Course Management'}
              {activeTab === 'reports' && 'Reports'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>

          <div className="admin-user">
            <span className="admin-username">Admin User</span>
            <div className="admin-avatar">
              <span>A</span>
            </div>
          </div>
        </div>

        <div className="admin-main-content">
          {activeTab === 'attendance' && (
            <>
              <TestComponent />
              <AttendanceManagement />
            </>
          )}
          {activeTab === 'students' && <div className="placeholder">Student Management functionality will be implemented soon.</div>}
          {activeTab === 'courses' && <div className="placeholder">Course Management functionality will be implemented soon.</div>}
          {activeTab === 'reports' && <div className="placeholder">Reports functionality will be implemented soon.</div>}
          {activeTab === 'settings' && <div className="placeholder">Settings functionality will be implemented soon.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
