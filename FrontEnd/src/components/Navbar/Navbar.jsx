import React, { useState, useContext, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets.js'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {
  const { token, setToken } = useContext(StoreContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [menu, setMenu] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showModulesDropdown, setShowModulesDropdown] = useState(false)

  // Update active menu item based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setMenu('Home');
    } else if (path.includes('/modules')) {
      setMenu('Modules');
    } else if (path === '/credit-framework') {
      setMenu('Framework');
    } else if (path === '/credit-calculator') {
      setMenu('Calculator');
    } else if (path === '/about') {
      setMenu('About');
    }
  }, [location.pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setShowModulesDropdown(false);
    }
  }

  const toggleModulesDropdown = () => {
    setShowModulesDropdown(!showModulesDropdown);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setShowModulesDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">NCRF</Link>
      </div>

      <div className="hamburger" onClick={toggleMobileMenu}>
        <div className={`bar ${isMobileMenuOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isMobileMenuOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isMobileMenuOpen ? 'active' : ''}`}></div>
      </div>

      <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" className={menu === 'Home' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>
          Home
        </Link>

        <div className="dropdown">
          <div
            className={`dropdown-button ${menu === 'Modules' ? 'active' : ''}`}
            onClick={toggleModulesDropdown}
          >
            Modules <span className="arrow">▼</span>
          </div>

          <div className={`dropdown-content ${showModulesDropdown ? 'show' : ''}`}>
            <Link to="/modules/primary" onClick={() => {setIsMobileMenuOpen(false); setShowModulesDropdown(false);}}>Primary</Link>
            <Link to="/modules/higher" onClick={() => {setIsMobileMenuOpen(false); setShowModulesDropdown(false);}}>Higher Secondary</Link>

            <div className="has-submenu">
              <Link to="/modules/undergraduate" onClick={(e) => {
                e.stopPropagation(); // Prevent closing dropdown when clicking on parent item
                setIsMobileMenuOpen(false);
              }}>
                Undergraduate <span className="submenu-arrow">▼</span>
              </Link>
              <div className="submenu">
                <Link to="/modules/undergraduate/bca" onClick={() => {setIsMobileMenuOpen(false); setShowModulesDropdown(false);}} className="submenu-item">BCA</Link>
                <Link to="/modules/undergraduate/bcom" onClick={() => {setIsMobileMenuOpen(false); setShowModulesDropdown(false);}} className="submenu-item">BCom</Link>
                <Link to="/modules/undergraduate/bba" onClick={() => {setIsMobileMenuOpen(false); setShowModulesDropdown(false);}} className="submenu-item">BBA</Link>
              </div>
            </div>

            <Link to="/modules/postgraduate" onClick={() => {setIsMobileMenuOpen(false); setShowModulesDropdown(false);}}>Postgraduate</Link>
            <Link to="/modules/phd" onClick={() => {setIsMobileMenuOpen(false); setShowModulesDropdown(false);}}>PhD</Link>
          </div>
        </div>

        <Link to="/credit-framework" className={menu === 'Framework' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>
          Credit Framework
        </Link>

        <Link to="/credit-calculator" className={menu === 'Calculator' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>
          Credit Calculator
        </Link>

        <Link to="/about" className={menu === 'About' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>
          About
        </Link>
      </div>

      <div className="navbar-auth">
        {!token ? (
          <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>
        ) : (
          <div className="profile" onClick={() => navigate('/profile')}>
            <img src={assets.profile_icon} alt="Profile" />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar