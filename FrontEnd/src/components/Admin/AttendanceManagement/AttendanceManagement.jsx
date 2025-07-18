import React, { useState } from 'react';
import './AttendanceManagement.css';

const AttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [file, setFile] = useState(null);

  // Mock class, section, and subject data
  const classes = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const sections = ['A', 'B', 'C'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];

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
        const requiredColumns = ['USN', 'Name', 'Attendance'];
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
    
    if (!selectedClass || !selectedSection || !selectedSubject) {
      setMessage({ text: 'Please select class, section, and subject', type: 'error' });
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
          attendance: student.Attendance
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

  // Handle manual attendance entry
  const handleAttendanceChange = (usn, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [usn]: {
        ...prev[usn],
        attendance: value
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

  return (
    <div className="attendance-management-container">
      <h2 className="attendance-title">Attendance Management</h2>
      
      <div className="attendance-form">
        <div className="form-group">
          <label>Class:</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Section:</label>
          <select 
            value={selectedSection} 
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Subject:</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedSection}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="upload-section">
        <h3>Upload Attendance Data</h3>
        <p className="upload-info">
          Upload a CSV file with columns: USN, Name, Attendance (percentage)
        </p>
        
        <div className="file-upload">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            id="attendance-file"
          />
          <label htmlFor="attendance-file" className="file-label">
            {file ? file.name : 'Choose CSV File'}
          </label>
          <button 
            className="upload-btn" 
            onClick={handleUpload}
            disabled={isLoading || !file}
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
      
      {students.length > 0 && (
        <div className="attendance-table-container">
          <h3>Attendance Data</h3>
          <div className="attendance-info">
            <p><strong>Class:</strong> {selectedClass}</p>
            <p><strong>Section:</strong> {selectedSection}</p>
            <p><strong>Subject:</strong> {selectedSubject}</p>
          </div>
          
          <table className="attendance-table">
            <thead>
              <tr>
                <th>USN</th>
                <th>Name</th>
                <th>Attendance (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.USN}>
                  <td>{student.USN}</td>
                  <td>{student.Name}</td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={attendanceData[student.USN]?.attendance || ''} 
                      onChange={(e) => handleAttendanceChange(student.USN, e.target.value)}
                    />
                  </td>
                  <td className={`status ${
                    parseInt(attendanceData[student.USN]?.attendance) >= 75 
                      ? 'good' 
                      : parseInt(attendanceData[student.USN]?.attendance) >= 65 
                        ? 'warning' 
                        : 'danger'
                  }`}>
                    {parseInt(attendanceData[student.USN]?.attendance) >= 75 
                      ? 'Good' 
                      : parseInt(attendanceData[student.USN]?.attendance) >= 65 
                        ? 'Warning' 
                        : 'Low'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="action-buttons">
            <button 
              className="save-btn" 
              onClick={handleSaveAttendance}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
