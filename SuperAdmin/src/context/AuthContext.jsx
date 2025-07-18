import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children, url }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // First check if SuperAdmin exists in the system
        const checkResponse = await axios.get(`${url}/api/superadmin/exists`);
        setSuperAdminExists(checkResponse.data.exists);

        // If SuperAdmin exists, try to log in with stored credentials
        const token = localStorage.getItem('superAdminToken');
        const storedUser = localStorage.getItem('superAdminUser');

        if (token && storedUser) {
          // Set the token in axios headers for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Verify token is still valid
          const response = await axios.get(`${url}/api/superadmin/verify`);

          if (response.data.success) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('superAdminToken');
            localStorage.removeItem('superAdminUser');
          }
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // Clear storage on error
        localStorage.removeItem('superAdminToken');
        localStorage.removeItem('superAdminUser');

        // Assume SuperAdmin exists if there's an error (safer default)
        setSuperAdminExists(true);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [url]);

  // Login function
  const login = (userData) => {
    setUser(userData);
    // Set the token in axios headers for all future requests
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminUser');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Value to be provided by the context
  const value = {
    user,
    loading,
    superAdminExists,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
