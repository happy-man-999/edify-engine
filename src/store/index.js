import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import authReducer from './authSlice';
import userManagementReducer from './userManagementSlice';
import dropletReducer from './dropletSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    userManagement: userManagementReducer,
    droplets: dropletReducer,
  },
});

export default store;
