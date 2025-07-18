import React, { useContext, useEffect } from "react";
import "./Verify.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { url, setToken, fetchStudentProfile } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${url}/api/student-auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          localStorage.setItem('token', token);
          setToken(token);
          await fetchStudentProfile();
          navigate("/profile");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        navigate("/");
      }
    };

    verifyToken();
  }, [url, token, navigate, setToken, fetchStudentProfile]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
