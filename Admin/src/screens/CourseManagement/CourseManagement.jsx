import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './CourseManagement.css';

const CourseManagement = ({ url }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    semester: '1',
    credits: '3'
  });

  // Fetch courses on component mount and when semester changes
  useEffect(() => {
    fetchCourses();
  }, [selectedSemester]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      courseId: '',
      courseName: '',
      semester: selectedSemester,
      credits: '3'
    });
    setEditingCourse(null);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const courseData = {
        ...formData,
        semester: parseInt(formData.semester),
        credits: parseInt(formData.credits)
      };

      const response = await axios.post(`${url}/api/courses`, courseData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Course added successfully');
        fetchCourses();
        resetForm();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error(error.response?.data?.message || 'Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const courseData = {
        ...formData,
        semester: parseInt(formData.semester),
        credits: parseInt(formData.credits)
      };

      const response = await axios.put(`${url}/api/courses/${editingCourse._id}`, courseData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Course updated successfully');
        fetchCourses();
        resetForm();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`${url}/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Course deleted successfully');
        fetchCourses();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error.response?.data?.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const startEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      courseId: course.courseId,
      courseName: course.courseName,
      semester: course.semester.toString(),
      credits: course.credits.toString()
    });
    setShowAddForm(true);
  };

  return (
    <div className="course-management">
      <div className="page-header">
        <h1>Course Management</h1>
        <p>Add and manage courses for each semester</p>
      </div>

      <div className="semester-selector">
        <div className="semester-selector-left">
          <label htmlFor="semester-select">Select Semester:</label>
          <select
            id="semester-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
          </select>
        </div>
        <button
          className="add-course-btn"
          onClick={() => {
            resetForm();
            setFormData(prev => ({ ...prev, semester: selectedSemester }));
            setShowAddForm(true);
          }}
        >
          Add New Course
        </button>
      </div>

      {showAddForm && (
        <div className="course-form-container">
          <div className="course-form">
            <div className="form-header">
              <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
              <button className="close-btn" onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}>×</button>
            </div>
            <form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}>
              <div className="form-group">
                <label htmlFor="courseId">Course Code</label>
                <input
                  type="text"
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  placeholder="e.g., CS101"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="courseName">Course Name</label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to Computer Science"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="semester">Semester</label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="credits">Credits</label>
                  <input
                    type="number"
                    id="credits"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="courses-container">
        <div className="courses-header">
          <h2>Courses for Semester {selectedSemester}</h2>
        </div>

        {loading ? (
          <div className="loading-message">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="no-data-message">
            No courses found for this semester. Add a new course to get started.
          </div>
        ) : (
          <div className="courses-table-container">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.courseId}</td>
                    <td>{course.courseName}</td>
                    <td>{course.credits}</td>
                    <td className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => startEditCourse(course)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCourse(course._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


    </div>
  );
};

export default CourseManagement;
