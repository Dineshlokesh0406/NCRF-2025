import React, { useState } from 'react';
import './AttendanceManagement.css';

const AttendanceManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [file, setFile] = useState(null);

  // Mock data
  const courses = ['Data Structures', 'Database Management', 'Computer Networks', 'Operating Systems', 'Software Engineering'];
  const sections = ['A', 'B', 'C'];

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage({ text: '', type: '' });
  };

  // Parse CSV file
  const parseCSV = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Check if required columns exist
        const requiredColumns = ['USN', 'Name', 'Status'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          reject(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }
        
        const result = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',').map(value => value.trim());
          const entry = {};
          
          headers.forEach((header, index) => {
            entry[header] = values[index];
          });
          
          result.push(entry);
        }
        
        resolve(result);
      };
      
      reader.onerror = () => {
        reject('Error reading file');
      };
      
      reader.readAsText(file);
    });
  };

  // Handle file upload submission
  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: 'Please select a file to upload', type: 'error' });
      return;
    }
    
    if (!selectedCourse || !selectedSection || !selectedDate) {
      setMessage({ text: 'Please select course, section, and date', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const parsedData = await parseCSV(file);
      
      // Here you would typically send this data to your backend
      // For now, we'll just update the state
      setStudents(parsedData);
      
      // Create attendance data object
      const newAttendanceData = {};
      parsedData.forEach(student => {
        newAttendanceData[student.USN] = {
          name: student.Name,
          status: student.Status || 'Present'
        };
      });
      
      setAttendanceData(newAttendanceData);
      setMessage({ 
        text: `Successfully uploaded attendance data for ${parsedData.length} students`, 
        type: 'success' 
      });
    } catch (error) {
      setMessage({ text: `Error: ${error}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle attendance status change
  const handleStatusChange = (usn, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [usn]: {
        ...prev[usn],
        status
      }
    }));
  };

  // Handle save attendance
  const handleSaveAttendance = () => {
    // Here you would send the attendance data to your backend
    // For now, we'll just show a success message
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ 
        text: 'Attendance data saved successfully', 
        type: 'success' 
      });
    }, 1000);
  };

  // Generate mock student data for demonstration
  const loadStudents = () => {
    if (!selectedCourse || !selectedSection || !selectedDate) {
      setMessage({ text: 'Please select course, section, and date', type: 'error' });
      return;
    }

    setIsLoading(true);
    
    // Mock student data
    const mockStudents = [
      { USN: '1SI20CS001', Name: 'Aditya Sharma' },
      { USN: '1SI20CS002', Name: 'Bhavana Patel' },
      { USN: '1SI20CS003', Name: 'Chetan Kumar' },
      { USN: '1SI20CS004', Name: 'Divya Reddy' },
      { USN: '1SI20CS005', Name: 'Esha Singh' },
      { USN: '1SI20CS006', Name: 'Farhan Ahmed' },
      { USN: '1SI20CS007', Name: 'Gayatri Iyer' },
      { USN: '1SI20CS008', Name: 'Harish Verma' },
    ];
    
    setTimeout(() => {
      setStudents(mockStudents);
      
      // Initialize all students as present
      const newAttendanceData = {};
      mockStudents.forEach(student => {
        newAttendanceData[student.USN] = {
          name: student.Name,
          status: 'Present'
        };
      });
      
      setAttendanceData(newAttendanceData);
      setIsLoading(false);
    }, 800);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="faculty-content-container">
      <div className="faculty-content-header">
        <h2>Attendance Management</h2>
        <p>Upload and manage student attendance records</p>
      </div>
      
      <div className="faculty-card">
        <div className="faculty-card-header">
          <h3>Select Class Details</h3>
        </div>
        <div className="faculty-card-content">
          <div className="faculty-form">
            <div className="form-row">
              <div className="form-group">
                <label>Course:</label>
                <select 
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="faculty-select"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Section:</label>
                <select 
                  value={selectedSection} 
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="faculty-select"
                  disabled={!selectedCourse}
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Date:</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="faculty-input"
                  disabled={!selectedSection}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="faculty-button primary"
                onClick={loadStudents}
                disabled={isLoading || !selectedCourse || !selectedSection || !selectedDate}
              >
                {isLoading ? 'Loading...' : 'Load Students'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="faculty-card">
        <div className="faculty-card-header">
          <h3>Upload Attendance</h3>
        </div>
        <div className="faculty-card-content">
          <p className="upload-info">
            Upload a CSV file with columns: USN, Name, Status (Present/Absent/Late)
          </p>
          
          <div className="file-upload-container">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              id="attendance-file"
              className="file-input"
            />
            <label htmlFor="attendance-file" className="file-label">
              {file ? file.name : 'Choose CSV File'}
            </label>
            <button 
              className="faculty-button primary"
              onClick={handleUpload}
              disabled={isLoading || !file || !selectedCourse || !selectedSection || !selectedDate}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
      
      {students.length > 0 && (
        <div className="faculty-card">
          <div className="faculty-card-header">
            <h3>Attendance Record</h3>
            <div className="attendance-info">
              <span><strong>Course:</strong> {selectedCourse}</span>
              <span><strong>Section:</strong> {selectedSection}</span>
              <span><strong>Date:</strong> {formatDate(selectedDate)}</span>
            </div>
          </div>
          <div className="faculty-card-content">
            <div className="attendance-table-container">
              <table className="faculty-table">
                <thead>
                  <tr>
                    <th>USN</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.USN}>
                      <td>{student.USN}</td>
                      <td>{student.Name}</td>
                      <td>
                        <span className={`status-badge ${attendanceData[student.USN]?.status.toLowerCase()}`}>
                          {attendanceData[student.USN]?.status || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="status-actions">
                          <button 
                            className={`status-btn present ${attendanceData[student.USN]?.status === 'Present' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(student.USN, 'Present')}
                          >
                            Present
                          </button>
                          <button 
                            className={`status-btn absent ${attendanceData[student.USN]?.status === 'Absent' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(student.USN, 'Absent')}
                          >
                            Absent
                          </button>
                          <button 
                            className={`status-btn late ${attendanceData[student.USN]?.status === 'Late' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(student.USN, 'Late')}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="form-actions">
              <button 
                className="faculty-button primary"
                onClick={handleSaveAttendance}
                disabled={isLoading || students.length === 0}
              >
                {isLoading ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
