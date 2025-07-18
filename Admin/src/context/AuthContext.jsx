import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children, url }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('facultyToken');
        const storedUser = localStorage.getItem('facultyUser');

        if (token && storedUser) {
          // Set the token in axios headers for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Verify token is still valid
          const response = await axios.get(`${url}/api/user/verify`);

          if (response.data.success) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('facultyToken');
            localStorage.removeItem('facultyUser');
          }
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // Clear storage on error
        localStorage.removeItem('facultyToken');
        localStorage.removeItem('facultyUser');
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
    const token = localStorage.getItem('facultyToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('facultyToken');
    localStorage.removeItem('facultyUser');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
