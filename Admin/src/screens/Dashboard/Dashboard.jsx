import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = ({ url }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageCredits: 0,
    departmentBreakdown: [],
    semesterBreakdown: []
  });
  const [recentUpdates, setRecentUpdates] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Always use MCA department for statistics
      const statsResponse = await axios.get(`${url}/api/students/stats?department=MCA`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });

      // Always use MCA department for recent updates
      const updatesResponse = await axios.get(`${url}/api/students/recent-updates?department=MCA`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`
        }
      });

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (updatesResponse.data.success) {
        setRecentUpdates(updatesResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  // No mock data - only show real data
  const hasData = stats.totalStudents > 0;
  const hasUpdates = recentUpdates.length > 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Faculty Dashboard</h2>
        <p className="welcome-message">Welcome back, {user?.name || 'Faculty'}!</p>
        <p className="department-info">Department: <span>MCA</span></p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Loading dashboard data...</div>
      ) : !hasData ? (
        <div className="no-data-message">
          <h3>No Student Data Available</h3>
          <p>There are no students in your department yet. Data will appear here once students are added by the SuperAdmin.</p>
        </div>
      ) : (
        <>
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Students</h3>
              <div className="stat-value">{stats.totalStudents}</div>
            </div>
            <div className="stat-card">
              <h3>Average Credits</h3>
              <div className="stat-value">{stats.averageCredits.toFixed(1)}</div>
            </div>
            <div className="stat-card">
              <h3>Department</h3>
              <div className="stat-value">MCA</div>
            </div>
            <div className="stat-card">
              <h3>Active Semesters</h3>
              <div className="stat-value">{stats.semesterBreakdown.length}</div>
            </div>
          </div>

          <div className="dashboard-sections">
            {stats.semesterBreakdown.length > 0 && (
              <div className="dashboard-section">
                <h3>Semester Breakdown</h3>
                <div className="breakdown-container">
                  {stats.semesterBreakdown.map((sem, index) => (
                    <div key={index} className="breakdown-item">
                      <div className="breakdown-header">
                        <span className="breakdown-title">Semester {sem.semester}</span>
                        <span className="breakdown-count">{sem.count} students</span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${(sem.averageCredits / 60) * 100}%`,
                            backgroundColor: getColorForCredits(sem.averageCredits)
                          }}
                        ></div>
                      </div>
                      <div className="breakdown-footer">
                        <span>Avg. Credits: {sem.averageCredits.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!loading && hasUpdates ? (
        <div className="dashboard-section recent-updates">
          <h3>Recent Credit Updates</h3>
          <div className="updates-table-container">
            <table className="updates-table">
              <thead>
                <tr>
                  <th>USN</th>
                  <th>Name</th>
                  <th>Previous</th>
                  <th>New</th>
                  <th>Change</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentUpdates.map((update, index) => (
                  <tr key={index}>
                    <td>{update.usn}</td>
                    <td>{update.name}</td>
                    <td>{update.oldCredits}</td>
                    <td>{update.newCredits}</td>
                    <td className={getChangeClass(update.newCredits - update.oldCredits)}>
                      {getChangeSymbol(update.newCredits - update.oldCredits)}
                      {Math.abs(update.newCredits - update.oldCredits)}
                    </td>
                    <td>{formatDate(update.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : !loading && (
        <div className="dashboard-section recent-updates">
          <h3>Recent Credit Updates</h3>
          <div className="no-updates-message">
            <p>No recent credit updates found. Updates will appear here after you modify student credits.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getColorForCredits = (credits) => {
  if (credits < 30) return '#e53e3e'; // Red for low credits
  if (credits < 40) return '#ed8936'; // Orange for medium-low credits
  if (credits < 50) return '#38a169'; // Green for medium-high credits
  return '#3182ce'; // Blue for high credits
};

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

export default Dashboard;
