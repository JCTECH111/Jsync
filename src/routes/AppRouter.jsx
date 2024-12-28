import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
// import LandingPage from './pages/LandingPage';
// import Dashboard from './pages/Dashboard';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import UserMetadataForm from '../Auth/Testing';
import FileCards from '../components/FileCards';
import HoverInfo from '../components/HoverInfo';
import ProtectedRoute from './ProtectedRoute';
import Home from '../landing/Home';
import Verify from '../Auth/Verify';

export default function AppRouter() {
    return (
      <Router>
        <Routes>
                {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/card" element={<FileCards />} />
          <Route path="/text" element={<UserMetadataForm />} />
          <Route path="/login" element={<HoverInfo />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {/* <Dashboard /> */}
              </ProtectedRoute>
            }
          />
                {/* Catch-all route for 404 Not Found */}
                <Route path="*" element={<h1 className='text-blue-600'>404 error</h1>} />
      </Routes>
    </Router>
  );
}