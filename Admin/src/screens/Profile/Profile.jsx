import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Profile.css';

// Icons
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CrossIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Profile = ({ url }) => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);

  // Profile info state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Removed activity state

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        photo: null
      });

      if (user.photo) {
        setPhotoPreview(`${url}${user.photo}`);
      }
    }
  }, [user, url]);

  useEffect(() => {
    validatePassword();
  }, [passwordData]);

  const validatePassword = () => {
    const { newPassword, confirmPassword } = passwordData;

    setPasswordValidation({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
      match: newPassword === confirmPassword && newPassword !== ''
    });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setMessage({ type: 'error', text: 'Only JPG, JPEG, and PNG files are allowed' });
        return;
      }
      setProfileData(prev => ({
        ...prev,
        photo: file
      }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      if (profileData.name !== user.name) {
        formData.append('name', profileData.name);
      }
      if (profileData.photo) {
        formData.append('photo', profileData.photo);
      }

      // Only proceed if there are changes
      if (formData.has('name') || formData.has('photo')) {
        const response = await axios.put(`${url}/api/user/profile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
          }
        });

        if (response.data.success) {
          // Update user in context and localStorage
          const updatedUser = { ...user, ...response.data.user };
          localStorage.setItem('facultyUser', JSON.stringify(updatedUser));
          login(updatedUser);

          toast.success('Profile updated successfully');
        } else {
          toast.error(response.data.message || 'Failed to update profile');
        }
      } else {
        toast.info('No changes to save');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Check if all validations pass
    const allValid = Object.values(passwordValidation).every(value => value);
    if (!allValid) {
      toast.error('Please fix the password issues before submitting');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${url}/api/user/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" />
            ) : user?.photo ? (
              <img src={`${url}${user.photo}`} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'F'}
              </div>
            )}
          </div>
          <label htmlFor="photo" className="avatar-upload-button">
            <CameraIcon />
            <span className="sr-only">Change Photo</span>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handlePhotoChange}
              accept="image/jpeg,image/jpg,image/png"
              className="file-input"
            />
          </label>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.name || 'Faculty'}</h1>
          <p className="profile-role">Faculty</p>
          <p className="profile-department">MCA</p>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <UserIcon />
          <span>Personal Information</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <LockIcon />
          <span>Security</span>
        </button>
        {/* Removed activity tab button */}
      </div>

      <div className="profile-content">
        {activeTab === 'info' && (
          <div className="profile-section">
            <h2 className="section-title">Personal Information</h2>
            <p className="section-description">Update your personal information</p>

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                    disabled={loading}
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    disabled={true}
                    className="disabled-input"
                    placeholder="Your email address"
                  />
                  <small className="input-note">Email cannot be changed</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value="MCA"
                    disabled={true}
                    className="disabled-input"
                    placeholder="Your department"
                  />
                  <small className="input-note">Department is fixed as MCA</small>
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value="Faculty"
                    disabled={true}
                    className="disabled-input"
                    placeholder="Your role"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="profile-section">
            <h2 className="section-title">Security</h2>
            <p className="section-description">Update your password</p>

            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('current')}
                    aria-label={showPassword.current ? "Hide password" : "Show password"}
                  >
                    {showPassword.current ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      disabled={loading}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('new')}
                      aria-label={showPassword.new ? "Hide password" : "Show password"}
                    >
                      {showPassword.new ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      disabled={loading}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('confirm')}
                      aria-label={showPassword.confirm ? "Hide password" : "Show password"}
                    >
                      {showPassword.confirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                  <li className={passwordValidation.length ? 'valid' : 'invalid'}>
                    {passwordValidation.length ? <CheckIcon /> : <CrossIcon />}
                    <span>At least 8 characters</span>
                  </li>
                  <li className={passwordValidation.uppercase ? 'valid' : 'invalid'}>
                    {passwordValidation.uppercase ? <CheckIcon /> : <CrossIcon />}
                    <span>At least one uppercase letter</span>
                  </li>
                  <li className={passwordValidation.lowercase ? 'valid' : 'invalid'}>
                    {passwordValidation.lowercase ? <CheckIcon /> : <CrossIcon />}
                    <span>At least one lowercase letter</span>
                  </li>
                  <li className={passwordValidation.number ? 'valid' : 'invalid'}>
                    {passwordValidation.number ? <CheckIcon /> : <CrossIcon />}
                    <span>At least one number</span>
                  </li>
                  <li className={passwordValidation.special ? 'valid' : 'invalid'}>
                    {passwordValidation.special ? <CheckIcon /> : <CrossIcon />}
                    <span>At least one special character</span>
                  </li>
                  <li className={passwordValidation.match ? 'valid' : 'invalid'}>
                    {passwordValidation.match ? <CheckIcon /> : <CrossIcon />}
                    <span>Passwords match</span>
                  </li>
                </ul>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading || !Object.values(passwordValidation).every(v => v)}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Removed activity tab content */}
      </div>
    </div>
  );
};

export default Profile;
