import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Credits.css';

// Credit requirements and limits for MCA
const creditLimits = {
  total: 80, // Changed from 120 to 80 as per requirement
  theory: { max: 40 }, // Adjusted proportionally
  practical: { max: 30 }, // Adjusted proportionally
  experimental: { max: 10 } // Adjusted proportionally
};

const Credits = ({ url }) => {
  const [usnList, setUsnList] = useState([]);
  const [filteredUsnList, setFilteredUsnList] = useState([]);
  const [selectedUsn, setSelectedUsn] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [message, setMessage] = useState('');
  const [creditForm, setCreditForm] = useState({
    theoryCredits: '',
    practicalCredits: '',
    experimentalCredits: ''
  });
  const [totalCredits, setTotalCredits] = useState(0);
  const [result, setResult] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [batchList, setBatchList] = useState([]);

  // Initialize with default batches
  useEffect(() => {
    // Set default batches immediately
    const currentYear = new Date().getFullYear();
    const defaultBatches = [
      `${currentYear-3}-${currentYear-1}`,
      `${currentYear-2}-${currentYear}`,
      `${currentYear-1}-${currentYear+1}`,
      `${currentYear}-${currentYear+2}`
    ];
    setBatchList(defaultBatches);
    // Then fetch actual data
    fetchUsnList();
  }, []);

  const fetchUsnList = async () => {
    setLoadingStudents(true);
    try {
      // Get the faculty token for authentication
      const token = localStorage.getItem('facultyToken');

      // Fetch all students with their details
      const response = await fetch(`${url}/api/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        const students = data.data || [];
        setAllStudents(students);

        // Extract just the USN list for backward compatibility
        const usns = students.map(student => student.usn);
        setUsnList(usns);

        // Get unique batches from academic years
        const batches = [...new Set(students.map(student => student.academicYear))];
        console.log('Available batches:', batches);

        // If we found actual batches, use them
        if (batches.length > 0) {
          setBatchList(batches);
        }
        // Otherwise, we'll keep using the default batches set in the useEffect
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error loading students. Using default batches.');
    } finally {
      setLoadingStudents(false);
    }
  };

  // Calculate total credits from the form values
  const calculateTotalCredits = () => {
    const theory = parseInt(creditForm.theoryCredits) || 0;
    const practical = parseInt(creditForm.practicalCredits) || 0;
    const experimental = parseInt(creditForm.experimentalCredits) || 0;
    return theory + practical + experimental;
  };

  // Reset form when batch changes
  useEffect(() => {
    // Reset selected student when batch changes
    setSelectedUsn('');
    setStudentData(null);
    setCreditForm({
      theoryCredits: '',
      practicalCredits: '',
      experimentalCredits: ''
    });
    setResult(null);
  }, [selectedBatch]);

  // Update total credits whenever form values change
  useEffect(() => {
    const newTotal = calculateTotalCredits();
    setTotalCredits(newTotal);

    if (studentData) {
      setResult({
        totalCredits: newTotal,
        requiredCredits: creditLimits.total,
        completionPercentage: Math.min(100, (newTotal / creditLimits.total) * 100).toFixed(1),
        theory: parseInt(creditForm.theoryCredits) || 0,
        practical: parseInt(creditForm.practicalCredits) || 0,
        experimental: parseInt(creditForm.experimentalCredits) || 0,
        maxTheory: creditLimits.theory.max,
        maxPractical: creditLimits.practical.max,
        maxExperimental: creditLimits.experimental.max
      });
    }
  }, [creditForm, studentData]);

  const handleBatchSelect = (e) => {
    const batch = e.target.value;
    console.log('Selected batch:', batch);
    setSelectedBatch(batch);

    // Manually filter students when batch changes
    if (batch) {
      console.log('Filtering students for batch:', batch);
      const filtered = allStudents.filter(student => student.academicYear === batch);
      console.log('Filtered students:', filtered);
      setFilteredUsnList(filtered);
    } else {
      setFilteredUsnList([]);
    }
  };

  const handleUsnSelect = async (e) => {
    const usn = e.target.value;
    setSelectedUsn(usn);
    setMessage('');

    if (usn) {
      try {
        // Get the faculty token for authentication
        const token = localStorage.getItem('facultyToken');

        const response = await fetch(`${url}/api/students/${usn}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Student data response:', data); // Debug log

        if (response.ok) {
          // The API returns data in a nested 'data' property
          const studentInfo = data.data || data.student || data;
          console.log('Extracted student info:', studentInfo);
          setStudentData(studentInfo);

          // Initialize credit form with existing credit data if available
          if (studentInfo.creditBreakdown) {
            setCreditForm({
              theoryCredits: studentInfo.creditBreakdown.theory || '',
              practicalCredits: studentInfo.creditBreakdown.practical || '',
              experimentalCredits: studentInfo.creditBreakdown.experimental || ''
            });
          } else {
            // If no breakdown exists, reset the form
            setCreditForm({
              theoryCredits: '',
              practicalCredits: '',
              experimentalCredits: ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    } else {
      setStudentData(null);
      setCreditForm({
        theoryCredits: '',
        practicalCredits: '',
        experimentalCredits: ''
      });
      setResult(null);
    }
  };

  const handleCreditInputChange = (e) => {
    const { id, value } = e.target;

    // Get the maximum allowed value based on the field
    let maxValue;
    const fieldType = id.replace('Credits', '');
    maxValue = creditLimits[fieldType].max;

    // Ensure the value is within bounds (0 to maxValue)
    const numValue = parseInt(value) || 0;

    if (numValue > maxValue) {
      // Show toast notification when exceeding max value
      toast.warning(`Maximum allowed ${fieldType} credits for MCA is ${maxValue}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    const boundedValue = Math.min(Math.max(0, numValue), maxValue);

    setCreditForm(prev => ({
      ...prev,
      [id]: boundedValue === 0 ? '' : boundedValue.toString()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Calculate total credits from the form
      const theory = parseInt(creditForm.theoryCredits) || 0;
      const practical = parseInt(creditForm.practicalCredits) || 0;
      const experimental = parseInt(creditForm.experimentalCredits) || 0;
      const total = theory + practical + experimental;

      // Prepare the data to send to the API
      const creditData = {
        credits: total,
        creditBreakdown: {
          theory,
          practical,
          experimental
        }
      };

      // Get the faculty token for authentication
      const token = localStorage.getItem('facultyToken');

      const response = await fetch(`${url}/api/students/${selectedUsn}/credits`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(creditData),
      });

      const data = await response.json();
      console.log('Credit update response:', data);

      if (response.ok) {
        toast.success('Credits updated successfully!');

        // Refresh student data to show updated credits
        const refreshResponse = await fetch(`${url}/api/students/${selectedUsn}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const refreshData = await refreshResponse.json();
        if (refreshResponse.ok) {
          const refreshedStudentInfo = refreshData.data || refreshData.student || refreshData;
          setStudentData(refreshedStudentInfo);

          // Update credit form with the new values
          if (refreshedStudentInfo.creditBreakdown) {
            setCreditForm({
              theoryCredits: refreshedStudentInfo.creditBreakdown.theory || '',
              practicalCredits: refreshedStudentInfo.creditBreakdown.practical || '',
              experimentalCredits: refreshedStudentInfo.creditBreakdown.experimental || ''
            });
          }
        }
      } else {
        toast.error(data.message || 'Error updating credits');
      }
    } catch (error) {
      console.error('Error updating credits:', error);
      toast.error('Error updating credits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="credits-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h2>Update MCA Student Credits</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="filters-container">
        <div className="select-container batch-select-container">
          <label htmlFor="batch-select">Select Batch:</label>
          <select
            id="batch-select"
            value={selectedBatch}
            onChange={handleBatchSelect}
            disabled={loading}
            className="batch-dropdown"
          >
            <option value="">-- Select Batch --</option>
            {batchList.map(batch => (
              <option key={batch} value={batch}>
                Batch {batch}
              </option>
            ))}
          </select>
          {loadingStudents && (
            <div className="loading-indicator">Loading student data...</div>
          )}
        </div>
      </div>

      {selectedBatch && filteredUsnList.length > 0 ? (
        <div className="students-list-container">
          <h3 className="students-list-title">MCA Students in Batch {selectedBatch}</h3>
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>USN</th>
                  <th>Name</th>
                  <th>Semester</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsnList.map(student => (
                  <tr
                    key={student.usn}
                    className={selectedUsn === student.usn ? 'selected-row' : ''}
                  >
                    <td>{student.usn}</td>
                    <td>{student.name}</td>
                    <td>{student.semester}</td>
                    <td>
                      <button
                        className="select-student-btn"
                        onClick={() => handleUsnSelect({ target: { value: student.usn } })}
                      >
                        {selectedUsn === student.usn ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedBatch ? (
        <div className="no-students-message">
          <p>No MCA students found in Batch {selectedBatch}</p>
        </div>
      ) : null}

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
            <p><strong>Department:</strong> MCA</p>
            <p><strong>Semester:</strong> {studentData.semester || 'Not specified'}</p>
            <p><strong>Academic Year:</strong> {studentData.academicYear || 'Not specified'}</p>
            <p><strong>Current Credits:</strong> <span className="current-credits">{studentData.credits || 0}</span></p>
          </div>
        </div>
      )}

      {studentData && (
        <>
          <div className="calculator-container">
            <div className="calculator-header">
              <h3>Credit Calculator for MCA</h3>
              <p className="calculator-description">
                Enter credits for each category based on the MCA requirements.
                The system will enforce maximum limits for each category.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="credits-form calculator-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="theoryCredits">
                    Theory Credits (Max: {result?.maxTheory || creditLimits.theory.max})
                  </label>
                  <input
                    type="number"
                    id="theoryCredits"
                    value={creditForm.theoryCredits}
                    onChange={handleCreditInputChange}
                    min="0"
                    max={creditLimits.theory.max}
                    step="1"
                    placeholder="0"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="practicalCredits">
                    Practical Credits (Max: {result?.maxPractical || creditLimits.practical.max})
                  </label>
                  <input
                    type="number"
                    id="practicalCredits"
                    value={creditForm.practicalCredits}
                    onChange={handleCreditInputChange}
                    min="0"
                    max={creditLimits.practical.max}
                    step="1"
                    placeholder="0"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experimentalCredits">
                    Experimental Credits (Max: {result?.maxExperimental || creditLimits.experimental.max})
                  </label>
                  <input
                    type="number"
                    id="experimentalCredits"
                    value={creditForm.experimentalCredits}
                    onChange={handleCreditInputChange}
                    min="0"
                    max={creditLimits.experimental.max}
                    step="1"
                    placeholder="0"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <button
                  type="submit"
                  className="update-button calculator-submit"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Credits'}
                </button>
              </div>
            </form>

            {result && (
              <div className="calculator-result">
                <h3>Credit Summary</h3>
                <div className="result-grid">
                  <div className="result-item">
                    <p>Total Credits: <span>{result.totalCredits}</span></p>
                  </div>
                  <div className="result-item">
                    <p>Credits Required: <span>{result.requiredCredits}</span></p>
                  </div>
                  <div className="result-item">
                    <p>Completion: <span>{result.completionPercentage}%</span></p>
                  </div>
                </div>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${result.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="info-section">
            <h3>Understanding Credit Categories</h3>
            <div className="info-grid">
              <div className="info-item">
                <h4>Theory Credits</h4>
                <p>Credits earned through classroom learning, lectures, and theoretical understanding of subjects.</p>
              </div>
              <div className="info-item">
                <h4>Practical Credits</h4>
                <p>Credits earned through laboratory work, hands-on exercises, and practical applications.</p>
              </div>
              <div className="info-item">
                <h4>Experimental Credits</h4>
                <p>Credits earned through research projects, field work, and experimental learning activities.</p>
              </div>
            </div>
          </div>

          <div className="info-message">
            <p>Note: Credit history will be available in the Credit History section after updating credits.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Credits;
