import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'
import { assets } from '../../assets/admin_assets/assets'
import { useAuth } from '../../context/AuthContext'

const NavBar = ({ onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    if (onLogout) onLogout();
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="navbar-title">SuperAdmin Portal</div>
      </div>

      <div className="navbar-right">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </div>

        <div className="notification-bell">
          <span className="notification-icon">🔔</span>
          <span className="notification-badge">3</span>
        </div>

        <div className="user-profile">
          <div className="avatar" onClick={toggleDropdown}>
            <img src={assets.profile_image} alt="" className="profile" />
          </div>

          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="user-name">{user?.name || 'Super Admin'}</p>
                <p className="user-email">{user?.email || 'admin@ncrf.edu'}</p>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                <span className="item-icon">👤</span>
                <span>My Profile</span>
              </Link>
              <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                <span className="item-icon">⚙️</span>
                <span>Settings</span>
              </Link>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                <span className="item-icon">🚪</span>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar