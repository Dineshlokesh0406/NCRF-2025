import React, { useState, useEffect } from 'react';
import './Update.css';

const Update = ({ url }) => {
  const [adminList, setAdminList] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
    password: '',
    confirmPassword: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdminList();
  }, []);

  const fetchAdminList = async () => {
    try {
      const response = await fetch(`${url}/api/user/admins`);
      const data = await response.json();
      if (response.ok) {
        setAdminList(data);
      }
    } catch (error) {
      console.error('Error fetching admin list:', error);
    }
  };

  const handleAdminSelect = async (e) => {
    const email = e.target.value;
    setSelectedAdmin(email);
    setShowForm(false);
    setMessage('');

    if (email) {
      try {
        const response = await fetch(`${url}/api/user/${email}`);
        const data = await response.json();
        if (response.ok) {
          setFormData({
            name: data.name,
            email: data.email,
            role: data.role || 'admin',
            password: '',
            confirmPassword: ''
          });
          setPhotoPreview(data.photo ? `${url}${data.photo}` : null);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'admin',
        password: '',
        confirmPassword: ''
      });
      setPhotoPreview(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate email format (@sit.ac.in)
    if (!formData.email.endsWith('@sit.ac.in')) {
      setMessage({ type: 'error', text: 'Email must be in the format: username@sit.ac.in' });
      setLoading(false);
      return;
    }

    // Validate password match if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        if (key !== 'confirmPassword' && (key !== 'password' || formData[key])) {
          data.append(key, formData[key]);
        }
      }

      const response = await fetch(`${url}/api/user/${selectedAdmin}`, {
        method: 'PUT',
        body: data
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Admin updated successfully!' });
        fetchAdminList();
      } else {
        setMessage({ type: 'error', text: result.message || 'Error updating admin' });
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      setMessage({ type: 'error', text: 'Error updating admin' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/api/user/${selectedAdmin}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Admin deleted successfully!' });
        setSelectedAdmin('');
        setShowForm(false);
        fetchAdminList();
      } else {
        setMessage({ type: 'error', text: result.message || 'Error deleting admin' });
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      setMessage({ type: 'error', text: 'Error deleting admin' });
    } finally {
      setLoading(false);
      setDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(false);
  };

  return (
    <div className="update-container">
      <h2>Update Admin</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="select-container">
        <label htmlFor="admin-select">Select Admin:</label>
        <select
          id="admin-select"
          value={selectedAdmin}
          onChange={handleAdminSelect}
          disabled={loading}
        >
          <option value="">-- Select Admin --</option>
          {adminList.map(admin => (
            <option key={admin.email} value={admin.email}>
              {admin.name} ({admin.email})
            </option>
          ))}
        </select>
      </div>

      {selectedAdmin && (
        <div className="action-buttons">
          <button
            type="button"
            className="update-button"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            Update Admin
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={handleDeleteClick}
            disabled={loading}
          >
            Delete Admin
          </button>
        </div>
      )}

      {showForm && selectedAdmin && (
        <form onSubmit={handleUpdateSubmit} className="update-form">
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
                disabled={true}
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
                disabled={true}
                pattern=".+@sit\.ac\.in$"
                title="Email must be in the format: username@sit.ac.in"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">New Password (leave blank to keep current)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                minLength="8"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
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
              <label htmlFor="photo">Profile Photo (leave blank to keep current)</label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handlePhotoChange}
                accept="image/jpeg,image/jpg,image/png"
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
            className={`update-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Admin'}
          </button>
        </form>
      )}

      {deleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this admin?</p>
            <div className="delete-confirm-buttons">
              <button
                onClick={handleDeleteConfirm}
                className="delete-confirm-yes"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={handleDeleteCancel}
                className="delete-confirm-no"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Update;
