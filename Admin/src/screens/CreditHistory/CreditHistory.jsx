import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './CreditHistory.css';

const CreditHistory = ({ url }) => {
  const { user } = useAuth();
  const [usnList, setUsnList] = useState([]);
  const [selectedUsn, setSelectedUsn] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [creditHistory, setCreditHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Removed date range state

  useEffect(() => {
    fetchUsnList();
  }, []);

  const fetchUsnList = async () => {
    try {
      // Get the faculty token for authentication
      const token = localStorage.getItem('facultyToken');

      const response = await fetch(`${url}/api/students/usn-list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
    setError('');
    setCreditHistory([]);
    setStudentData(null);

    if (usn) {
      try {
        setLoading(true);
        // Get the faculty token for authentication
        const token = localStorage.getItem('facultyToken');

        // Fetch student data
        const studentResponse = await fetch(`${url}/api/students/${usn}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const responseData = await studentResponse.json();
        console.log('Student data response:', responseData); // Debug log

        if (studentResponse.ok) {
          // The API returns data in a nested 'data' property
          const studentInfo = responseData.data || responseData.student || responseData;
          console.log('Extracted student info:', studentInfo);
          setStudentData(studentInfo);

          // Fetch credit history
          const historyResponse = await fetch(`${url}/api/students/${usn}/credit-history`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const historyData = await historyResponse.json();
          console.log('Credit history response:', historyData); // Debug log

          if (historyResponse.ok) {
            // Check different possible response structures
            const historyEntries = historyData.data || historyData.history || historyData || [];
            setCreditHistory(Array.isArray(historyEntries) ? historyEntries : []);
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to fetch student data');
        setError('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    }
  };

  // Removed date range handler

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Removed filtering function

  // No mock data - we'll only show real credit history from the API

  // Use credit history directly without filtering
  const filteredHistory = creditHistory;

  return (
    <div className="credit-history-container">
      <h2>Student Credit History</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="select-container">
        <label htmlFor="usn-select">Select Student USN:</label>
        <select
          id="usn-select"
          value={selectedUsn}
          onChange={handleUsnSelect}
          disabled={loading}
        >
          <option value="">-- Select USN --</option>
          {usnList.map(usn => (
            <option key={usn} value={usn}>
              {usn}
            </option>
          ))}
        </select>
      </div>

      {studentData && (
        <div className="student-info">
          <div className="student-photo">
            {studentData.photo ? (
              <img src={`${url}/${studentData.photo}`} alt={studentData.name || 'Student'} />
            ) : (
              <div className="no-photo">No Photo</div>
            )}
          </div>
          <div className="student-details">
            <h3>{studentData.name || 'Student Name'}</h3>
            <p><strong>USN:</strong> {studentData.usn || selectedUsn}</p>
            <p><strong>Department:</strong> {studentData.department || 'Not specified'}</p>
            <p><strong>Semester:</strong> {studentData.semester || 'Not specified'}</p>
            <p><strong>Academic Year:</strong> {studentData.academicYear || 'Not specified'}</p>
            <p><strong>Current Credits:</strong> <span className="current-credits">{studentData.credits || 0}</span></p>
          </div>
        </div>
      )}

      {/* Removed filtering options */}

      {selectedUsn && (
        <div className="history-section">
          <h3>Credit Update History</h3>
          {loading ? (
            <div className="loading-message">Loading history...</div>
          ) : filteredHistory.length === 0 ? (
            <div className="no-data-message">
              No credit history available. Credit history will appear after credits are updated.
            </div>
          ) : (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Previous Credits</th>
                    <th>New Credits</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((entry, index) => (
                    <tr key={entry.id || index}>
                      <td>{formatDate(entry.timestamp)}</td>
                      <td>{entry.previousCredits}</td>
                      <td>{entry.newCredits}</td>
                      <td className={getChangeClass(entry.newCredits - entry.previousCredits)}>
                        {getChangeSymbol(entry.newCredits - entry.previousCredits)}
                        {Math.abs(entry.newCredits - entry.previousCredits)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper functions
const getChangeSymbol = (change) => {
  if (change > 0) return '+';
  if (change < 0) return '-';
  return '';
};

const getChangeClass = (change) => {
  if (change > 0) return 'positive-change';
  if (change < 0) return 'negative-change';
  return '';
};

export default CreditHistory;
