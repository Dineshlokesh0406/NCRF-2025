import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './SideBar.css'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Get first letter of name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'F';
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-title">Faculty Portal</h2>}
        <button className="toggle-button" onClick={toggleSidebar}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {!collapsed && (
        <div className="user-brief">
          <div className="user-avatar">
            {user?.photo ? (
              <img src={`http://localhost:4000${user.photo}`} alt={user.name} />
            ) : (
              <div className="avatar-initial">{getInitial(user?.name)}</div>
            )}
          </div>
          <div className="user-info">
            <h3 className="user-name">{user?.name || 'Faculty'}</h3>
            <p className="user-department">MCA</p>
          </div>
        </div>
      )}

      <div className="sidebar-options">
        <NavLink to="/dashboard" className={({ isActive }) =>
          `sidebar-option ${isActive ? 'active' : ''}`
        }>
          <span className="sidebar-icon">📊</span>
          {!collapsed && <span className="sidebar-text">Dashboard</span>}
        </NavLink>

        <NavLink to="/credits" className={({ isActive }) =>
          `sidebar-option ${isActive ? 'active' : ''}`
        }>
          <span className="sidebar-icon">✏️</span>
          {!collapsed && <span className="sidebar-text">Update Credits</span>}
        </NavLink>

        <NavLink to="/credit-history" className={({ isActive }) =>
          `sidebar-option ${isActive ? 'active' : ''}`
        }>
          <span className="sidebar-icon">📜</span>
          {!collapsed && <span className="sidebar-text">Credit History</span>}
        </NavLink>

        <NavLink to="/course-management" className={({ isActive }) =>
          `sidebar-option ${isActive ? 'active' : ''}`
        }>
          <span className="sidebar-icon">📚</span>
          {!collapsed && <span className="sidebar-text">Course Management</span>}
        </NavLink>

        {/* Removed Attendance Management and Notifications options */}

        <div className="sidebar-section">
          {!collapsed && <span className="section-title">Account</span>}
        </div>

        <NavLink to="/profile" className={({ isActive }) =>
          `sidebar-option ${isActive ? 'active' : ''}`
        }>
          <span className="sidebar-icon">👤</span>
          {!collapsed && <span className="sidebar-text">My Profile</span>}
        </NavLink>
      </div>

      <div className="sidebar-footer">
        {!collapsed && <p className="copyright">© 2025 Faculty Portal</p>}
      </div>
    </div>
  )
}

export default Sidebar