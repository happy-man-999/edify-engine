import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return rejectWithValue('Token is invalid');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signin failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signout = createAsyncThunk(
  'auth/signout',
  async (token, { rejectWithValue }) => {
    try {
      if (token) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ profileData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const handleGoogleAuthCompletion = createAsyncThunk(
  'auth/handleGoogleAuthCompletion',
  async (token, { dispatch, rejectWithValue }) => {
    try {
      // Store the token
      localStorage.setItem('token', token);
      
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check signup progress after Google auth
        await dispatch(checkSignupProgress());
        
        return { success: true, user: data.user, token: token };
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkSignupProgress = createAsyncThunk(
  'auth/checkSignupProgress',
  async (_, { getState, rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        return null;
      }
      
      const response = await fetch('/api/signup-progress/progress', {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorText = await response.text();
        console.error('checkSignupProgress: Response not ok, status:', response.status, 'Error:', errorText);
        return rejectWithValue(`Failed to check signup progress: ${response.status}`);
      }
    } catch (error) {
      console.error('Check signup progress error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const saveSignupProgress = createAsyncThunk(
  'auth/saveSignupProgress',
  async ({ step, data }, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        throw new Error('No token available for saving signup progress');
      }

      const response = await fetch('/api/signup-progress/progress', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ step, data })
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const errorText = await response.text();
        console.error('saveSignupProgress: Response not ok, status:', response.status, 'Error:', errorText);
        throw new Error(`Failed to save progress: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Save signup progress error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: !!localStorage.getItem('token'),
  signupProgress: null,
  hasCompletedSignup: false,
  isAuthenticated: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.signupProgress = null;
      state.hasCompletedSignup = false;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    // checkAuth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        state.error = action.payload;
      });

    // signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // signin
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // signout
    builder
      .addCase(signout.pending, (state) => {
        state.loading = true;
      })
      .addCase(signout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.signupProgress = null;
        state.hasCompletedSignup = false;
        localStorage.removeItem('token');
      })
      .addCase(signout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateProfile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // handleGoogleAuthCompletion
    builder
      .addCase(handleGoogleAuthCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGoogleAuthCompletion.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      })
      .addCase(handleGoogleAuthCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // checkSignupProgress
    builder
      .addCase(checkSignupProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSignupProgress.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.signupProgress = action.payload.progress;
          state.hasCompletedSignup = action.payload.isCompleted;
        }
      })
      .addCase(checkSignupProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // saveSignupProgress
    builder
      .addCase(saveSignupProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSignupProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.signupProgress = action.payload.progress;
        state.hasCompletedSignup = action.payload.isCompleted;
        state.error = null;
      })
      .addCase(saveSignupProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer; 