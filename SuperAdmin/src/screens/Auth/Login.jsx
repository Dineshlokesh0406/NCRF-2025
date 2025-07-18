import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
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
      const response = await axios.post(`${url}/api/superadmin/login`, {
        email,
        password
      });

      if (response.data.success) {
        // Store user data and token in localStorage
        localStorage.setItem('superAdminToken', response.data.token);
        localStorage.setItem('superAdminUser', JSON.stringify(response.data.user));

        // Call the onLogin function to update auth state
        onLogin(response.data.user);

        // Redirect to the dashboard
        navigate('/');
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
                  Important Information for SuperAdmin
                </div>
              </div>
              <ol className="notice-list">
                <li>You have full access to manage faculty accounts</li>
                <li>You can create and manage student data</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Remember to log out when you're done</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="ncrf-login-right">
          <div className="ncrf-login-form-container">
            <h3>SuperAdmin Login</h3>
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
