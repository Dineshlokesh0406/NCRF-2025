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
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Faculty',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChars: false
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password requirements in real-time
    if (name === 'password') {
      const requirements = {
        minLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumbers: /[0-9]/.test(value),
        hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
      };

      setPasswordRequirements(requirements);
      setShowPasswordRequirements(value.length > 0);

      // Hide requirements when all are met
      if (Object.values(requirements).every(req => req === true)) {
        setTimeout(() => setShowPasswordRequirements(false), 1000);
      }
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

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChars) return 'Password must contain at least one special character';

    return null; // Password is valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate email format (@sit.ac.in)
    if (!formData.email.endsWith('@sit.ac.in')) {
      setError('Email must be in the format: username@sit.ac.in');
      setLoading(false);
      return;
    }

    // Validate password complexity
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        if (key !== 'confirmPassword') { // Don't send confirmPassword to server
          data.append(key, formData[key]);
        }
      }

      console.log('Form values being sent:', formData);

      const response = await axios.post(`${url}/api/user/register`, data);
      console.log('Server response:', response.data);

      if (response.data.success) {
        setSuccess('Admin added successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'Faculty',
          photo: null
        });
        setPhotoPreview(null);

        // Navigate after a short delay
        setTimeout(() => {
          navigate('/list');
        }, 1500);
      }
    } catch (error) {
      console.log('Error:', error);
      setError(error.response?.data?.message || 'Error adding admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-container">
      <h2>Add New Admin</h2>
      <form onSubmit={handleSubmit} className="add-form">
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
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
            <label htmlFor="email">Email (@sit.ac.in)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="username@sit.ac.in"
              pattern=".+@sit\.ac\.in$"
              title="Email must be in the format: username@sit.ac.in"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setShowPasswordRequirements(true)}
              required
              disabled={loading}
              minLength="8"
              title="Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters"
            />
            {showPasswordRequirements && (
              <div className="password-requirements">
                <p className="requirements-title">Password must contain:</p>
                <ul>
                  <li className={passwordRequirements.minLength ? 'met' : 'not-met'}>
                    At least 8 characters
                  </li>
                  <li className={passwordRequirements.hasUpperCase ? 'met' : 'not-met'}>
                    At least one uppercase letter
                  </li>
                  <li className={passwordRequirements.hasLowerCase ? 'met' : 'not-met'}>
                    At least one lowercase letter
                  </li>
                  <li className={passwordRequirements.hasNumbers ? 'met' : 'not-met'}>
                    At least one number
                  </li>
                  <li className={passwordRequirements.hasSpecialChars ? 'met' : 'not-met'}>
                    At least one special character
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
              minLength="8"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <div className="static-field">Faculty</div>
            <input
              type="hidden"
              id="role"
              name="role"
              value="Faculty"
            />
          </div>
          <div className="form-group photo-upload">
            <label htmlFor="photo">Profile Photo</label>
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
          {loading ? 'Adding...' : 'Add Admin'}
        </button>
      </form>
    </div>
  );
};

export default Add;
