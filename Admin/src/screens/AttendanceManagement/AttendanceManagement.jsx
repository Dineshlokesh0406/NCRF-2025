import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './AttendanceManagement.css';

// Mock attendance records data
const mockAttendanceRecords = [
  {
    id: 1,
    batchYear: '2023-2025',
    course: 'Data Structures',
    section: 'A',
    date: '2023-10-15',
    recordedBy: 'Prof. Sharma',
    totalStudents: 45,
    presentCount: 40,
    absentCount: 3,
    lateCount: 2
  },
  {
    id: 2,
    batchYear: '2023-2025',
    course: 'Database Management',
    section: 'B',
    date: '2023-10-16',
    recordedBy: 'Prof. Patel',
    totalStudents: 42,
    presentCount: 38,
    absentCount: 4,
    lateCount: 0
  },
  {
    id: 3,
    batchYear: '2022-2024',
    course: 'Computer Networks',
    section: 'A',
    date: '2023-10-14',
    recordedBy: 'Prof. Kumar',
    totalStudents: 50,
    presentCount: 45,
    absentCount: 2,
    lateCount: 3
  },
  {
    id: 4,
    batchYear: '2022-2024',
    course: 'Operating Systems',
    section: 'C',
    date: '2023-10-13',
    recordedBy: 'Prof. Singh',
    totalStudents: 48,
    presentCount: 42,
    absentCount: 5,
    lateCount: 1
  },
  {
    id: 5,
    batchYear: '2021-2023',
    course: 'Software Engineering',
    section: 'B',
    date: '2023-10-12',
    recordedBy: 'Prof. Reddy',
    totalStudents: 46,
    presentCount: 40,
    absentCount: 4,
    lateCount: 2
  }
];

