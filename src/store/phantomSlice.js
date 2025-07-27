import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: null,
  isConnected: false,
  balance: 0,
  isBalanceLoading: false,
};

const phantomSlice = createSlice({
  name: 'phantom',
  initialState,
  reducers: {
    setAddress(state, action) { state.address = action.payload; },
    connected(state) { 
      localStorage.setItem('phantomAddress', state.address);
      state.isConnected = true; 
    },
    disconnected(state) { 
      localStorage.removeItem('phantomAddress');
      state.isConnected = false;
    },
    setBalance(state, action) { state.balance = action.payload; },
    setBalanceLoading(state, action) { state.isBalanceLoading = action.payload; },
  },
});

export const {
  setAddress,
  connected,
  disconnected,
  setBalance,
  setBalanceLoading
} = phantomSlice.actions;

export default phantomSlice.reducer;
