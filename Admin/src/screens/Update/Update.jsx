import React, { useState, useEffect } from 'react';
import './Update.css';

const Update = ({ url }) => {
  const [usnList, setUsnList] = useState([]);
  const [selectedUsn, setSelectedUsn] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    dateOfBirth: '',
    department: 'MCA',
    semester: '1',
    credits: '0',
    academicYear: ''
  });
  const [showForm, setShowForm] = useState(''); // 'info' or 'credits' or empty
  const [message, setMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchUsnList();
  }, []);

  const fetchUsnList = async () => {
    try {
      const response = await fetch(`${url}/api/students/usn-list`);
      const data = await response.json();
      if (response.ok) {
        setUsnList(data);
      }
    } catch (error) {
      console.error('Error fetching USN list:', error);
    }
  };

  const handleUsnSelect = async (e) => {
    const usn = e.target.value;
    setSelectedUsn(usn);
    setShowForm('');
    setMessage('');

    if (usn) {
      try {
        const response = await fetch(`${url}/api/students/${usn}`);
        const data = await response.json();
        if (response.ok) {
          setFormData({
            name: data.name,
            usn: data.usn,
            dateOfBirth: new Date(data.dateOfBirth).toISOString().split('T')[0],
            department: data.department,
            semester: data.semester.toString(),
            credits: data.credits.toString(),
            academicYear: data.academicYear
          });
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    } else {
      setFormData({
        name: '',
        usn: '',
        dateOfBirth: '',
        department: 'MCA',
        semester: '1',
        credits: '0',
        academicYear: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For credits, enforce the 80 credit limit
    if (name === 'credits') {
      const numValue = parseInt(value) || 0;
      const boundedValue = Math.min(Math.max(0, numValue), 80);

      if (numValue > 80) {
        // Alert the user if they try to enter more than 80 credits
        alert('Maximum allowed credits is 80');
      }

      setFormData(prev => ({
        ...prev,
        [name]: boundedValue.toString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdate = async (type) => {
    if (!selectedUsn) {
      setMessage('Please select a USN first');
      return;
    }

    try {
      let updateData;
      let endpoint = `${url}/api/students/${selectedUsn}`;
      let method = 'PUT';

      if (type === 'info') {
        updateData = {
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          semester: parseInt(formData.semester),
          academicYear: formData.academicYear
        };
      } else if (type === 'credits') {
        updateData = {
          credits: parseInt(formData.credits)
        };
        // Use the specific credits endpoint for credit updates
        endpoint = `${url}/api/students/${selectedUsn}/credits`;
        method = 'PATCH';
      }

      // Get the faculty token for authentication
      const token = localStorage.getItem('facultyToken');

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Student ${type === 'info' ? 'information' : 'credits'} updated successfully`);
        setShowForm('');
      } else {
        setMessage(data.message || 'Error updating student');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error updating student');
    }
  };

  const handleDelete = async () => {
    if (!selectedUsn) {
      setMessage('Please select a USN first');
      return;
    }

    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setMessage('Click delete button again to confirm deletion');
      return;
    }

    try {
      const response = await fetch(`${url}/api/students/${selectedUsn}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        throw new Error("Server didn't return JSON");
      }

      if (data.success) {
        setMessage('Student deleted successfully!');
        setSelectedUsn('');
        setShowForm('');
        setFormData({
          name: '',
          usn: '',
          dateOfBirth: '',
          department: 'MCA',
          semester: '1',
          credits: '0',
          academicYear: ''
        });
        await fetchUsnList();
      } else {
        throw new Error(data.message || 'Error deleting student');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message || 'Error deleting student');
    } finally {
      setDeleteConfirm(false);
    }
  };

  useEffect(() => {
    setDeleteConfirm(false);
  }, [selectedUsn]);

  return (
    <div className="update-container">
      <h2>Update Student</h2>

      <div className="select-section">
        <select
          className="usn-select"
          value={selectedUsn}
          onChange={handleUsnSelect}
        >
          <option value="">Select USN</option>
          {usnList.map(usn => (
            <option key={usn} value={usn}>{usn}</option>
          ))}
        </select>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {selectedUsn && !showForm && (
        <div className="update-options">
          <button
            className="option-button info"
            onClick={() => setShowForm('info')}
          >
            Update Student Information
          </button>
          <button
            className="option-button credits"
            onClick={() => setShowForm('credits')}
          >
            Update Student Credits
          </button>
          <button
            className={`option-button delete ${deleteConfirm ? 'confirm' : ''}`}
            onClick={handleDelete}
          >
            {deleteConfirm ? 'Click again to confirm delete' : 'Delete Student'}
          </button>
        </div>
      )}

      {selectedUsn && showForm === 'info' && (
        <form className="update-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>USN</label>
            <input
              type="text"
              value={formData.usn}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={formData.department}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              required
            >
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
            </select>
          </div>

          <div className="form-group">
            <label>Academic Year</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleInputChange}
              placeholder="e.g., 2024-25"
              required
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="back-button"
              onClick={() => setShowForm('')}
            >
              Back to Options
            </button>
            <button
              type="button"
              className="update-button"
              onClick={() => handleUpdate('info')}
            >
              Update Information
            </button>
          </div>
        </form>
      )}

      {selectedUsn && showForm === 'credits' && (
        <form className="update-form">
          <div className="form-group credits-group">
            <label>Credits (Max: 80)</label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleInputChange}
              min="0"
              max="80"
              required
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="back-button"
              onClick={() => setShowForm('')}
            >
              Back to Options
            </button>
            <button
              type="button"
              className="update-button"
              onClick={() => handleUpdate('credits')}
            >
              Update Credits
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Update;
