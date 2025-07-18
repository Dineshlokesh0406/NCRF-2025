import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';
import AcademicDashboard from './AcademicDashboard';
import CourseHistory from './CourseHistory';
import SemesterDetails from './SemesterDetails';

const Profile = () => {
  const { student, url, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
  };

  if (!student) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;

    // Make sure we don't add double slashes
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const imagePath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;

    return `${baseUrl}${imagePath}`;
  };

  const getCurrentAcademicYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0-based month

    // Academic year typically starts in July/August
    if (month >= 7) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  const photoUrl = getImageUrl(student.photo);
  console.log('Student photo path:', student.photo);
  console.log('Constructed photo URL:', photoUrl);

  return (
    <div className={`profile-container ${isDarkTheme ? 'dark-theme' : ''}`}>
      <div className="navbar-container">
        <div className="main-navbar">
          <div className="navbar-left">
            <span className="institution-text">SIT, Tumakuru - 572103</span>
          </div>
          <div className="navbar-links">
            <span className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>OVERVIEW</span>
            <span className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>COURSES</span>
            <span className={`nav-link ${activeTab === 'semesters' ? 'active' : ''}`} onClick={() => setActiveTab('semesters')}>SEMESTERS</span>
            <span className="nav-link" onClick={handleLogout}>LOGOUT</span>
          </div>
        </div>
      </div>

      <div className="profile-main-content">
        <div className="profile-header">
          <div className="profile-header-left">
            <h2>{student.name.toUpperCase()}</h2>
          </div>
          <div className="profile-header-right">
            <div className="usn-display">{student.usn}</div>
          </div>
          <div className="profile-photo">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={student.name}
                onError={(e) => {
                  console.error('Image failed to load:', photoUrl);
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="profile-photo-placeholder">${student.name[0].toUpperCase()}</div>`;
                }}
                onLoad={() => console.log('Image loaded successfully')}
              />
            ) : (
              <div className="profile-photo-placeholder">
                {student.name ? student.name[0].toUpperCase() : 'S'}
              </div>
            )}
          </div>
        </div>

        <div className="profile-subheader">
          <p>{student.department}, SEM {student.semester}, SEC A</p>
          <button className="theme-switch-btn" onClick={toggleTheme}>
            {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
          </button>
          <p className="last-updated">Last Updated On: {student.updatedAt ? formatDate(student.updatedAt) : 'Not available'}</p>
        </div>

        {activeTab === 'overview' && (
          <div className="profile-content">
            <div className="info-boxes-container">
              <div className="info-box">
                <div className="info-box-title">Student Details</div>
                <div className="info-box-content">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{student.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">USN:</span>
                    <span className="detail-value">{student.usn}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact No:</span>
                    <span className="detail-value">{student.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-box">
                <div className="chart-header">
                  <div className="chart-title-bar">
                    <h3 className="chart-title">Academic Progress</h3>
                  </div>
                </div>
                <div className="chart-content">
                  <div className="credits-display">
                    <div className="credits-circle">
                      <div className="credits-number">{student.credits || 0}</div>
                      <div className="credits-label">Credits Completed</div>
                    </div>
                    <div className="credits-info">
                      <div className="credits-max">Maximum Credits: 80</div>
                      <div className="credits-note">(Post Graduation Limit)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-box">
                <div className="chart-header">
                  <div className="chart-title-bar">
                    <h3 className="chart-title">Attendance</h3>
                  </div>
                </div>
                <div className="chart-content attendance-chart">
                  <div className="attendance-display">
                    <div className="attendance-percentage">
                      <span className="percentage-value">83%</span>
                    </div>
                    <div className="attendance-label">Overall Attendance</div>
                    <div className="attendance-status">
                      <span className="status-badge">ABOVE 80%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-footer">
              <p>© Powered By Contineo</p>
              <div className="footer-links">
                <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <CourseHistory student={student} />
        )}

        {activeTab === 'semesters' && (
          <SemesterDetails student={student} />
        )}
      </div>
    </div>
  );
};

export default Profile;
