import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Signup = ({ url, onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChars: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password requirements if the password field is being updated
    if (name === 'password') {
      setPasswordRequirements({
        minLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumbers: /[0-9]/.test(value),
        hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const validateForm = () => {
    // Check if all password requirements are met
    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
    
    // Check if passwords match
    const passwordsMatch = formData.password === formData.confirmPassword;
    
    if (!allRequirementsMet) {
      setError('Please ensure all password requirements are met');
      return false;
    }
    
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/superadmin/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // Store user data and token in localStorage
        localStorage.setItem('superAdminToken', response.data.token);
        localStorage.setItem('superAdminUser', JSON.stringify(response.data.user));
        
        // Set a flag indicating that the SuperAdmin has been created
        localStorage.setItem('superAdminCreated', 'true');

        // Call the onLogin function to update auth state
        onLogin(response.data.user);

        // Redirect to the dashboard
        navigate('/');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <h2>Create SuperAdmin Account</h2>
          <p>This is a one-time setup for the system administrator</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              disabled={loading}
            />
            <div className="password-requirements">
              <p className={passwordRequirements.minLength ? 'met' : ''}>
                At least 8 characters
              </p>
              <p className={passwordRequirements.hasUpperCase ? 'met' : ''}>
                At least one uppercase letter
              </p>
              <p className={passwordRequirements.hasLowerCase ? 'met' : ''}>
                At least one lowercase letter
              </p>
              <p className={passwordRequirements.hasNumbers ? 'met' : ''}>
                At least one number
              </p>
              <p className={passwordRequirements.hasSpecialChars ? 'met' : ''}>
                At least one special character
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>This account will have full system access</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
