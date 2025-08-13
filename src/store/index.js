import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import authReducer from './authSlice';
import userManagementReducer from './userManagementSlice';
import dropletReducer from './dropletSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    userManagement: userManagementReducer,
    droplets: dropletReducer,
    cart: cartReducer,
  },
});

export default store;
