import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, quantity = 1 } = action.payload;
      const existingItem = state.items.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
      
      state.itemCount = state.items.reduce((total, cartItem) => total + cartItem.quantity, 0);
      state.total = state.items.reduce((total, cartItem) => {
        const price = cartItem.priceUSD || 0;
        return total + (price * cartItem.quantity);
      }, 0);
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      state.itemCount = state.items.reduce((total, cartItem) => total + cartItem.quantity, 0);
      state.total = state.items.reduce((total, cartItem) => {
        const price = cartItem.priceUSD || 0;
        return total + (price * cartItem.quantity);
      }, 0);
    },
    
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(cartItem => cartItem.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(cartItem => cartItem.id !== itemId);
        } else {
          item.quantity = quantity;
        }
        
        state.itemCount = state.items.reduce((total, cartItem) => total + cartItem.quantity, 0);
        state.total = state.items.reduce((total, cartItem) => {
          const price = cartItem.priceUSD || 0;
          return total + (price * cartItem.quantity);
        }, 0);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
    
    setCart: (state, action) => {
      const { items, total, itemCount } = action.payload;
      state.items = items || [];
      state.total = total || 0;
      state.itemCount = itemCount || 0;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  setCart 
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartIsEmpty = (state) => state.cart.items.length === 0; 