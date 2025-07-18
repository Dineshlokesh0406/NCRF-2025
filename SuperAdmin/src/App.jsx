import React from 'react'
import NavBar from './components/NavBar/NavBar'
import SideBar from './components/SideBar/SideBar'
import {Routes, Route, Navigate} from "react-router-dom"
import Add from './screens/Add/Add'
import Update from './screens/Update/Update'
import List from './screens/List/List'
import AddStudent from './screens/AddStudent/AddStudent'
import UpdateStudent from './screens/UpdateStudent/UpdateStudent'
import ListStudents from './screens/ListStudents/ListStudents'
import Login from './screens/Auth/Login'
import Signup from './screens/Auth/Signup'
// Removed forgot password imports
import Profile from './screens/Profile/Profile'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// Main App wrapper with authentication
const AppWrapper = () => {
  const url='http://localhost:4000'

  return (
    <AuthProvider url={url}>
      <AppContent url={url} />
    </AuthProvider>
  )
}

// App content with authentication context
const AppContent = ({ url }) => {
  const { user, login, logout, superAdminExists } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app">
      <ToastContainer/>

      {user ? (
        // Authenticated view
        <>
          <NavBar onLogout={handleLogout} />
          <div className="app-component">
            <SideBar/>
            <div className="content-area">
              <Routes>
                {/* Admin Management Routes */}
                <Route path='/add' element={
                  <ProtectedRoute>
                    <Add url={url}/>
                  </ProtectedRoute>
                } />
                <Route path='/update' element={
                  <ProtectedRoute>
                    <Update url={url}/>
                  </ProtectedRoute>
                } />
                <Route path="/list" element={
                  <ProtectedRoute>
                    <List url={url}/>
                  </ProtectedRoute>
                } />

                {/* Student Management Routes */}
                <Route path='/add-student' element={
                  <ProtectedRoute>
                    <AddStudent url={url}/>
                  </ProtectedRoute>
                } />
                <Route path='/update-student' element={
                  <ProtectedRoute>
                    <UpdateStudent url={url}/>
                  </ProtectedRoute>
                } />
                <Route path="/list-students" element={
                  <ProtectedRoute>
                    <ListStudents url={url}/>
                  </ProtectedRoute>
                } />

                {/* Profile Route */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile url={url}/>
                  </ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to="/list" />} />
                <Route path="*" element={<Navigate to="/list" />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        // Unauthenticated view
        <Routes>
          <Route path='/login' element={<Login url={url} onLogin={login} />} />
          <Route path='/signup' element={
            !superAdminExists ? (
              <Signup url={url} onLogin={login} />
            ) : (
              <Navigate to="/login" />
            )
          } />
          {/* Removed forgot password routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  )
}

export default AppWrapper
