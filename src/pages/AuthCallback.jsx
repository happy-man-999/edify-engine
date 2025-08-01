import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token and redirect to homepage
      localStorage.setItem('token', token);
      window.location.href = '/';
    } else {
      setError('Authentication failed. No token received.');
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/signin')}
              className="bg-[#42677D] hover:bg-[#355263] text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <LoadingSpinner />
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Completing Authentication</h2>
          <p className="text-gray-600 mt-2">Please wait while we complete your sign-in...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback; 