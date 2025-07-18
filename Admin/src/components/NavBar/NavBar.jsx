import React, { useState } from 'react'
import './NavBar.css'
import {assets} from '../../assets/admin_assets/assets'
// Removed NotificationBell import

const NavBar = ({ user, onLogout }) => {
  // Removed url variable
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    onLogout();
  };

  // Get first letter of name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'F';
  };

  return (
    <div className="navbar">
        <div className="navbar-title">Faculty Portal</div>

        <div className="navbar-actions">
          {/* Removed NotificationBell */}
          <div className="user-profile">
            <div className="user-avatar" onClick={toggleDropdown}>
              {user?.photo ? (
                <img src={`http://localhost:4000${user.photo}`} alt={user.name} />
              ) : (
                <div className="avatar-initial">{getInitial(user?.name)}</div>
              )}
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="user-info">
                  <p className="user-name">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button className="logout-button" onClick={handleLogout}>
                  <i className="logout-icon">↪</i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}

export default NavBar