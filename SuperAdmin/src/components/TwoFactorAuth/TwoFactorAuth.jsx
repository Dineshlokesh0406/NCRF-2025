import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './TwoFactorAuth.css';

const TwoFactorAuth = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    enabled: false,
    setupMode: false
  });
  const [setupData, setSetupData] = useState({
    secret: '',
    qrCode: '',
    backupCodes: []
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('superAdminToken');
      const response = await axios.get(`${url}/api/superadmin/2fa/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setStatus({
          ...status,
          enabled: response.data.enabled,
          backupCodes: response.data.backupCodes || []
        });
      }
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
      toast.error('Failed to fetch 2FA status');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('superAdminToken');
      const response = await axios.post(`${url}/api/superadmin/2fa/setup`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSetupData({
          secret: response.data.secret,
          qrCode: response.data.qrCode,
          backupCodes: response.data.backupCodes
        });
        setStatus({ ...status, setupMode: true });
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      toast.error('Failed to set up 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('superAdminToken');
      const response = await axios.post(`${url}/api/superadmin/2fa/verify`, {
        token: verificationCode
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.verified) {
        toast.success('Verification successful');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying 2FA code:', error);
      toast.error('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('superAdminToken');
      const response = await axios.post(`${url}/api/superadmin/2fa/enable`, {
        token: verificationCode
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Two-factor authentication enabled successfully');
        setStatus({ enabled: true, setupMode: false });
        setVerificationCode('');
        // Save backup codes before clearing setup data
        const savedBackupCodes = [...setupData.backupCodes];
        setSetupData({ secret: '', qrCode: '', backupCodes: [] });
        setStatus({ enabled: true, setupMode: false, backupCodes: savedBackupCodes });
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error(error.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!verificationCode || !password) {
      toast.error('Please enter both verification code and password');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('superAdminToken');
      const response = await axios.post(`${url}/api/superadmin/2fa/disable`, {
        token: verificationCode,
        password
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Two-factor authentication disabled successfully');
        setStatus({ enabled: false, setupMode: false });
        setVerificationCode('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error(error.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStatus({ ...status, setupMode: false });
    setSetupData({ secret: '', qrCode: '', backupCodes: [] });
    setVerificationCode('');
  };

  const downloadBackupCodes = () => {
    const codes = status.backupCodes || setupData.backupCodes;
    if (!codes || codes.length === 0) {
      toast.error('No backup codes available');
      return;
    }

    const content = `NCRF SuperAdmin 2FA Backup Codes\n\nKeep these codes in a safe place. Each code can only be used once.\n\n${codes.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ncrf-2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="twofa-container">
      <h2>Two-Factor Authentication</h2>
      <p className="twofa-description">
        Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
      </p>

      {loading ? (
        <div className="twofa-loading">
          <div className="twofa-spinner"></div>
          <p>Loading...</p>
        </div>
      ) : status.enabled ? (
        <div className="twofa-status enabled">
          <div className="status-icon">✅</div>
          <div className="status-info">
            <h3>Two-Factor Authentication is Enabled</h3>
            <p>Your account is protected with an additional layer of security.</p>
            
            <div className="twofa-actions">
              <button 
                className="secondary-button"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
              >
                {showBackupCodes ? 'Hide Backup Codes' : 'View Backup Codes'}
              </button>
              
              <button 
                className="danger-button"
                onClick={() => setStatus({ ...status, setupMode: 'disable' })}
              >
                Disable 2FA
              </button>
            </div>

            {showBackupCodes && (
              <div className="backup-codes-container">
                <h4>Backup Codes</h4>
                <p>Use these codes to log in if you don't have access to your authenticator app. Each code can only be used once.</p>
                <div className="backup-codes-list">
                  {status.backupCodes && status.backupCodes.length > 0 ? (
                    status.backupCodes.map((code, index) => (
                      <div key={index} className="backup-code">{code}</div>
                    ))
                  ) : (
                    <p>No backup codes available</p>
                  )}
                </div>
                <button 
                  className="secondary-button"
                  onClick={downloadBackupCodes}
                >
                  Download Backup Codes
                </button>
              </div>
            )}

            {status.setupMode === 'disable' && (
              <div className="twofa-form">
                <h4>Disable Two-Factor Authentication</h4>
                <p>To disable 2FA, please enter your password and a verification code from your authenticator app.</p>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="verificationCode">Verification Code</label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter the 6-digit code"
                    maxLength={6}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    className="cancel-button"
                    onClick={() => setStatus({ ...status, setupMode: false })}
                  >
                    Cancel
                  </button>
                  <button 
                    className="danger-button"
                    onClick={handleDisable}
                    disabled={loading}
                  >
                    {loading ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : status.setupMode ? (
        <div className="twofa-setup">
          <h3>Set Up Two-Factor Authentication</h3>
          
          <div className="setup-steps">
            <div className="setup-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Install an Authenticator App</h4>
                <p>Download and install an authenticator app on your mobile device:</p>
                <ul>
                  <li>Google Authenticator</li>
                  <li>Microsoft Authenticator</li>
                  <li>Authy</li>
                </ul>
              </div>
            </div>
            
            <div className="setup-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Scan the QR Code</h4>
                <p>Open your authenticator app and scan this QR code:</p>
                <div className="qr-code">
                  <img src={setupData.qrCode} alt="QR Code for 2FA" />
                </div>
                <p className="manual-entry">
                  If you can't scan the QR code, enter this code manually: <br />
                  <span className="secret-key">{setupData.secret}</span>
                </p>
              </div>
            </div>
            
            <div className="setup-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Verify Setup</h4>
                <p>Enter the 6-digit verification code from your authenticator app:</p>
                <div className="verification-input">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                  <button 
                    className="primary-button"
                    onClick={handleEnable}
                    disabled={loading || !verificationCode}
                  >
                    {loading ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="setup-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Save Backup Codes</h4>
                <p>Save these backup codes in a secure place. You can use them to log in if you lose access to your authenticator app.</p>
                <div className="backup-codes">
                  {setupData.backupCodes.map((code, index) => (
                    <div key={index} className="backup-code">{code}</div>
                  ))}
                </div>
                <button 
                  className="secondary-button"
                  onClick={downloadBackupCodes}
                >
                  Download Backup Codes
                </button>
              </div>
            </div>
          </div>
          
          <div className="setup-actions">
            <button 
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel Setup
            </button>
          </div>
        </div>
      ) : (
        <div className="twofa-status disabled">
          <div className="status-icon">⚠️</div>
          <div className="status-info">
            <h3>Two-Factor Authentication is Disabled</h3>
            <p>Your account is currently not protected with two-factor authentication.</p>
            <button 
              className="primary-button"
              onClick={handleSetup}
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Set Up 2FA'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuth;
