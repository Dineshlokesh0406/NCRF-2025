import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './screens/Home/Home';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopUp/LoginPopUp';
import { useState, useEffect, useContext } from 'react';
import { StoreContext } from './context/StoreContext';
import Verify from './screens/Verify/Verify.jsx';
import CreditFramework from './components/CreditFramework/CreditFramework';
import CreditCalculator from './components/Creditcalculator/creditcalculator';
import About from './components/About/About';
import Profile from './components/Profile/Profile';
import AdminDashboard from './components/Admin/AdminDashboard';
import FacultyDashboard from './components/Faculty/FacultyDashboard';
import './App.css';

// Import Module Components
import Primary from './Modules/Primary/Primary';
import Higher from './Modules/Higher/Higher';
import Undergraduate from './Modules/Undergraduate/Undergraduate';
import BCA from './Modules/Undergraduate/BCA';
import BCom from './Modules/Undergraduate/BCom';
import BBA from './Modules/Undergraduate/BBA';
import Postgraduate from './Modules/Postgraduate/Postgraduate';
import PhD from './Modules/PhD/PhD';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(StoreContext);

  // Check if current route is profile page, admin page, or faculty page
  const isProfilePage = location.pathname === '/profile';
  const isAdminPage = location.pathname === '/admin';
  const isFacultyPage = location.pathname === '/faculty';

  // Redirect to profile page if token exists and user is on home page
  useEffect(() => {
    if (token && location.pathname === '/') {
      navigate('/profile');
    }
  }, [token, location.pathname, navigate]);

  // Add/remove body-freeze class when login popup is shown/hidden
  useEffect(() => {
    if (showLogin) {
      document.body.classList.add('body-freeze');
    } else {
      document.body.classList.remove('body-freeze');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('body-freeze');
    };
  }, [showLogin]);

  return (
    <>
      {/* Display Login Popup if showLogin is true */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className={`app ${showLogin ? 'app-blur' : ''}`}>
        {/* Only show Navbar if not on profile page, admin page, or faculty page */}
        {!isProfilePage && !isAdminPage && !isFacultyPage && <Navbar setShowLogin={setShowLogin} />}

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/faculty' element={<FacultyDashboard />} />
          <Route path='/credit-framework' element={<CreditFramework />} />
          <Route path='/credit-calculator' element={<CreditCalculator />} />
          <Route path='/about' element={<About />} />

          {/* Module Routes */}
          <Route path='/modules/primary' element={<Primary />} />
          <Route path='/modules/higher' element={<Higher />} />
          <Route path='/modules/undergraduate' element={<Undergraduate />} />
          <Route path='/modules/undergraduate/bca' element={<BCA />} />
          <Route path='/modules/undergraduate/bcom' element={<BCom />} />
          <Route path='/modules/undergraduate/bba' element={<BBA />} />
          <Route path='/modules/postgraduate' element={<Postgraduate />} />
          <Route path='/modules/phd' element={<PhD />} />
        </Routes>

        {/* Only show Footer if not on profile page, admin page, or faculty page */}
        {!isProfilePage && !isAdminPage && !isFacultyPage && <Footer />}
      </div>
    </>
  );
};

export default App;
