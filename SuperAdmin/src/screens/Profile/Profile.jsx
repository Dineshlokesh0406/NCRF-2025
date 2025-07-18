import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';
import { toast } from 'react-toastify';

const Profile = ({ url }) => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChars: false
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));

      // Set photo preview if user has a photo
      if (user.photo) {
        setPhotoPreview(`${url}${user.photo}`);
      }
    }
  }, [user, url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password requirements if the new password field is being updated
    if (name === 'newPassword') {
      setPasswordRequirements({
        minLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumbers: /[0-9]/.test(value),
        hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePasswordForm = () => {
    // Only validate if we're changing the password
    if (!profileData.newPassword) return true;

    // Check if all password requirements are met
    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);

    // Check if passwords match
    const passwordsMatch = profileData.newPassword === profileData.confirmPassword;

    if (!profileData.currentPassword) {
      toast.error('Current password is required');
      return false;
    }

    if (!allRequirementsMet) {
      toast.error('Please ensure all password requirements are met');
      return false;
    }

    if (!passwordsMatch) {
      toast.error('New passwords do not match');
      return false;
    }

    return true;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Validate form if changing password
    if (activeTab === 'security' && !validatePasswordForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', profileData.name);

      // Only include password fields if we're changing the password
      if (activeTab === 'security' && profileData.newPassword) {
        formData.append('currentPassword', profileData.currentPassword);
        formData.append('newPassword', profileData.newPassword);
      }

      // Add photo if selected
      if (photo) {
        formData.append('photo', photo);
      }

      const token = localStorage.getItem('superAdminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.put(`${url}/api/superadmin/profile`, formData, config);

      if (response.data.success) {
        toast.success('Profile updated successfully');

        // Update the user in context and localStorage
        localStorage.setItem('superAdminUser', JSON.stringify(response.data.user));
        login(response.data.user);

        // Reset password fields
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-profile">
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-info">
          <div className="profile-photo-container">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            <div className="photo-upload-overlay">
              <label htmlFor="photo-upload">
                <i className="fas fa-camera"></i>
                <span>Change Photo</span>
              </label>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="profile-details">
            <h1>{profileData.name || 'Super Admin'}</h1>
            <p className="profile-email">{profileData.email || 'admin@example.com'}</p>
            <div className="profile-badges">
              <span className="badge admin-badge">Administrator</span>
              <span className="badge status-badge">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-navbar">
        <div className="nav-container">
          <button
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Information
          </button>
          <button
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          {/* Removed Activity Log tab */}
        </div>
      </div>

      <div className="profile-content">
        {activeTab === 'personal' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              <p>Update your personal details and profile photo</p>
            </div>

            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={true}
                  className="disabled-input"
                />
                <p className="input-hint">Email address cannot be changed</p>
              </div>

              <div className="form-group">
                <label>Profile Photo</label>
                <div className="photo-preview-container">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile Preview" className="photo-preview" />
                  ) : (
                    <div className="photo-placeholder">No photo selected</div>
                  )}
                  <div className="photo-actions">
                    <label htmlFor="photo-input" className="photo-upload-button">
                      Choose Photo
                    </label>
                    <input
                      type="file"
                      id="photo-input"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                    {photoPreview && (
                      <button
                        type="button"
                        className="photo-remove-button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setPhoto(null);
                        }}
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
                <p className="input-hint">Maximum file size: 2MB. Supported formats: JPG, PNG</p>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className={`save-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Security Settings</h2>
              <p>Manage your password and account security</p>
            </div>

            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  disabled={loading}
                />

                <div className="password-strength">
                  <div className="strength-meter">
                    <div
                      className={`strength-bar ${
                        Object.values(passwordRequirements).filter(Boolean).length >= 4 ? 'strong' :
                        Object.values(passwordRequirements).filter(Boolean).length >= 2 ? 'medium' : 'weak'
                      }`}
                      style={{
                        width: `${(Object.values(passwordRequirements).filter(Boolean).length / 5) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="strength-text">
                    {Object.values(passwordRequirements).filter(Boolean).length >= 4 ? 'Strong' :
                     Object.values(passwordRequirements).filter(Boolean).length >= 2 ? 'Medium' : 'Weak'}
                  </span>
                </div>

                <div className="password-requirements">
                  <div className={`requirement ${passwordRequirements.minLength ? 'met' : ''}`}>
                    <span className="check-icon"></span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`requirement ${passwordRequirements.hasUpperCase ? 'met' : ''}`}>
                    <span className="check-icon"></span>
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`requirement ${passwordRequirements.hasLowerCase ? 'met' : ''}`}>
                    <span className="check-icon"></span>
                    <span>Lowercase letter</span>
                  </div>
                  <div className={`requirement ${passwordRequirements.hasNumbers ? 'met' : ''}`}>
                    <span className="check-icon"></span>
                    <span>Number</span>
                  </div>
                  <div className={`requirement ${passwordRequirements.hasSpecialChars ? 'met' : ''}`}>
                    <span className="check-icon"></span>
                    <span>Special character</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  disabled={loading}
                />

                {profileData.newPassword && profileData.confirmPassword && (
                  <div className={`password-match ${
                    profileData.newPassword === profileData.confirmPassword ? 'matched' : 'not-matched'
                  }`}>
                    {profileData.newPassword === profileData.confirmPassword
                      ? '✓ Passwords match'
                      : '✗ Passwords do not match'}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className={`save-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Removed Activity Log content */}
      </div>
    </div>
  );
};

export default Profile;
