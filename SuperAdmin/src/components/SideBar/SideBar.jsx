import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './SideBar.css'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-brand">NCRF Admin</h2>}
        <button className="toggle-button" onClick={toggleSidebar}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-section">
          {!collapsed && <h3 className="section-title">Faculty Management</h3>}
          <NavLink to="/add" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="item-icon">➕</span>
            {!collapsed && <span className="item-text">Add Faculty</span>}
          </NavLink>

          <NavLink to="/update" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="item-icon">✏️</span>
            {!collapsed && <span className="item-text">Update Faculty</span>}
          </NavLink>

          <NavLink to="/list" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="item-icon">📋</span>
            {!collapsed && <span className="item-text">List Faculty</span>}
          </NavLink>
        </div>

        <div className="sidebar-section">
          {!collapsed && <h3 className="section-title">Student Management</h3>}
          <NavLink to="/add-student" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="item-icon">➕</span>
            {!collapsed && <span className="item-text">Add Student</span>}
          </NavLink>

          <NavLink to="/update-student" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="item-icon">✏️</span>
            {!collapsed && <span className="item-text">Update Student</span>}
          </NavLink>

          <NavLink to="/list-students" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="item-icon">📋</span>
            {!collapsed && <span className="item-text">List Students</span>}
          </NavLink>
        </div>

        <div className="sidebar-section">
          {!collapsed && <h3 className="section-title">System</h3>}
          <NavLink to="/profile" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="item-icon">👤</span>
            {!collapsed && <span className="item-text">My Profile</span>}
          </NavLink>
          <div className="sidebar-item logout" onClick={handleLogout}>
            <span className="item-icon">🚪</span>
            {!collapsed && <span className="item-text">Logout</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
