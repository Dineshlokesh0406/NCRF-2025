import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Add.css';

const Add = ({ url }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    dateOfBirth: '',
    department: 'MCA',
    semester: '1',
    credits: '0',
    academicYear: new Date().getFullYear().toString(),
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'usn') {
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
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
          department: 'MCA',
          semester: '1',
          credits: '0',
          academicYear: new Date().getFullYear().toString(),
          photo: null
        });
        setPhotoPreview(null);
        
        // Navigate after a short delay
        setTimeout(() => {
          navigate('/update');
        }, 1500);
      }
    } catch (error) {
      console.log(' Error:', error);
      setError(error.response?.data?.message || 'Error adding student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-container">
      <h2>Add New Student</h2>
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
            />
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
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              disabled
            />
          </div>
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
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="credits">Initial Credits</label>
            <input
              type="number"
              id="credits"
              name="credits"
              value={formData.credits}
              onChange={handleInputChange}
              required
              min="0"
              disabled
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="academicYear">Academic Year</label>
            <input
              type="text"
              id="academicYear"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleInputChange}
              required
              disabled={loading}
              pattern="[0-9]{4}"
              title="Please enter a valid year (e.g., 2024)"
            />
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
        </div>

        <button 
          type="submit" 
          className={`add-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default Add;