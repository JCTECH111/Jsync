import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SoundWaveLoader from '../components/SoundWaveLoader';

const ProtectedRoute = ({ children }) => {
  const { userId, loading } = useContext(AuthContext);

  // If the loading state is still true, show a loading indicator
  if (loading) {
    return <div className='flex items-center justify-center w-screen h-screen'><SoundWaveLoader /></div>;
  }

  // If user is authenticated (userId exists), render the children (protected content)
  // If not authenticated, redirect to the login page (or any other route)
  return userId ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
