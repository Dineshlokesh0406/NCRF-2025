import React, { useState } from 'react'
import NavBar from './components/NavBar/NavBar'
import SideBar from './components/SideBar/SideBar'
import {Routes, Route, Navigate} from "react-router-dom"
import Credits from './screens/Credits/Credits'
import Dashboard from './screens/Dashboard/Dashboard'
import CreditHistory from './screens/CreditHistory/CreditHistory'
import CourseManagement from './screens/CourseManagement/CourseManagement'
// Removed AttendanceManagement import
import Profile from './screens/Profile/Profile'
// Removed NotificationsPage import
import Login from './screens/Login/Login'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './components/ProtectedRoute/ProtectedRoute.css'
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
  const { user, login, logout } = useAuth();

  return (
    <div className="app">
      <ToastContainer/>
      {user && (
        <>
          <div className="app-component">
            <SideBar/>
            <div className="content-wrapper">
              <NavBar user={user} onLogout={logout} />
              <div className="main-content">
                <Routes>
                  <Route path='/dashboard' element={
                    <ProtectedRoute>
                      <Dashboard url={url}/>
                    </ProtectedRoute>
                  } />
                  <Route path='/credits' element={
                    <ProtectedRoute>
                      <Credits url={url}/>
                    </ProtectedRoute>
                  } />
                  <Route path='/credit-history' element={
                    <ProtectedRoute>
                      <CreditHistory url={url}/>
                    </ProtectedRoute>
                  } />
                  <Route path='/course-management' element={
                    <ProtectedRoute>
                      <CourseManagement url={url}/>
                    </ProtectedRoute>
                  } />
                  {/* Removed Attendance Management route */}
                  <Route path='/profile' element={
                    <ProtectedRoute>
                      <Profile url={url}/>
                    </ProtectedRoute>
                  } />
                  {/* Removed Notifications route */}
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          </div>
        </>
      )}

      {!user && (
        <Routes>
          <Route path='/login' element={<Login url={url} onLogin={login} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  )
}

export default AppWrapper
