import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPopUp.css';
import { StoreContext } from '../../context/StoreContext';

const LoginPopUp = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const [usn, setUsn] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const { url, setToken, fetchStudentProfile } = useContext(StoreContext);

  // Generate options for day, month, and year dropdowns
  const generateDayOptions = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(
        <option key={i} value={i < 10 ? `0${i}` : `${i}`}>
          {i < 10 ? `0${i}` : i}
        </option>
      );
    }
    return days;
  };

  const generateMonthOptions = () => {
    const monthNames = [
      { value: '01', name: 'Jan' },
      { value: '02', name: 'Feb' },
      { value: '03', name: 'Mar' },
      { value: '04', name: 'Apr' },
      { value: '05', name: 'May' },
      { value: '06', name: 'Jun' },
      { value: '07', name: 'Jul' },
      { value: '08', name: 'Aug' },
      { value: '09', name: 'Sep' },
      { value: '10', name: 'Oct' },
      { value: '11', name: 'Nov' },
      { value: '12', name: 'Dec' }
    ];

    return monthNames.map(month => (
      <option key={month.value} value={month.value}>
        {month.name}
      </option>
    ));
  };

  const generateYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 30; i <= currentYear; i++) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return years;
  };

  const formatDate = () => {
    if (!day || !month || !year) return '';
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const dateOfBirth = formatDate();
      if (!dateOfBirth) {
        setError('Please select a valid date of birth');
        return;
      }

      const requestData = {
        usn,
        dateOfBirth
      };

      const response = await fetch(`${url}/api/student-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem('token', token);
        setToken(token);
        await fetchStudentProfile();
        setShowLogin(false);
        navigate('/profile');
      } else {
        setError(data.message || 'Invalid USN or Date of Birth');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleClose = () => {
    // Close the login popup by setting showLogin to false
    setShowLogin(false);
  };

  return (
    <div className="login-overlay">
      <div className="close-button" onClick={handleClose}>×</div>
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
                  Important Information for Students
                </div>
              </div>
              <ol className="notice-list">
                <li>Please use your USN number to login to your account</li>
                <li>Your password is your date of birth in DD-MM-YYYY format</li>
                <li>For any login issues, please contact your department coordinator</li>
                <li>Keep your login credentials confidential and secure</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="ncrf-login-right">
          <div className="ncrf-login-form-container">
            <h3>Login to Your Account</h3>
            <form onSubmit={handleSubmit} className="ncrf-login-form">
              <div className="ncrf-form-group">
                <label htmlFor="usn">Username</label>
                <div className="input-with-icon">
                  <span className="input-icon">✉</span>
                  <input
                    type="text"
                    id="usn"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value.toUpperCase())}
                    placeholder="USN"
                    required
                  />
                </div>
              </div>
              <div className="ncrf-form-group">
                <label htmlFor="password">Password</label>
                <div className="ncrf-dob-container">
                  <div className="custom-select">
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="ncrf-dob-select"
                      required
                    >
                      <option value="">Day</option>
                      {generateDayOptions()}
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                  <div className="custom-select">
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="ncrf-dob-select"
                      required
                    >
                      <option value="">Month</option>
                      {generateMonthOptions()}
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                  <div className="custom-select">
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="ncrf-dob-select"
                      required
                    >
                      <option value="">Year</option>
                      {generateYearOptions()}
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
              </div>
              {error && <div className="ncrf-error-message">{error}</div>}
              <div className="ncrf-form-actions">
                <a href="#" className="ncrf-forgot-password">Forgot Password?</a>
                <button type="submit" className="ncrf-login-button">LOGIN</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopUp;
