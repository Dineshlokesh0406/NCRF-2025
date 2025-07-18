import React from 'react';
import './AcademicDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBook, faTrophy, faChartLine } from '@fortawesome/free-solid-svg-icons';

const AcademicDashboard = ({ student }) => {
  // Calculate percentage of credits completed
  const maxCredits = 80; // Post Graduation Limit
  const creditsPercentage = Math.min((student?.credits || 0) / maxCredits * 100, 100);
  
  // Mock data for demonstration - would be replaced with real data from API
  const academicData = {
    gpa: student?.gpa || 8.5,
    attendance: student?.attendance || 85,
    activitiesCompleted: student?.activitiesCompleted || 12,
    skillsAcquired: student?.skillsAcquired || ['Programming', 'Data Analysis', 'Web Development']
  };

  // Calculate GPA color based on value
  const getGpaColor = (gpa) => {
    if (gpa >= 9) return '#2ecc71'; // Green for excellent
    if (gpa >= 7.5) return '#3498db'; // Blue for good
    if (gpa >= 6) return '#f39c12'; // Orange for average
    return '#e74c3c'; // Red for below average
  };

  // Calculate attendance color based on percentage
  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return '#2ecc71'; // Green for excellent
    if (attendance >= 75) return '#3498db'; // Blue for good
    if (attendance >= 65) return '#f39c12'; // Orange for average
    return '#e74c3c'; // Red for below average
  };

  return (
    <div className="academic-dashboard">
      <h3 className="dashboard-title">Academic Dashboard</h3>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="card-content">
            <h4>Current GPA</h4>
            <div className="metric-value" style={{ color: getGpaColor(academicData.gpa) }}>
              {academicData.gpa.toFixed(1)}
            </div>
            <div className="metric-scale">
              <div className="scale-bar">
                <div 
                  className="scale-fill" 
                  style={{ 
                    width: `${(academicData.gpa / 10) * 100}%`,
                    backgroundColor: getGpaColor(academicData.gpa)
                  }}
                ></div>
              </div>
              <div className="scale-labels">
                <span>0</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faBook} />
          </div>
          <div className="card-content">
            <h4>Attendance</h4>
            <div className="metric-value" style={{ color: getAttendanceColor(academicData.attendance) }}>
              {academicData.attendance}%
            </div>
            <div className="metric-scale">
              <div className="scale-bar">
                <div 
                  className="scale-fill" 
                  style={{ 
                    width: `${academicData.attendance}%`,
                    backgroundColor: getAttendanceColor(academicData.attendance)
                  }}
                ></div>
              </div>
              <div className="scale-labels">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <div className="card-content">
            <h4>Activities</h4>
            <div className="metric-value">
              {academicData.activitiesCompleted}
            </div>
            <p className="metric-description">Extracurricular activities completed</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="card-content">
            <h4>Credits Progress</h4>
            <div className="metric-value">
              {student?.credits || 0}/{maxCredits}
            </div>
            <div className="metric-scale">
              <div className="scale-bar">
                <div 
                  className="scale-fill" 
                  style={{ 
                    width: `${creditsPercentage}%`,
                    backgroundColor: creditsPercentage > 90 ? '#2ecc71' : '#3498db'
                  }}
                ></div>
              </div>
              <div className="scale-labels">
                <span>0</span>
                <span>{maxCredits}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="skills-section">
        <h4>Skills Acquired</h4>
        <div className="skills-list">
          {academicData.skillsAcquired.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicDashboard;
