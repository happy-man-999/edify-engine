import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchDroplets = createAsyncThunk(
  'droplets/fetchDroplets',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const queryParams = new URLSearchParams(filters).toString();
      
      const response = await fetch(`/api/admin/droplets?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch droplets');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDropletStats = createAsyncThunk(
  'droplets/fetchDropletStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch('/api/admin/droplets/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch droplet stats');
      }

      return data.stats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDropletById = createAsyncThunk(
  'droplets/fetchDropletById',
  async (dropletId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`/api/admin/droplets/${dropletId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch droplet');
      }

      return data.droplet;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncDropletStatus = createAsyncThunk(
  'droplets/syncDropletStatus',
  async (dropletId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`/api/user/droplets/${dropletId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sync droplet status');
      }

      return data.droplet;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const restartDroplet = createAsyncThunk(
  'droplets/restartDroplet',
  async (dropletId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`/api/admin/droplets/${dropletId}/restart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to restart droplet');
      }

      return data.droplet;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const terminateDroplet = createAsyncThunk(
  'droplets/terminateDroplet',
  async (dropletId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`/api/admin/droplets/${dropletId}/terminate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to terminate droplet');
      }

      return data.droplet;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reprovisionDroplet = createAsyncThunk(
  'droplets/reprovisionDroplet',
  async (dropletId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`/api/admin/droplets/${dropletId}/reprovision`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reprovision droplet');
      }

      return data.droplet;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDroplet = createAsyncThunk(
  'droplets/deleteDroplet',
  async (dropletId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`/api/admin/droplets/${dropletId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete droplet');
      }

      return { dropletId, message: data.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  droplets: [],
  stats: {
    totalDroplets: 0,
    activeDroplets: 0,
    newDroplets: 0,
    offDroplets: 0,
    recentDroplets: 0,
    totalMonthlyCost: '0.00'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  loading: false,
  statsLoading: false,
  error: null,
  selectedDroplet: null
};

const dropletSlice = createSlice({
  name: 'droplets',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearDroplets(state) {
      state.droplets = [];
      state.pagination = initialState.pagination;
    },
    setSelectedDroplet(state, action) {
      state.selectedDroplet = action.payload;
    },
    clearSelectedDroplet(state) {
      state.selectedDroplet = null;
    }
  },
  extraReducers: (builder) => {
    // fetchDroplets
    builder
      .addCase(fetchDroplets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDroplets.fulfilled, (state, action) => {
        state.loading = false;
        state.droplets = action.payload.droplets;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDroplets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchDropletStats
    builder
      .addCase(fetchDropletStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchDropletStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDropletStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });

    // fetchDropletById
    builder
      .addCase(fetchDropletById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDropletById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDroplet = action.payload;
      })
      .addCase(fetchDropletById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // syncDropletStatus
    builder
      .addCase(syncDropletStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncDropletStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the droplet in the list if it exists
        const index = state.droplets.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.droplets[index] = action.payload;
        }
        // Update selected droplet if it's the same one
        if (state.selectedDroplet && state.selectedDroplet.id === action.payload.id) {
          state.selectedDroplet = action.payload;
        }
        // Success notification will be handled by the component
      })
      .addCase(syncDropletStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // restartDroplet
    builder
      .addCase(restartDroplet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restartDroplet.fulfilled, (state, action) => {
        state.loading = false;
        // Update the droplet in the list if it exists
        const index = state.droplets.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.droplets[index] = action.payload;
        }
        // Update selected droplet if it's the same one
        if (state.selectedDroplet && state.selectedDroplet.id === action.payload.id) {
          state.selectedDroplet = action.payload;
        }
        // Success notification will be handled by the component
      })
      .addCase(restartDroplet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // terminateDroplet
    builder
      .addCase(terminateDroplet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(terminateDroplet.fulfilled, (state, action) => {
        state.loading = false;
        // Update the droplet in the list if it exists
        const index = state.droplets.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.droplets[index] = action.payload;
        }
        // Update selected droplet if it's the same one
        if (state.selectedDroplet && state.selectedDroplet.id === action.payload.id) {
          state.selectedDroplet = action.payload;
        }
        // Success notification will be handled by the component
      })
      .addCase(terminateDroplet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // reprovisionDroplet
    builder
      .addCase(reprovisionDroplet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reprovisionDroplet.fulfilled, (state, action) => {
        state.loading = false;
        // Update the droplet in the list if it exists
        const index = state.droplets.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.droplets[index] = action.payload;
        }
        // Update selected droplet if it's the same one
        if (state.selectedDroplet && state.selectedDroplet.id === action.payload.id) {
          state.selectedDroplet = action.payload;
        }
        // Success notification will be handled by the component
      })
      .addCase(reprovisionDroplet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // deleteDroplet
    builder
      .addCase(deleteDroplet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDroplet.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the droplet from the list
        state.droplets = state.droplets.filter(d => d.id !== action.payload.dropletId);
        // Clear selected droplet if it's the deleted one
        if (state.selectedDroplet && state.selectedDroplet.id === action.payload.dropletId) {
          state.selectedDroplet = null;
        }
        // Update total count
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        // Success notification will be handled by the component
      })
      .addCase(deleteDroplet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearDroplets, setSelectedDroplet, clearSelectedDroplet } = dropletSlice.actions;
export default dropletSlice.reducer; 