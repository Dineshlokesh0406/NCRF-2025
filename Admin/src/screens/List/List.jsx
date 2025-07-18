import React, { useState, useEffect } from 'react';
import './List.css';

const List = ({ url }) => {
  const [usnList, setUsnList] = useState([]);
  const [selectedUsn, setSelectedUsn] = useState('');
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsnList();
  }, []);

  const fetchUsnList = async () => {
    try {
      setError(null);
      const response = await fetch(`${url}/api/students/usn-list`);
      const data = await response.json();
      if (response.ok) {
        setUsnList(data);
      } else {
        setError('Failed to fetch USN list');
      }
    } catch (error) {
      console.error('Error fetching USN list:', error);
      setError('Failed to fetch USN list');
    }
  };

  const handleUsnSelect = async (e) => {
    const usn = e.target.value;
    setSelectedUsn(usn);
    setError(null);
    setChanges([]);
    
    if (usn) {
      setLoading(true);
      try {
        const response = await fetch(`${url}/api/students/${usn}/changes`);
        if (!response.ok) {
          throw new Error('Failed to fetch changes');
        }
        const data = await response.json();
        setChanges(data || []);
      } catch (error) {
        console.error('Error fetching changes:', error);
        setError(error.message || 'Failed to fetch changes');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  const formatChanges = (change) => {
    if (!change || !change.changes || !change.previousValues) {
      return [];
    }

    const changes = [];
    Object.keys(change.changes).forEach(key => {
      const oldValue = change.previousValues[key];
      const newValue = change.changes[key];
      
      if (key === 'dateOfBirth' && oldValue && newValue) {
        changes.push(`${key}: ${new Date(oldValue).toLocaleDateString()} → ${new Date(newValue).toLocaleDateString()}`);
      } else {
        changes.push(`${key}: ${oldValue} → ${newValue}`);
      }
    });
    return changes;
  };

  return (
    <div className="list-container">
      <h2>Student Change History</h2>

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

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">Loading changes...</div>
      )}

      {!loading && selectedUsn && !error && changes.length === 0 && (
        <div className="no-changes">No changes found for this student.</div>
      )}

      {!loading && !error && changes.length > 0 && (
        <div className="changes-list">
          {changes.map((change, index) => (
            <div key={change._id || index} className="change-item">
              <div className="change-header">
                <span className="change-type">
                  {change.changeType === 'info' ? 'Information Update' : 'Credits Update'}
                </span>
                <span className="change-date">{formatDate(change.createdAt)}</span>
              </div>
              <div className="change-details">
                {formatChanges(change).map((detail, i) => (
                  <div key={i} className="change-detail">{detail}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;