import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const ResetPassword = ({ url }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChars: false
  });

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${url}/api/superadmin/reset-password/${token}`);
        if (!response.data.success) {
          setTokenValid(false);
          setMessage('Invalid or expired reset token. Please request a new password reset.');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
        setMessage('Invalid or expired reset token. Please request a new password reset.');
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      setMessage('Reset token is missing. Please request a new password reset.');
    }
  }, [token, url]);

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
      setMessage('Please ensure all password requirements are met');
      setIsSuccess(false);
      return false;
    }
    
    if (!passwordsMatch) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/superadmin/reset-password/${token}`, {
        password: formData.password
      });

      if (response.data.success) {
        setIsSuccess(true);
        setMessage('Password has been reset successfully!');
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setIsSuccess(false);
        setMessage(response.data.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setIsSuccess(false);
      setMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Reset Password</h2>
          </div>
          <div className="message-box error">{message}</div>
          <div className="auth-footer">
            <p>
              <Link to="/forgot-password" className="auth-link">Request New Reset Link</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Create a new password for your account</p>
        </div>

        {message && (
          <div className={`message-box ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              disabled={loading || isSuccess}
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
              disabled={loading || isSuccess}
            />
          </div>

          <button
            type="submit"
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading || isSuccess}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/login" className="auth-link">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
