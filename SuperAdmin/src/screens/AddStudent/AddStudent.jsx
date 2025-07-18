import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddStudent.css';

const AddStudent = ({ url }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate current academic year (e.g., 2023-2025)
  const currentYear = new Date().getFullYear();
  const defaultAcademicYear = `${currentYear}-${currentYear + 2}`;

  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    dateOfBirth: '',
    department: 'MCA', // Fixed as MCA
    semester: '1', // Fixed as 1st semester
    credits: '0',
    academicYear: defaultAcademicYear, // Fixed as current academic year
    photo: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [usnList, setUsnList] = useState([]);
  const [checkingUsn, setCheckingUsn] = useState(false);
  const [usnError, setUsnError] = useState('');

  useEffect(() => {
    // Fetch existing USNs
    fetchUsnList();
  }, []);

  const fetchUsnList = async () => {
    try {
      const response = await fetch(`${url}/api/students/usn-list`);
      const data = await response.json();

      if (response.ok) {
        setUsnList(data);
      } else {
        console.error('Failed to fetch USN list:', data);
      }
    } catch (error) {
      console.error('Error fetching USN list:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Don't allow changing semester or academicYear
    if (name === 'semester' || name === 'academicYear') {
      return;
    }

    if (name === 'usn') {
      const upperCaseValue = value.toUpperCase();
      setFormData(prev => ({
        ...prev,
        [name]: upperCaseValue
      }));

      // Check if USN already exists
      if (upperCaseValue.length >= 5) {
        checkUsnExists(upperCaseValue);
      } else {
        setUsnError('');
      }
    } else if (name === 'credits') {
      // For credits, enforce the 80 credit limit
      const numValue = parseInt(value) || 0;
      const boundedValue = Math.min(Math.max(0, numValue), 80);

      if (numValue > 80) {
        // Alert the user if they try to enter more than 80 credits
        alert('Maximum allowed credits is 80');
      }

      setFormData(prev => ({
        ...prev,
        [name]: boundedValue.toString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const checkUsnExists = async (usn) => {
    // Skip empty USN
    if (!usn) {
      setUsnError('');
      return;
    }

    // Check against local list first for immediate feedback
    if (usnList.includes(usn)) {
      setUsnError('This USN already exists in the database');
      return;
    }

    // If not in local list, check with server (in case list is outdated)
    setCheckingUsn(true);
    try {
      const response = await fetch(`${url}/api/students/${usn}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setUsnError('This USN already exists in the database');
      } else {
        setUsnError('');
      }
    } catch (error) {
      // If error is 404, it means USN doesn't exist, which is good
      if (error.response && error.response.status === 404) {
        setUsnError('');
      } else {
        console.error('Error checking USN:', error);
      }
    } finally {
      setCheckingUsn(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Only JPG, JPEG, and PNG files are allowed');
        return;
      }
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if USN already exists
    if (usnError) {
      setError(usnError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Final check for USN existence before submission
      const usnExists = await checkUsnExistsBeforeSubmit(formData.usn);
      if (usnExists) {
        setError('This USN already exists in the database');
        setLoading(false);
        return;
      }

      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      console.log('Form values being sent:', formData);

      const response = await axios.post(`${url}/api/students`, data);
      console.log('Server response:', response.data);

      if (response.data.success) {
        setSuccess('Student added successfully!');
        // Reset form
        setFormData({
          name: '',
          usn: '',
          dateOfBirth: '',
          department: 'MCA', // Fixed as MCA
          semester: '1', // Fixed as 1st semester
          credits: '0',
          academicYear: defaultAcademicYear, // Fixed as current academic year
          photo: null
        });
        setPhotoPreview(null);
        setUsnError('');

        // Update USN list
        fetchUsnList();

        // Navigate after a short delay
        setTimeout(() => {
          navigate('/update-student');
        }, 1500);
      }
    } catch (error) {
      console.log('Error:', error);
      if (error.response?.data?.message?.includes('duplicate')) {
        setError('This USN already exists in the database');
      } else {
        setError(error.response?.data?.message || 'Error adding student');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkUsnExistsBeforeSubmit = async (usn) => {
    try {
      const response = await fetch(`${url}/api/students/${usn}`);
      const data = await response.json();

      return response.ok && data.success;
    } catch (error) {
      // If error is 404, it means USN doesn't exist
      if (error.response && error.response.status === 404) {
        return false;
      }
      // For any other error, assume USN might exist to be safe
      return true;
    }
  };

  return (
    <div className="add-container">
      <h2>Add New MCA Student</h2>
      <form onSubmit={handleSubmit} className="add-form">
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="usn">USN</label>
            <div className="usn-input-container">
              <input
                type="text"
                id="usn"
                name="usn"
                value={formData.usn}
                onChange={handleInputChange}
                required
                disabled={loading}
                pattern="^[0-9][A-Za-z]{2}[0-9]{2}[A-Za-z]{2}[0-9]{3}$"
                title="Please enter a valid USN (e.g., 1SI23MC001)"
                className={usnError ? 'error-input' : ''}
              />
              {checkingUsn && <div className="usn-checking">Checking...</div>}
              {usnError && <div className="usn-error">{usnError}</div>}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="semester">Semester</label>
            <input
              type="text"
              id="semester"
              name="semester"
              value="1st Semester"
              disabled
              className="fixed-input"
            />
            <small className="form-hint">Fixed to 1st semester for new students</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="academicYear">Batch Year</label>
            <input
              type="text"
              id="academicYear"
              name="academicYear"
              value={defaultAcademicYear}
              disabled
              className="fixed-input"
            />
            <small className="form-hint">Fixed to current batch year</small>
          </div>
          <div className="form-group">
            <label htmlFor="credits">Initial Credits (Max: 80)</label>
            <input
              type="number"
              id="credits"
              name="credits"
              value={formData.credits}
              onChange={handleInputChange}
              required
              min="0"
              max="80"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group photo-upload">
          <label htmlFor="photo">Photo</label>
          <input
            type="file"
            id="photo"
            name="photo"
            onChange={handlePhotoChange}
            accept="image/jpeg,image/jpg,image/png"
            required
            disabled={loading}
          />
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`add-button ${loading ? 'loading' : ''}`}
          disabled={loading || usnError}
        >
          {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
