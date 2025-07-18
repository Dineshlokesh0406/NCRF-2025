import React, { useState, useEffect } from 'react';
import './ListStudents.css';

const ListStudents = ({ url }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterAcademicYear, setFilterAcademicYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${url}/api/students`);
      const data = await response.json();
      
      if (response.ok) {
        const studentData = data.data || [];
        setStudents(studentData);
        
        // Extract unique academic years from student data
        const years = [...new Set(studentData.map(student => student.academicYear))].sort();
        setAcademicYears(years);
      } else {
        setError('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSemesterFilter = (e) => {
    setFilterSemester(e.target.value);
  };
  
  const handleAcademicYearFilter = (e) => {
    setFilterAcademicYear(e.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterSemester('');
    setFilterAcademicYear('');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.usn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = filterSemester === '' || student.semester.toString() === filterSemester;
    
    const matchesAcademicYear = filterAcademicYear === '' || student.academicYear === filterAcademicYear;
    
    return matchesSearch && matchesSemester && matchesAcademicYear;
  });

  return (
    <div className="list-students-container">
      <h2>MCA Student List</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or USN..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="filter-options">
          <select 
            value={filterSemester} 
            onChange={handleSemesterFilter}
            className="filter-select"
          >
            <option value="">All Semesters</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
            <option value="3">3rd Semester</option>
            <option value="4">4th Semester</option>
          </select>
          
          <select 
            value={filterAcademicYear} 
            onChange={handleAcademicYearFilter}
            className="filter-select"
          >
            <option value="">All Batch Years</option>
            {academicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <button 
            onClick={resetFilters}
            className="reset-button"
          >
            Reset Filters
          </button>
          
          <button 
            onClick={fetchStudents}
            className={`refresh-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="no-data-message">
          {students.length === 0 ? 'No students found in the database' : 'No students match the current filters'}
        </div>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>USN</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Batch Year</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
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
                  <td>{student.academicYear}</td>
                  <td>{formatDate(student.dateOfBirth)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListStudents;
