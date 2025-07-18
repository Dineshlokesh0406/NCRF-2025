import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ url, onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/login`, {
        email,
        password
      });

      if (response.data.success) {
        // Store user data and token in localStorage
        localStorage.setItem('facultyToken', response.data.token);
        localStorage.setItem('facultyUser', JSON.stringify(response.data.user));

        // Call the onLogin function to update auth state
        onLogin(response.data.user);

        // Redirect to the credits page
        navigate('/credits');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="ncrf-login-container">
        <div className="ncrf-login-left">
          <div className="ncrf-header">
            <div className="ncrf-logo-container">
              <div className="ncrf-logo">NCRF</div>
              <div className="ncrf-title">
                <h1>National Credit Framework</h1>
              </div>
            </div>
            <div className="ncrf-welcome">
              <h3>Welcome to NCRF</h3>
            </div>
          </div>

          <div className="ncrf-notice-board">
            <h2>Notice Board</h2>
            <div className="ncrf-divider"></div>
            <div className="ncrf-notice-content">
              <div className="notice-item">
                <div className="notice-icon-container">
                  <span className="notice-icon">ⓘ</span>
                </div>
                <div className="notice-text">
                  Important Information for Faculty
                </div>
              </div>
              <ol className="notice-list">
                <li>Please use your email to login to your account</li>
                <li>Your password is set by the SuperAdmin</li>
                <li>For any login issues, please contact the administrator</li>
                <li>Keep your login credentials confidential and secure</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="ncrf-login-right">
          <div className="ncrf-login-form-container">
            <h3>Faculty Login</h3>
            <form onSubmit={handleSubmit} className="ncrf-login-form">
              <div className="ncrf-form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <span className="input-icon">✉</span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="ncrf-form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              {error && <div className="ncrf-error-message">{error}</div>}
              <div className="ncrf-form-actions">
                <a href="#" className="ncrf-forgot-password">Forgot Password?</a>
                <button type="submit" className="ncrf-login-button">
                  {loading ? 'SIGNING IN...' : 'LOGIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
