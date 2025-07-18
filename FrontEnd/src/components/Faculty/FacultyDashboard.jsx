import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AttendanceManagement from './AttendanceManagement';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);

  // Determine if this is admin or faculty based on the route
  useEffect(() => {
    if (location.pathname === '/admin') {
      setIsAdmin(true);
      document.title = 'Admin Portal';
    } else {
      setIsAdmin(false);
      document.title = 'Faculty Portal';
    }
  }, [location.pathname]);

  const [facultyData, setFacultyData] = useState({
    name: 'a',
    department: 'No Department',
    totalStudents: 2,
    averageCredits: 0.0,
    activeSemesters: 1,
    semesterData: [
      {
        semester: 1,
        students: 2,
        avgCredits: 0.0
      }
    ],
    recentUpdates: []
  });

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="faculty-content-container">
            <div className="faculty-content-header">
              <h2>{isAdmin ? 'Admin Dashboard' : 'Faculty Dashboard'}</h2>
              <p>Welcome back, {facultyData.name}!</p>
            </div>

            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-title">Total Students</div>
                <div className="stat-value">{facultyData.totalStudents}</div>
              </div>

              <div className="stat-card">
                <div className="stat-title">Average Credits</div>
                <div className="stat-value">{facultyData.averageCredits}</div>
              </div>

              <div className="stat-card">
                <div className="stat-title">Department</div>
                <div className="stat-value">{facultyData.department || 'N/A'}</div>
              </div>

              <div className="stat-card">
                <div className="stat-title">Active Semesters</div>
                <div className="stat-value">{facultyData.activeSemesters}</div>
              </div>
            </div>

            <div className="faculty-card">
              <div className="faculty-card-header">
                <h3>Semester Breakdown</h3>
              </div>
              <div className="faculty-card-content">
                {facultyData.semesterData.map((semester) => (
                  <div key={semester.semester} className="semester-row">
                    <div className="semester-info">
                      <div className="semester-name">Semester {semester.semester}</div>
                      <div className="semester-students">{semester.students} students</div>
                    </div>
                    <div className="semester-credits">
                      Avg. Credits: {semester.avgCredits}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="faculty-card">
              <div className="faculty-card-header">
                <h3>Recent Credit Updates</h3>
              </div>
              <div className="faculty-card-content">
                {facultyData.recentUpdates.length > 0 ? (
                  <div className="updates-list">
                    {facultyData.recentUpdates.map((update, index) => (
                      <div key={index} className="update-item">
                        <div className="update-info">
                          <div className="update-student">{update.studentName}</div>
                          <div className="update-details">{update.details}</div>
                        </div>
                        <div className="update-date">{update.date}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">No recent updates</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return <AttendanceManagement />;

      case 'updateCredits':
        return (
          <div className="faculty-content-container">
            <div className="faculty-content-header">
              <h2>Update Credits</h2>
              <p>Manage student credits</p>
            </div>
            <div className="faculty-card">
              <div className="faculty-card-content">
                <div className="placeholder-content">
                  Update Credits functionality will be implemented soon.
                </div>
              </div>
            </div>
          </div>
        );

      case 'creditHistory':
        return (
          <div className="faculty-content-container">
            <div className="faculty-content-header">
              <h2>Credit History</h2>
              <p>View credit update history</p>
            </div>
            <div className="faculty-card">
              <div className="faculty-card-content">
                <div className="placeholder-content">
                  Credit History functionality will be implemented soon.
                </div>
              </div>
            </div>
          </div>
        );

      case 'courseManagement':
        return (
          <div className="faculty-content-container">
            <div className="faculty-content-header">
              <h2>Course Management</h2>
              <p>Manage courses and curriculum</p>
            </div>
            <div className="faculty-card">
              <div className="faculty-card-content">
                <div className="placeholder-content">
                  Course Management functionality will be implemented soon.
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="faculty-content-container">
            <div className="faculty-content-header">
              <h2>Notifications</h2>
              <p>View system notifications</p>
            </div>
            <div className="faculty-card">
              <div className="faculty-card-content">
                <div className="placeholder-content">
                  Notifications functionality will be implemented soon.
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="faculty-content-container">
            <div className="faculty-content-header">
              <h2>My Profile</h2>
              <p>View and edit your profile</p>
            </div>
            <div className="faculty-card">
              <div className="faculty-card-content">
                <div className="placeholder-content">
                  Profile functionality will be implemented soon.
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="faculty-dashboard">
      <div className="faculty-sidebar">
        <div className="faculty-portal-title">
          <h1>{isAdmin ? 'Admin Portal' : 'Faculty Portal'}</h1>
        </div>

        <div className="faculty-profile-brief">
          <div className="faculty-avatar">
            <span>{facultyData.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="faculty-info">
            <div className="faculty-name">{facultyData.name}</div>
            <div className="faculty-dept">{facultyData.department}</div>
          </div>
        </div>

        <nav className="faculty-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'updateCredits' ? 'active' : ''}`}
            onClick={() => setActiveTab('updateCredits')}
          >
            <span className="nav-icon">✏️</span>
            <span className="nav-text">Update Credits</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'creditHistory' ? 'active' : ''}`}
            onClick={() => setActiveTab('creditHistory')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Credit History</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'courseManagement' ? 'active' : ''}`}
            onClick={() => setActiveTab('courseManagement')}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">Course Management</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Attendance Management</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <span className="nav-icon">🔔</span>
            <span className="nav-text">Notifications</span>
          </button>
        </nav>

        <div className="faculty-sidebar-footer">
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">My Profile</span>
          </button>
        </div>
      </div>

      <div className="faculty-main">
        <div className="faculty-header">
          <h1>{isAdmin ? 'Admin Portal' : 'Faculty Portal'}</h1>
          <div className="faculty-header-actions">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
            </button>
            <div className="faculty-avatar header-avatar">
              <span>{facultyData.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="faculty-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
