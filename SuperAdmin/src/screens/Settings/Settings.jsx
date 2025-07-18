import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import TwoFactorAuth from '../../components/TwoFactorAuth/TwoFactorAuth';
import LoginHistory from '../../components/LoginHistory/LoginHistory';
import './Settings.css';

const Settings = ({ url }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    systemUpdates: true,
    securityAlerts: true,
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    autoLogout: 30
  });

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('superAdminToken');
        const response = await axios.get(`${url}/api/superadmin/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.settings) {
          setSettings(response.data.settings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // If settings don't exist yet, we'll use the defaults
      }
    };

    fetchSettings();
  }, [url]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('superAdminToken');
      const response = await axios.post(`${url}/api/superadmin/settings`, settings, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Settings save error:', error);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your SuperAdmin experience</p>
      </div>

      <div className="settings-content">
        <form onSubmit={handleSaveSettings}>
          <div className="settings-card">
            <h2>Notification Preferences</h2>
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={handleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-info">
                  <h3>Email Notifications</h3>
                  <p>Receive email notifications for important updates</p>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="systemUpdates"
                      checked={settings.systemUpdates}
                      onChange={handleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-info">
                  <h3>System Updates</h3>
                  <p>Get notified about system updates and maintenance</p>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="securityAlerts"
                      checked={settings.securityAlerts}
                      onChange={handleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-info">
                  <h3>Security Alerts</h3>
                  <p>Receive alerts about security-related events</p>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h2>Appearance & Localization</h2>
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Theme</h3>
                  <p>Choose your preferred interface theme</p>
                </div>
                <div className="setting-control">
                  <select
                    name="theme"
                    value={settings.theme}
                    onChange={handleChange}
                    className="settings-select"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Language</h3>
                  <p>Select your preferred language</p>
                </div>
                <div className="setting-control">
                  <select
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    className="settings-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Timezone</h3>
                  <p>Set your local timezone</p>
                </div>
                <div className="setting-control">
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    className="settings-select"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="CST">CST (Central Standard Time)</option>
                    <option value="MST">MST (Mountain Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                    <option value="IST">IST (Indian Standard Time)</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Date Format</h3>
                  <p>Choose how dates are displayed</p>
                </div>
                <div className="setting-control">
                  <select
                    name="dateFormat"
                    value={settings.dateFormat}
                    onChange={handleChange}
                    className="settings-select"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h2>Security Settings</h2>
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Auto Logout</h3>
                  <p>Automatically log out after period of inactivity (minutes)</p>
                </div>
                <div className="setting-control">
                  <select
                    name="autoLogout"
                    value={settings.autoLogout}
                    onChange={handleChange}
                    className="settings-select"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication Section */}
          <TwoFactorAuth url={url} />

          {/* Login History Section */}
          <LoginHistory url={url} />

          <div className="settings-actions">
            <button
              type="submit"
              className={`save-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
