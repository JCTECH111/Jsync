import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SoundWaveLoader from '../components/SoundWaveLoader'; // Assuming you have this loader component
import { account } from '../lib/appwrite'; // Assuming you have an Appwrite configuration file
import { AuthContext } from '../context/AuthContext';

export default function SignIn() {
  const { setUserInformation, setUserId } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the loader

    try {
      // Check for and delete the current session
      try {
        await account.deleteSession('current');
      } catch (err) {
        console.log('No active session to delete:', err.message);
      }

      // Create a new session with email and password
      await account.createEmailPasswordSession(email, password);
      
      // Fetch the user information
      const user = await account.get();
      setUserInformation(user); // Store user information in context
      setUserId(user.$id); // Store user ID in context
      
      // Persist user ID in localStorage
      localStorage.setItem('userId', user.$id);

      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Sign In Successful',
        text: 'Welcome back!',
        timer: 2000,
        showConfirmButton: false,
      });

      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign In Error:', error);

      Swal.fire({
        icon: 'error',
        title: 'Sign In Failed',
        text: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-2 bg-white rounded-lg">
        <h2 className="mb-6 text-2xl font-bold text-center">Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="relative w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {loading ? <SoundWaveLoader /> : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-xl text-center text-gray-500">
      Not Yet Registered? {' '}
      <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500">SignUp</Link>
    </p>
      </div>
    </div>
  );
}
