import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StudentEnrollment.css';

const StudentEnrollment = ({ url, onClose, selectedSemester }) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [enrollmentMode, setEnrollmentMode] = useState('bulk'); // 'bulk' or 'individual'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [selectedSemester]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Fetch students for the selected semester
      const response = await axios.get(`${url}/api/students?semester=${selectedSemester}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });

      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/courses?semester=${selectedSemester}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });

      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const handleStudentSelection = (usn) => {
    setSelectedStudents(prev => {
      if (prev.includes(usn)) {
        return prev.filter(id => id !== usn);
      } else {
        return [...prev, usn];
      }
    });
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.usn));
    }
  };

  const handleSelectAllCourses = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map(course => course.courseId));
    }
  };

  const handleBulkEnrollment = async () => {
    if (selectedCourses.length === 0) {
      toast.warning('Please select at least one course');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/api/student-courses/bulk-enroll`,
        {
          semester: selectedSemester,
          courseIds: selectedCourses
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
          }
        }
      );

      if (response.data.success) {
        toast.success(`Successfully enrolled ${response.data.results.length} students in courses`);
        onClose();
      }
    } catch (error) {
      console.error('Error in bulk enrollment:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll students');
    } finally {
      setLoading(false);
    }
  };

  const handleIndividualEnrollment = async () => {
    if (selectedCourses.length === 0) {
      toast.warning('Please select at least one course');
      return;
    }

    if (selectedStudents.length === 0) {
      toast.warning('Please select at least one student');
      return;
    }

    try {
      setLoading(true);
      const results = [];

      for (const usn of selectedStudents) {
        for (const courseId of selectedCourses) {
          try {
            await axios.post(
              `${url}/api/student-courses/${usn}/enroll`,
              { courseId },
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
                }
              }
            );
            results.push({ usn, courseId, status: 'success' });
          } catch (error) {
            results.push({ usn, courseId, status: 'failed', error: error.response?.data?.message });
          }
        }
      }

      const successCount = results.filter(r => r.status === 'success').length;
      if (successCount > 0) {
        toast.success(`Successfully enrolled ${successCount} course enrollments`);
        onClose();
      } else {
        toast.error('No successful enrollments');
      }
    } catch (error) {
      console.error('Error in individual enrollment:', error);
      toast.error('Failed to enroll students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = searchTerm
    ? students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.usn.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : students;

  return (
    <div className="enrollment-container">
      <div className="enrollment-header">
        <h2>Enroll Students in Courses</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="enrollment-tabs">
        <button
          className={`tab-btn ${enrollmentMode === 'bulk' ? 'active' : ''}`}
          onClick={() => setEnrollmentMode('bulk')}
        >
          Bulk Enrollment
        </button>
        <button
          className={`tab-btn ${enrollmentMode === 'individual' ? 'active' : ''}`}
          onClick={() => setEnrollmentMode('individual')}
        >
          Individual Enrollment
        </button>
      </div>

      <div className="enrollment-content">
        {enrollmentMode === 'bulk' ? (
          <div className="bulk-enrollment">
            <p className="enrollment-description">
              Enroll all students in semester {selectedSemester} to the selected courses.
            </p>

            <div className="course-selection">
              <div className="selection-header">
                <h3>Available Courses</h3>
                <button
                  className="select-all-btn"
                  onClick={handleSelectAllCourses}
                >
                  {selectedCourses.length === courses.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {loading ? (
                <div className="loading-message">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="no-data-message">No courses available for this semester</div>
              ) : (
                <div className="course-list">
                  {courses.map(course => (
                    <div
                      key={course._id}
                      className={`course-item ${selectedCourses.includes(course.courseId) ? 'selected' : ''}`}
                      onClick={() => handleCourseSelection(course.courseId)}
                    >
                      <div className="checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.courseId)}
                          onChange={() => {}}
                        />
                      </div>
                      <div className="course-details">
                        <div className="course-name">{course.courseName}</div>
                        <div className="course-info">
                          <span className="course-id">{course.courseId}</span>
                          <span className="course-credits">{course.credits} Credits</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="enrollment-actions">
              <button
                className="cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="enroll-btn"
                onClick={handleBulkEnrollment}
                disabled={loading || selectedCourses.length === 0}
              >
                {loading ? 'Enrolling...' : 'Enroll All Students'}
              </button>
            </div>
          </div>
        ) : (
          <div className="individual-enrollment">
            <div className="enrollment-grid">
              <div className="student-selection">
                <div className="selection-header">
                  <h3>Select Students</h3>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>

                <div className="selection-subheader">
                  <span>{selectedStudents.length} of {filteredStudents.length} selected</span>
                  <button
                    className="select-all-btn"
                    onClick={handleSelectAllStudents}
                  >
                    {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {loading ? (
                  <div className="loading-message">Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                  <div className="no-data-message">No students found</div>
                ) : (
                  <div className="student-list">
                    {filteredStudents.map(student => (
                      <div
                        key={student._id}
                        className={`student-item ${selectedStudents.includes(student.usn) ? 'selected' : ''}`}
                        onClick={() => handleStudentSelection(student.usn)}
                      >
                        <div className="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.usn)}
                            onChange={() => {}}
                          />
                        </div>
                        <div className="student-details">
                          <div className="student-name">{student.name}</div>
                          <div className="student-usn">{student.usn}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="course-selection">
                <div className="selection-header">
                  <h3>Select Courses</h3>
                  <button
                    className="select-all-btn"
                    onClick={handleSelectAllCourses}
                  >
                    {selectedCourses.length === courses.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {loading ? (
                  <div className="loading-message">Loading courses...</div>
                ) : courses.length === 0 ? (
                  <div className="no-data-message">No courses available</div>
                ) : (
                  <div className="course-list">
                    {courses.map(course => (
                      <div
                        key={course._id}
                        className={`course-item ${selectedCourses.includes(course.courseId) ? 'selected' : ''}`}
                        onClick={() => handleCourseSelection(course.courseId)}
                      >
                        <div className="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedCourses.includes(course.courseId)}
                            onChange={() => {}}
                          />
                        </div>
                        <div className="course-details">
                          <div className="course-name">{course.courseName}</div>
                          <div className="course-info">
                            <span className="course-id">{course.courseId}</span>
                            <span className="course-credits">{course.credits} Credits</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="enrollment-actions">
              <button
                className="cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="enroll-btn"
                onClick={handleIndividualEnrollment}
                disabled={loading || selectedCourses.length === 0 || selectedStudents.length === 0}
              >
                {loading ? 'Enrolling...' : 'Enroll Selected Students'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollment;
