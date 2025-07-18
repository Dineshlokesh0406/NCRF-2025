import React, { useState, useEffect } from 'react';
import './CourseHistory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const CourseHistory = ({ student }) => {
  // Get actual course data from student object
  const studentCourses = student?.courses || [];

  // Map student courses to the format needed for display
  const formattedCourses = studentCourses.map(course => ({
    id: course.courseId,
    name: course.courseName,
    semester: course.semester,
    credits: course.credits,
    grade: course.grade || 'Pending',
    status: course.status,
    date: course.enrollmentDate
  }));

  // Initialize state variables
  const [courses, setCourses] = useState(formattedCourses);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState(student?.semester || 0);

  // Update courses when student data changes
  useEffect(() => {
    if (student?.courses) {
      const updatedCourses = student.courses.map(course => ({
        id: course.courseId,
        name: course.courseName,
        semester: course.semester,
        credits: course.credits,
        grade: course.grade || 'Pending',
        status: course.status,
        date: course.enrollmentDate
      }));
      setCourses(updatedCourses);
    }
  }, [student]);

  // Set initial semester when component mounts or student changes
  useEffect(() => {
    if (student?.semester && selectedSemester === 0) {
      setSelectedSemester(student.semester);
    }
  }, [student, selectedSemester]);

  // Add click handler to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('status-dropdown');
      const button = document.querySelector('.filter-button');

      if (dropdown && button && !dropdown.contains(event.target) && !button.contains(event.target)) {
        dropdown.classList.remove('show');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCourses = [...courses].sort((a, b) => {
      if (a[key] < b[key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setCourses(sortedCourses);
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FontAwesomeIcon icon={faSort} className="sort-icon" />;
    }
    return sortConfig.direction === 'ascending'
      ? <FontAwesomeIcon icon={faSortUp} className="sort-icon active" />
      : <FontAwesomeIcon icon={faSortDown} className="sort-icon active" />;
  };

  // Filter courses based on search term, status filter, and selected semester
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || course.status === filterStatus;
    const matchesSemester = course.semester === selectedSemester; // Show courses for selected semester
    return matchesSearch && matchesFilter && matchesSemester;
  });

  // Get status class for styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-progress';
      case 'Upcoming': return 'status-upcoming';
      default: return '';
    }
  };

  return (
    <div className="course-history">
      <div className="course-header">
        <h3 className="section-title">Course Enrollment History</h3>
        <div className="semester-controls">
          <div className="semester-selector">
            <label htmlFor="semester-select">Select Semester:</label>
            <select
              id="semester-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              className="semester-select"
            >
              <option value={1}>Semester 1 {student.semester === 1 ? '(Current)' : ''}</option>
              <option value={2}>Semester 2 {student.semester === 2 ? '(Current)' : ''}</option>
              <option value={3}>Semester 3 {student.semester === 3 ? '(Current)' : ''}</option>
              <option value={4}>Semester 4 {student.semester === 4 ? '(Current)' : ''}</option>
            </select>
          </div>
          {selectedSemester !== student.semester && (
            <button
              className="current-semester-btn"
              onClick={() => setSelectedSemester(student.semester)}
              title="Switch to your current semester"
            >
              Show Current Semester
            </button>
          )}
        </div>
      </div>

      <div className="course-filters">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by course name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <FontAwesomeIcon icon={faFilter} className="filter-icon" />
          <div className="custom-select">
            <button
              className="filter-button"
              onClick={() => document.getElementById('status-dropdown').classList.toggle('show')}
            >
              {filterStatus === 'All' ? 'All Statuses' : filterStatus}
              <FontAwesomeIcon icon={faSortDown} className="dropdown-icon" />
            </button>
            <div id="status-dropdown" className="dropdown-content">
              <div
                className={`dropdown-item ${filterStatus === 'All' ? 'active' : ''}`}
                onClick={() => {
                  setFilterStatus('All');
                  document.getElementById('status-dropdown').classList.remove('show');
                }}
              >
                All Statuses
              </div>
              <div
                className={`dropdown-item ${filterStatus === 'Completed' ? 'active' : ''}`}
                onClick={() => {
                  setFilterStatus('Completed');
                  document.getElementById('status-dropdown').classList.remove('show');
                }}
              >
                Completed
              </div>
              <div
                className={`dropdown-item ${filterStatus === 'In Progress' ? 'active' : ''}`}
                onClick={() => {
                  setFilterStatus('In Progress');
                  document.getElementById('status-dropdown').classList.remove('show');
                }}
              >
                In Progress
              </div>
              <div
                className={`dropdown-item ${filterStatus === 'Upcoming' ? 'active' : ''}`}
                onClick={() => {
                  setFilterStatus('Upcoming');
                  document.getElementById('status-dropdown').classList.remove('show');
                }}
              >
                Upcoming
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="semester-indicator">
        <span className="semester-badge">Viewing Semester {selectedSemester}</span>
        {selectedSemester === student.semester && (
          <span className="current-indicator">Current Semester</span>
        )}
      </div>

      <div className="course-table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('id')}>
                Course Code {getSortIcon('id')}
              </th>
              <th onClick={() => requestSort('name')}>
                Course Name {getSortIcon('name')}
              </th>
              <th onClick={() => requestSort('semester')}>
                Semester {getSortIcon('semester')}
              </th>
              <th onClick={() => requestSort('credits')}>
                Credits {getSortIcon('credits')}
              </th>
              <th onClick={() => requestSort('grade')}>
                Grade {getSortIcon('grade')}
              </th>
              <th onClick={() => requestSort('status')}>
                Status {getSortIcon('status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <tr key={index}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>{course.semester}</td>
                  <td>{course.credits}</td>
                  <td>{course.grade}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(course.status)}`}>
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-courses">
                  <div className="no-courses-message">
                    <span className="no-courses-icon">📚</span>
                    <p>No courses found for Semester {selectedSemester}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="course-summary">
        <div className="summary-item">
          <span className="summary-label">Total Courses</span>
          <span className="summary-value">{filteredCourses.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Completed Courses</span>
          <span className="summary-value">{filteredCourses.filter(c => c.status === 'Completed').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">In Progress</span>
          <span className="summary-value">{filteredCourses.filter(c => c.status === 'In Progress').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Credits Earned</span>
          <span className="summary-value">
            {filteredCourses.filter(c => c.status === 'Completed').reduce((sum, course) => sum + course.credits, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseHistory;