const AttendanceManagement = ({ url }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'view'
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [file, setFile] = useState(null);
  const [batchYears, setBatchYears] = useState([]);
  const [selectedBatchYear, setSelectedBatchYear] = useState('');

  // For viewing attendance records
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceRecords);
  const [filteredRecords, setFilteredRecords] = useState(mockAttendanceRecords);
  const [filterBatchYear, setFilterBatchYear] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordDetails, setRecordDetails] = useState([]);

  // Generate batch years (e.g., 2023-2025)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      const startYear = currentYear - i;
      const endYear = startYear + 2;
      years.push(`${startYear}-${endYear}`);
    }
    setBatchYears(years);
  }, []);

  // Mock data for courses and sections
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
      toast.error('Please select a file to upload');
      return;
    }

    if (!selectedBatchYear || !selectedClass || !selectedSection || !selectedDate) {
      toast.error('Please select batch year, course, section, and date');
      return;
    }

    setLoading(true);

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
      toast.success(`Successfully uploaded attendance data for ${parsedData.length} students`);
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
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
  const handleSaveAttendance = async () => {
    if (students.length === 0) {
      toast.error('No attendance data to save');
      return;
    }

    setLoading(true);

    try {
      // Here you would send the attendance data to your backend
      // For example:
      /*
      await axios.post(`${url}/api/attendance`, {
        batchYear: selectedBatchYear,
        course: selectedClass,
        section: selectedSection,
        date: selectedDate,
        attendanceData: Object.entries(attendanceData).map(([usn, data]) => ({
          usn,
          name: data.name,
          status: data.status
        }))
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });
      */

      // For now, we'll just simulate a successful save
      setTimeout(() => {
        setLoading(false);
        toast.success('Attendance data saved successfully');
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error(`Error saving attendance data: ${error.response?.data?.message || error.message}`);
    }
  };

  // Generate mock student data for demonstration
  const loadStudents = () => {
    if (!selectedBatchYear || !selectedClass || !selectedSection || !selectedDate) {
      toast.error('Please select batch year, course, section, and date');
      return;
    }

    setLoading(true);

    // Extract batch year prefix for USN
    const batchPrefix = selectedBatchYear.split('-')[0].substring(2);

    // Mock student data with USNs based on batch year
    const mockStudents = [
      { USN: `${batchPrefix}SI20CS001`, Name: 'Aditya Sharma' },
      { USN: `${batchPrefix}SI20CS002`, Name: 'Bhavana Patel' },
      { USN: `${batchPrefix}SI20CS003`, Name: 'Chetan Kumar' },
      { USN: `${batchPrefix}SI20CS004`, Name: 'Divya Reddy' },
      { USN: `${batchPrefix}SI20CS005`, Name: 'Esha Singh' },
      { USN: `${batchPrefix}SI20CS006`, Name: 'Farhan Ahmed' },
      { USN: `${batchPrefix}SI20CS007`, Name: 'Gayatri Iyer' },
      { USN: `${batchPrefix}SI20CS008`, Name: 'Harish Verma' },
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
      setLoading(false);
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

  // Filter attendance records
  const filterRecords = () => {
    let filtered = [...attendanceRecords];

    if (filterBatchYear) {
      filtered = filtered.filter(record => record.batchYear === filterBatchYear);
    }

    if (filterCourse) {
      filtered = filtered.filter(record => record.course === filterCourse);
    }

    if (filterSection) {
      filtered = filtered.filter(record => record.section === filterSection);
    }

    if (filterDateFrom) {
      filtered = filtered.filter(record => new Date(record.date) >= new Date(filterDateFrom));
    }

    if (filterDateTo) {
      filtered = filtered.filter(record => new Date(record.date) <= new Date(filterDateTo));
    }

    setFilteredRecords(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterBatchYear('');
    setFilterCourse('');
    setFilterSection('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilteredRecords(attendanceRecords);
  };

  // Apply filters when filter values change
  useEffect(() => {
    filterRecords();
  }, [filterBatchYear, filterCourse, filterSection, filterDateFrom, filterDateTo]);

  // View attendance record details
  const viewRecordDetails = (record) => {
    setSelectedRecord(record);

    // Generate mock student attendance details
    const batchPrefix = record.batchYear.split('-')[0].substring(2);
    const mockStudentDetails = [
      { USN: `${batchPrefix}SI20CS001`, Name: 'Aditya Sharma', Status: 'Present' },
      { USN: `${batchPrefix}SI20CS002`, Name: 'Bhavana Patel', Status: 'Present' },
      { USN: `${batchPrefix}SI20CS003`, Name: 'Chetan Kumar', Status: 'Absent' },
      { USN: `${batchPrefix}SI20CS004`, Name: 'Divya Reddy', Status: 'Present' },
      { USN: `${batchPrefix}SI20CS005`, Name: 'Esha Singh', Status: 'Late' },
      { USN: `${batchPrefix}SI20CS006`, Name: 'Farhan Ahmed', Status: 'Present' },
      { USN: `${batchPrefix}SI20CS007`, Name: 'Gayatri Iyer', Status: 'Absent' },
      { USN: `${batchPrefix}SI20CS008`, Name: 'Harish Verma', Status: 'Present' },
    ];

    setRecordDetails(mockStudentDetails);
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2>Attendance Management</h2>
        <p>Upload, manage, and view student attendance records</p>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Attendance Records
        </button>
      </div>

      {activeTab === 'manage' ? (
      <>

      <div className="card">
        <div className="card-header">
          <h3>Select Class Details</h3>
        </div>
        <div className="card-content">
          <div className="form-row">
            <div className="form-group">
              <label>Batch Year:</label>
              <select
                value={selectedBatchYear}
                onChange={(e) => setSelectedBatchYear(e.target.value)}
                className="form-select"
              >
                <option value="">Select Batch Year</option>
                {batchYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Course:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="form-select"
                disabled={!selectedBatchYear}
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
                className="form-select"
                disabled={!selectedClass}
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
                className="form-input"
                disabled={!selectedSection}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn primary"
              onClick={loadStudents}
              disabled={loading || !selectedBatchYear || !selectedClass || !selectedSection || !selectedDate}
            >
              {loading ? 'Loading...' : 'Load Students'}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Upload Attendance</h3>
        </div>
        <div className="card-content">
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
              className="btn primary"
              onClick={handleUpload}
              disabled={loading || !file || !selectedBatchYear || !selectedClass || !selectedSection || !selectedDate}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Attendance Record</h3>
            <div className="attendance-info">
              <span><strong>Batch:</strong> {selectedBatchYear}</span>
              <span><strong>Course:</strong> {selectedClass}</span>
              <span><strong>Section:</strong> {selectedSection}</span>
              <span><strong>Date:</strong> {formatDate(selectedDate)}</span>
            </div>
          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="data-table">
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
                className="btn primary"
                onClick={handleSaveAttendance}
                disabled={loading || students.length === 0}
              >
                {loading ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      ) : (
      <>
        <div className="card">
          <div className="card-header">
            <h3>Filter Attendance Records</h3>
          </div>
          <div className="card-content">
            <div className="form-row">
              <div className="form-group">
                <label>Batch Year:</label>
                <select
                  value={filterBatchYear}
                  onChange={(e) => setFilterBatchYear(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Batch Years</option>
                  {batchYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Course:</label>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Section:</label>
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Sections</option>
                  {sections.map((section) => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date From:</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Date To:</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group form-actions-inline">
                <label>&nbsp;</label>
                <button className="btn secondary" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Attendance Records</h3>
            <p className="record-count">{filteredRecords.length} records found</p>
          </div>
          <div className="card-content">
            {filteredRecords.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Batch Year</th>
                      <th>Course</th>
                      <th>Section</th>
                      <th>Date</th>
                      <th>Total Students</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Late</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.batchYear}</td>
                        <td>{record.course}</td>
                        <td>{record.section}</td>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.totalStudents}</td>
                        <td className="present-count">{record.presentCount}</td>
                        <td className="absent-count">{record.absentCount}</td>
                        <td className="late-count">{record.lateCount}</td>
                        <td>
                          <button
                            className="btn view-btn"
                            onClick={() => viewRecordDetails(record)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-records">
                <p>No attendance records found matching the selected filters.</p>
              </div>
            )}
          </div>
        </div>

        {selectedRecord && (
          <div className="card">
            <div className="card-header">
              <h3>Attendance Details</h3>
              <div className="attendance-info">
                <span><strong>Batch:</strong> {selectedRecord.batchYear}</span>
                <span><strong>Course:</strong> {selectedRecord.course}</span>
                <span><strong>Section:</strong> {selectedRecord.section}</span>
                <span><strong>Date:</strong> {formatDate(selectedRecord.date)}</span>
              </div>
            </div>
            <div className="card-content">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>USN</th>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recordDetails.map((student) => (
                      <tr key={student.USN}>
                        <td>{student.USN}</td>
                        <td>{student.Name}</td>
                        <td>
                          <span className={`status-badge ${student.Status.toLowerCase()}`}>
                            {student.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </>
      )}
    </div>
  );
};

export default AttendanceManagement;
