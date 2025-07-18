import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = "http://localhost:4000";

  const fetchStudentProfile = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      console.log('Stored token:', storedToken ? 'exists' : 'not found');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      console.log('Making profile request with token:', storedToken);
      const response = await axios.get(`${url}/api/student-auth/profile`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile response:', response.data);
      if (response.data.success) {
        const studentData = response.data.student;
        console.log('Student photo from API:', studentData.photo);

        // Ensure photo path is properly formatted
        if (studentData.photo && !studentData.photo.startsWith('http') && !studentData.photo.startsWith('/')) {
          studentData.photo = '/' + studentData.photo;
        }

        setStudent(studentData);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setToken('');
        setStudent(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const contextValue = {
    token,
    setToken,
    student,
    setStudent,
    loading,
    url,
    fetchStudentProfile
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
