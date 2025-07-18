import React, { useState, useEffect } from 'react';
import './UpdateStudent.css';

const UpdateStudent = ({ url }) => {
  const [usnList, setUsnList] = useState([]);
  const [selectedUsn, setSelectedUsn] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    dateOfBirth: '',
    department: 'MCA', // Fixed as MCA
    semester: '1',
    credits: '0',
    academicYear: ''
  });
  const [showForm, setShowForm] = useState(''); // 'info' or 'credits' or empty
  const [message, setMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Batch update states
  const [showBatchUpdate, setShowBatchUpdate] = useState(false);
  const [batchYears, setBatchYears] = useState([]);
  const [selectedBatchYear, setSelectedBatchYear] = useState('');
  const [batchStudents, setBatchStudents] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [returnToBatch, setReturnToBatch] = useState(false);

  // Default batch years and dummy data
  const defaultBatchYears = ['2022-2024', '2023-2025', '2024-2026', '2025-2027'];

  // Dummy student data for each batch year (except 2025-2027)
  const dummyStudents = {
    '2022-2024': [
      { name: 'Rahul Kumar', usn: '1SI22MC001', semester: 4, credits: 95, photo: null },
      { name: 'Priya Sharma', usn: '1SI22MC002', semester: 4, credits: 92, photo: null },
      { name: 'Amit Singh', usn: '1SI22MC003', semester: 4, credits: 88, photo: null }
    ],
    '2023-2025': [
      { name: 'Neha Patel', usn: '1SI23MC004', semester: 2, credits: 45, photo: null },
      { name: 'Vikram Reddy', usn: '1SI23MC005', semester: 2, credits: 48, photo: null },
      { name: 'Anjali Gupta', usn: '1SI23MC006', semester: 2, credits: 42, photo: null }
    ],
    '2024-2026': [
      { name: 'Karthik Nair', usn: '1SI24MC007', semester: 1, credits: 18, photo: null },
      { name: 'Meera Joshi', usn: '1SI24MC008', semester: 1, credits: 20, photo: null },
      { name: 'Rajesh Verma', usn: '1SI24MC009', semester: 1, credits: 15, photo: null }
    ]
  };

  useEffect(() => {
    fetchUsnList();
    fetchBatchYears();

    // Set default batch years if none are found after a short delay
    setTimeout(() => {
      if (batchYears.length === 0) {
        setBatchYears(defaultBatchYears);
      }
    }, 1000);
  }, []);

  const fetchUsnList = async () => {
    try {
      const response = await fetch(`${url}/api/students/usn-list`);
      const data = await response.json();

      if (response.ok) {
        // If no students found or very few, add dummy USNs
        if (data.length < 5) {
          let allDummyUsns = [];
          Object.values(dummyStudents).forEach(batch => {
            batch.forEach(student => {
              allDummyUsns.push(student.usn);
            });
          });

          // Combine real and dummy USNs, removing duplicates
          const combinedUsns = [...new Set([...data, ...allDummyUsns])];
          setUsnList(combinedUsns);
        } else {
          setUsnList(data);
        }
      } else {
        console.error('Failed to fetch USN list:', data);

        // Use dummy USNs if API fails
        let allDummyUsns = [];
        Object.values(dummyStudents).forEach(batch => {
          batch.forEach(student => {
            allDummyUsns.push(student.usn);
          });
        });
        setUsnList(allDummyUsns);
      }
    } catch (error) {
      console.error('Error fetching USN list:', error);

      // Use dummy USNs if API fails
      let allDummyUsns = [];
      Object.values(dummyStudents).forEach(batch => {
        batch.forEach(student => {
          allDummyUsns.push(student.usn);
        });
      });
      setUsnList(allDummyUsns);
    }
  };

  const fetchBatchYears = async () => {
    try {
      const response = await fetch(`${url}/api/students`);
      const data = await response.json();

      if (response.ok) {
        const studentData = data.data || [];
        // Extract unique academic years
        const years = [...new Set(studentData.map(student => student.academicYear))].sort();

        // Combine API years with default years, removing duplicates
        const combinedYears = [...new Set([...years, ...defaultBatchYears])].sort();
        setBatchYears(combinedYears);
      } else {
        // Use default batch years if API fails
        setBatchYears(defaultBatchYears);
      }
    } catch (error) {
      console.error('Error fetching batch years:', error);
      // Use default batch years if API fails
      setBatchYears(defaultBatchYears);
    }
  };

  const fetchStudentsByBatch = async (batchYear) => {
    try {
      setLoadingBatch(true);
      const response = await fetch(`${url}/api/students`);
      const data = await response.json();

      if (response.ok) {
        const studentData = data.data || [];
        // Filter students by the selected batch year
        const filteredStudents = studentData.filter(student =>
          student.academicYear === batchYear
        );

        // If no students found for this batch and it's not 2025-2027, use dummy data
        if (filteredStudents.length === 0 && batchYear !== '2025-2027' && dummyStudents[batchYear]) {
          setBatchStudents(dummyStudents[batchYear]);
        } else {
          setBatchStudents(filteredStudents);
        }
      } else {
        // Use dummy data if API fails (except for 2025-2027)
        if (batchYear !== '2025-2027' && dummyStudents[batchYear]) {
          setBatchStudents(dummyStudents[batchYear]);
        } else {
          setBatchStudents([]);
        }
      }
    } catch (error) {
      console.error('Error fetching students by batch:', error);
      // Use dummy data if API fails (except for 2025-2027)
      if (batchYear !== '2025-2027' && dummyStudents[batchYear]) {
        setBatchStudents(dummyStudents[batchYear]);
      } else {
        setBatchStudents([]);
      }
    } finally {
      setLoadingBatch(false);
    }
  };

  const handleUsnSelect = async (e) => {
    const usn = e.target.value;
    setSelectedUsn(usn);
    setShowForm('');
    setMessage('');
    setPhotoPreview(null);
    setShowBatchUpdate(false);
    setReturnToBatch(false);

    if (usn) {
      try {
        setLoading(true);

        // Check if this is a dummy USN
        let isDummy = false;
        let dummyStudent = null;

        Object.values(dummyStudents).forEach(batch => {
          batch.forEach(student => {
            if (student.usn === usn) {
              isDummy = true;
              dummyStudent = student;
            }
          });
        });

        if (isDummy && dummyStudent) {
          // Use dummy data
          const today = new Date();
          const dob = new Date(today);
          dob.setFullYear(today.getFullYear() - 22); // Assume 22 years old

          setFormData({
            name: dummyStudent.name,
            usn: dummyStudent.usn,
            dateOfBirth: dob.toISOString().split('T')[0],
            department: 'MCA',
            semester: dummyStudent.semester.toString(),
            credits: dummyStudent.credits.toString(),
            academicYear: dummyStudent.usn.includes('22') ? '2022-2024' :
                         dummyStudent.usn.includes('23') ? '2023-2025' :
                         dummyStudent.usn.includes('24') ? '2024-2026' : '2025-2027'
          });

          setLoading(false);
        } else {
          // Fetch real data from API
          const response = await fetch(`${url}/api/students/${usn}`);
          const data = await response.json();

          if (response.ok) {
            setFormData({
              name: data.data.name,
              usn: data.data.usn,
              dateOfBirth: new Date(data.data.dateOfBirth).toISOString().split('T')[0],
              department: 'MCA', // Fixed as MCA
              semester: data.data.semester.toString(),
              credits: data.data.credits.toString(),
              academicYear: data.data.academicYear
            });

            if (data.data.photo) {
              setPhotoPreview(`${url}/${data.data.photo}`);
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setLoading(false);
      }
    } else {
      setFormData({
        name: '',
        usn: '',
        dateOfBirth: '',
        department: 'MCA', // Fixed as MCA
        semester: '1',
        credits: '0',
        academicYear: ''
      });
    }
  };

  const handleBatchYearSelect = (e) => {
    const batchYear = e.target.value;
    setSelectedBatchYear(batchYear);

    if (batchYear) {
      fetchStudentsByBatch(batchYear);
    } else {
      setBatchStudents([]);
    }
  };

  const handleBatchUpdateClick = () => {
    setSelectedUsn('');
    setShowForm('');
    setMessage('');
    setShowBatchUpdate(true);
    setReturnToBatch(false);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setMessage('Only JPG, JPEG, and PNG files are allowed');
        return;
      }
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditStudent = (usn) => {
    setSelectedUsn(usn);
    setShowBatchUpdate(false);
    setShowForm('info');
    setReturnToBatch(true);

    // Check if this is a dummy USN
    let isDummy = false;
    let dummyStudent = null;

    Object.values(dummyStudents).forEach(batch => {
      batch.forEach(student => {
        if (student.usn === usn) {
          isDummy = true;
          dummyStudent = student;
        }
      });
    });

    if (isDummy && dummyStudent) {
      // Use dummy data
      const today = new Date();
      const dob = new Date(today);
      dob.setFullYear(today.getFullYear() - 22); // Assume 22 years old

      setFormData({
        name: dummyStudent.name,
        usn: dummyStudent.usn,
        dateOfBirth: dob.toISOString().split('T')[0],
        department: 'MCA',
        semester: dummyStudent.semester.toString(),
        credits: dummyStudent.credits.toString(),
        academicYear: dummyStudent.usn.includes('22') ? '2022-2024' :
                     dummyStudent.usn.includes('23') ? '2023-2025' :
                     dummyStudent.usn.includes('24') ? '2024-2026' : '2025-2027'
      });
    } else {
      // Fetch real student data
      fetchStudentData(usn);
    }
  };

  const handleEditCredits = (usn) => {
    setSelectedUsn(usn);
    setShowBatchUpdate(false);
    setShowForm('credits');
    setReturnToBatch(true);

    // Check if this is a dummy USN
    let isDummy = false;
    let dummyStudent = null;

    Object.values(dummyStudents).forEach(batch => {
      batch.forEach(student => {
        if (student.usn === usn) {
          isDummy = true;
          dummyStudent = student;
        }
      });
    });

    if (isDummy && dummyStudent) {
      // Use dummy data
      const today = new Date();
      const dob = new Date(today);
      dob.setFullYear(today.getFullYear() - 22); // Assume 22 years old

      setFormData({
        name: dummyStudent.name,
        usn: dummyStudent.usn,
        dateOfBirth: dob.toISOString().split('T')[0],
        department: 'MCA',
        semester: dummyStudent.semester.toString(),
        credits: dummyStudent.credits.toString(),
        academicYear: dummyStudent.usn.includes('22') ? '2022-2024' :
                     dummyStudent.usn.includes('23') ? '2023-2025' :
                     dummyStudent.usn.includes('24') ? '2024-2026' : '2025-2027'
      });
    } else {
      // Fetch real student data
      fetchStudentData(usn);
    }
  };

  const fetchStudentData = async (usn) => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/students/${usn}`);
      const data = await response.json();

      if (response.ok) {
        setFormData({
          name: data.data.name,
          usn: data.data.usn,
          dateOfBirth: new Date(data.data.dateOfBirth).toISOString().split('T')[0],
          department: 'MCA', // Fixed as MCA
          semester: data.data.semester.toString(),
          credits: data.data.credits.toString(),
          academicYear: data.data.academicYear
        });

        if (data.data.photo) {
          setPhotoPreview(`${url}/${data.data.photo}`);
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (type) => {
    if (!selectedUsn) {
      setMessage('Please select a USN first');
      return;
    }

    // Check if this is a dummy USN
    let isDummy = false;
    Object.values(dummyStudents).forEach(batch => {
      batch.forEach(student => {
        if (student.usn === selectedUsn) {
          isDummy = true;
        }
      });
    });

    if (isDummy) {
      // Simulate update for dummy data
      setLoading(true);
      setTimeout(() => {
        setMessage(`Student ${type === 'info' ? 'information' : 'credits'} updated successfully`);
        setLoading(false);

        // Update the dummy data in memory
        Object.keys(dummyStudents).forEach(batchYear => {
          dummyStudents[batchYear].forEach(student => {
            if (student.usn === selectedUsn) {
              if (type === 'info') {
                student.name = formData.name;
                student.semester = parseInt(formData.semester);
              } else if (type === 'credits') {
                student.credits = parseInt(formData.credits);
              }
            }
          });
        });

        // If we came from batch mode and need to return there
        if (returnToBatch && selectedBatchYear) {
          setTimeout(() => {
            setShowForm('');
            setShowBatchUpdate(true);
            fetchStudentsByBatch(selectedBatchYear);
          }, 1500);
        } else {
          setShowForm('');
        }
      }, 1000);

      return;
    }

    setLoading(true);
    setMessage('');

    let endpoint = `${url}/api/students/${selectedUsn}`;
    let method = 'PUT';
    let headers = {};
    let body;
    let updateData;

    try {
      if (type === 'info') {
        // If we have a new photo, use FormData
        if (formData.photo) {
          const data = new FormData();
          data.append('name', formData.name);
          data.append('dateOfBirth', formData.dateOfBirth);
          data.append('department', 'MCA'); // Fixed as MCA
          data.append('semester', formData.semester);
          data.append('academicYear', formData.academicYear);
          data.append('photo', formData.photo);

          body = data;
        } else {
          // Otherwise use JSON
          updateData = {
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
            department: 'MCA', // Fixed as MCA
            semester: parseInt(formData.semester),
            academicYear: formData.academicYear
          };

          headers = {
            'Content-Type': 'application/json',
          };
          body = JSON.stringify(updateData);
        }
      } else if (type === 'credits') {
        updateData = {
          credits: parseInt(formData.credits)
        };

        // Use the specific credits endpoint for credit updates
        endpoint = `${url}/api/students/${selectedUsn}/credits`;
        method = 'PATCH';

        headers = {
          'Content-Type': 'application/json',
        };
        body = JSON.stringify(updateData);
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        body,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Student ${type === 'info' ? 'information' : 'credits'} updated successfully`);

        // If we came from batch mode and need to return there
        if (returnToBatch && selectedBatchYear) {
          setTimeout(() => {
            setShowForm('');
            setShowBatchUpdate(true);
            fetchStudentsByBatch(selectedBatchYear);
          }, 1500);
        } else {
          setShowForm('');
        }

        fetchUsnList(); // Refresh the list
      } else {
        setMessage(data.message || 'Error updating student');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error updating student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-container">
      <h2>Update MCA Student</h2>

      <div className="update-mode-selector">
        <button
          className={`mode-button ${!showBatchUpdate ? 'active' : ''}`}
          onClick={() => setShowBatchUpdate(false)}
        >
          Individual Update
        </button>
        <button
          className={`mode-button ${showBatchUpdate ? 'active' : ''}`}
          onClick={handleBatchUpdateClick}
        >
          Batch Update
        </button>
      </div>

      {!showBatchUpdate ? (
        // Individual update mode
        <>
          <div className="select-section">
            <select
              className="usn-select"
              value={selectedUsn}
              onChange={handleUsnSelect}
              disabled={loading}
            >
              <option value="">Select USN</option>
              {usnList.map(usn => (
                <option key={usn} value={usn}>{usn}</option>
              ))}
            </select>
            <button onClick={fetchUsnList} className="refresh-button" disabled={loading}>
              Refresh List
            </button>
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
                disabled={loading}
              >
                Update Student Information
              </button>
              <button
                className="option-button credits"
                onClick={() => setShowForm('credits')}
                disabled={loading}
              >
                Update Student Credits
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value="MCA"
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
                  disabled={loading}
                >
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                </select>
              </div>

              <div className="form-group">
                <label>Academic Year</label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  {defaultBatchYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="form-group photo-upload">
                <label>Photo (leave blank to keep current)</label>
                <input
                  type="file"
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

              <div className="button-group">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => {
                    if (returnToBatch) {
                      setShowBatchUpdate(true);
                      setShowForm('');
                    } else {
                      setShowForm('');
                    }
                  }}
                  disabled={loading}
                >
                  {returnToBatch ? 'Back to Batch View' : 'Back to Options'}
                </button>
                <button
                  type="button"
                  className="update-button"
                  onClick={() => handleUpdate('info')}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Information'}
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
                  disabled={loading}
                />
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => {
                    if (returnToBatch) {
                      setShowBatchUpdate(true);
                      setShowForm('');
                    } else {
                      setShowForm('');
                    }
                  }}
                  disabled={loading}
                >
                  {returnToBatch ? 'Back to Batch View' : 'Back to Options'}
                </button>
                <button
                  type="button"
                  className="update-button"
                  onClick={() => handleUpdate('credits')}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Credits'}
                </button>
              </div>
            </form>
          )}
        </>
      ) : (
        // Batch update mode
        <div className="batch-update-container">
          <div className="batch-filter">
            <label htmlFor="batch-year-select">Select Batch Year:</label>
            <div className="batch-select-container">
              <select
                id="batch-year-select"
                className="batch-year-select"
                value={selectedBatchYear}
                onChange={handleBatchYearSelect}
                disabled={loadingBatch}
              >
                <option value="">Select Batch Year</option>
                {batchYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                className="refresh-button"
                onClick={() => fetchBatchYears()}
                disabled={loadingBatch}
              >
                Refresh Batches
              </button>
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {loadingBatch ? (
            <div className="loading-message">Loading students...</div>
          ) : selectedBatchYear && batchStudents.length === 0 ? (
            <div className="no-students-message">No students found for this batch year.</div>
          ) : selectedBatchYear && batchStudents.length > 0 ? (
            <div className="batch-students-table-container">
              <h3>MCA Students in Batch: {selectedBatchYear}</h3>
              <table className="batch-students-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>USN</th>
                    <th>Semester</th>
                    <th>Credits</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batchStudents.map(student => (
                    <tr key={student.usn}>
                      <td className="student-photo">
                        {student.photo ? (
                          <img src={`${url}/${student.photo}`} alt={student.name} />
                        ) : (
                          <div className="no-photo">No Photo</div>
                        )}
                      </td>
                      <td>{student.name}</td>
                      <td>{student.usn}</td>
                      <td>{student.semester}</td>
                      <td>{student.credits}</td>
                      <td className="action-buttons">
                        <button
                          className="edit-info-button"
                          onClick={() => handleEditStudent(student.usn)}
                          disabled={loading}
                        >
                          Edit Details
                        </button>
                        <button
                          className="edit-credits-button"
                          onClick={() => handleEditCredits(student.usn)}
                          disabled={loading}
                        >
                          Edit Credits
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="select-batch-message">Please select a batch year to view students.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateStudent;
