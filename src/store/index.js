import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import phantomReducer from './phantomSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    phantom: phantomReducer,
  },
});

export default store;
