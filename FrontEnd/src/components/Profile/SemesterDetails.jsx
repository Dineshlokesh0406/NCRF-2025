import React, { useState, useEffect } from 'react';
import './SemesterDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, faBook, faCalendarAlt, faChalkboardTeacher, 
  faClipboardList, faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';

const SemesterDetails = ({ student }) => {
  const [activeSemester, setActiveSemester] = useState(null);
  const [expandedSemesters, setExpandedSemesters] = useState({});
  
  // Get the maximum semester a student can have based on their program
  const getMaxSemesters = () => {
    const department = student?.department || '';
    // Default to 4 semesters for most programs, adjust as needed
    if (department.includes('MCA')) return 4;
    if (department.includes('M.Tech') || department.includes('MBA')) return 4;
    return 8; // Default for B.Tech/B.E. programs
  };
  
  // Generate semester data
  const generateSemesters = () => {
    const maxSemesters = getMaxSemesters();
    const currentSemester = student?.semester || 1;
    
    // Create an array of semester objects
    return Array.from({ length: maxSemesters }, (_, i) => {
      const semesterNumber = i + 1;
      const status = semesterNumber < currentSemester ? 'Completed' : 
                    semesterNumber === currentSemester ? 'Current' : 'Upcoming';
      
      // Filter courses for this semester
      const semesterCourses = (student?.courses || []).filter(
        course => course.semester === semesterNumber
      );
      
      return {
        number: semesterNumber,
        status,
        courses: semesterCourses,
        totalCredits: semesterCourses.reduce((sum, course) => sum + (course.credits || 0), 0),
        completedCredits: semesterCourses
          .filter(course => course.status === 'Completed')
          .reduce((sum, course) => sum + (course.credits || 0), 0),
        totalCourses: semesterCourses.length,
        completedCourses: semesterCourses.filter(course => course.status === 'Completed').length
      };
    });
  };
  
  const [semesters, setSemesters] = useState([]);
  
  useEffect(() => {
    if (student) {
      const generatedSemesters = generateSemesters();
      setSemesters(generatedSemesters);
      
      // Set the current semester as active by default
      const currentSemIndex = generatedSemesters.findIndex(sem => sem.status === 'Current');
      if (currentSemIndex >= 0) {
        setActiveSemester(generatedSemesters[currentSemIndex].number);
        // Expand the current semester by default
        setExpandedSemesters(prev => ({
          ...prev,
          [generatedSemesters[currentSemIndex].number]: true
        }));
      } else if (generatedSemesters.length > 0) {
        setActiveSemester(generatedSemesters[0].number);
      }
    }
  }, [student]);
  
  const toggleSemesterExpand = (semesterNumber) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [semesterNumber]: !prev[semesterNumber]
    }));
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'status-completed';
      case 'Current': return 'status-current';
      case 'Upcoming': return 'status-upcoming';
      default: return '';
    }
  };
  
  const getCourseStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'course-completed';
      case 'In Progress': return 'course-progress';
      case 'Upcoming': return 'course-upcoming';
      default: return '';
    }
  };
  
  return (
    <div className="semester-details-section">
      <h3 className="section-title">Semester Details</h3>
      
      <div className="semester-cards">
        {semesters.map((semester) => (
          <div 
            key={semester.number}
            className={`semester-card ${getStatusClass(semester.status)}`}
          >
            <div 
              className="semester-header"
              onClick={() => toggleSemesterExpand(semester.number)}
            >
              <div className="semester-title">
                <FontAwesomeIcon icon={faGraduationCap} className="semester-icon" />
                <h4>Semester {semester.number}</h4>
                <span className={`semester-status ${getStatusClass(semester.status)}`}>
                  {semester.status}
                </span>
              </div>
              <div className="semester-summary">
                <div className="summary-item">
                  <FontAwesomeIcon icon={faBook} className="summary-icon" />
                  <span>{semester.totalCourses} Courses</span>
                </div>
                <div className="summary-item">
                  <FontAwesomeIcon icon={faClipboardList} className="summary-icon" />
                  <span>{semester.totalCredits} Credits</span>
                </div>
              </div>
              <FontAwesomeIcon 
                icon={expandedSemesters[semester.number] ? faChevronUp : faChevronDown} 
                className="expand-icon"
              />
            </div>
            
            {expandedSemesters[semester.number] && (
              <div className="semester-details">
                <div className="semester-progress">
                  <div className="progress-label">
                    <span>Completion</span>
                    <span>
                      {semester.completedCourses}/{semester.totalCourses} Courses
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar"
                      style={{ 
                        width: `${semester.totalCourses ? (semester.completedCourses / semester.totalCourses) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="semester-courses">
                  <h5 className="courses-title">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="courses-icon" />
                    Courses
                  </h5>
                  
                  {semester.courses.length > 0 ? (
                    <div className="courses-list">
                      {semester.courses.map((course, index) => (
                        <div 
                          key={index} 
                          className={`course-item ${getCourseStatusClass(course.status)}`}
                        >
                          <div className="course-header">
                            <div className="course-code">{course.courseId}</div>
                            <div className="course-status">{course.status}</div>
                          </div>
                          <div className="course-name">{course.courseName}</div>
                          <div className="course-details">
                            <span className="course-credits">{course.credits} Credits</span>
                            {course.grade && course.grade !== 'Pending' && (
                              <span className="course-grade">Grade: {course.grade}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-courses-message">
                      <p>No courses available for this semester</p>
                    </div>
                  )}
                </div>
                
                <div className="semester-stats">
                  <div className="stat-item">
                    <div className="stat-label">Total Credits</div>
                    <div className="stat-value">{semester.totalCredits}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Completed Credits</div>
                    <div className="stat-value">{semester.completedCredits}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Completion</div>
                    <div className="stat-value">
                      {semester.totalCredits ? 
                        `${Math.round((semester.completedCredits / semester.totalCredits) * 100)}%` : 
                        '0%'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {semesters.length === 0 && (
        <div className="no-semesters-message">
          <FontAwesomeIcon icon={faCalendarAlt} className="empty-icon" />
          <p>No semester data available</p>
        </div>
      )}
    </div>
  );
};

export default SemesterDetails;
