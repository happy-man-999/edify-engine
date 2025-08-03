import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  checkAuth,
  signup,
  signin,
  signout,
  updateProfile,
  handleGoogleAuthCompletion,
  checkSignupProgress,
  saveSignupProgress,
  clearError,
  clearAuth
} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user,
    token,
    loading,
    signupProgress,
    hasCompletedSignup,
    isAuthenticated,
    error
  } = useSelector((state) => state.auth);

  // Check if user is authenticated on app load
  useEffect(() => {
    if (token) {
      dispatch(checkAuth(token));
    }
  }, [dispatch, token]);

  const signupUser = async (userData) => {
    const result = await dispatch(signup(userData));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const signinUser = async (credentials) => {
    const result = await dispatch(signin(credentials));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const signoutUser = async () => {
    await dispatch(signout(token));
    navigate('/');
  };

  const updateUserProfile = async (profileData) => {
    const result = await dispatch(updateProfile({ profileData, token }));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const handleGoogleAuth = async (token) => {
    const result = await dispatch(handleGoogleAuthCompletion(token));
    return {
      success: !result.error,
      user: result.payload?.user,
      token: result.payload?.token,
      error: result.error?.message || result.payload
    };
  };

  const checkSignupProgressUser = async () => {
    const result = await dispatch(checkSignupProgress());
    return result.payload;
  };

  const saveSignupProgressUser = async (step, data) => {
    const result = await dispatch(saveSignupProgress({ step, data }));
    if (result.error) {
      throw new Error(result.error.message || result.payload);
    }
    return result.payload;
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const clearAuthState = () => {
    dispatch(clearAuth());
  };

  return {
    user,
    token,
    loading,
    signup,
    signin,
    signout: signoutUser,
    updateProfile: updateUserProfile,
    handleGoogleAuthCompletion: handleGoogleAuth,
    checkSignupProgress: checkSignupProgressUser,
    saveSignupProgress: saveSignupProgressUser,
    signupProgress,
    hasCompletedSignup,
    isAuthenticated,
    error,
    clearError: clearAuthError,
    clearAuth: clearAuthState
  };
}; 