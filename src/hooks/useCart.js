import { useSelector, useDispatch } from 'react-redux';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectCartIsEmpty
} from '../store/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const isEmpty = useSelector(selectCartIsEmpty);

  const addItem = (item, quantity = 1) => {
    dispatch(addToCart({ item, quantity }));
  };

  const removeItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const updateItemQuantity = (itemId, quantity) => {
    dispatch(updateQuantity({ itemId, quantity }));
  };

  const clearAll = () => {
    dispatch(clearCart());
  };

  const getItemQuantity = (itemId) => {
    const item = items.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const isInCart = (itemId) => {
    return items.some(cartItem => cartItem.id === itemId);
  };

  return {
    // State
    items,
    total,
    itemCount,
    isEmpty,
    
    // Actions
    addItem,
    removeItem,
    updateItemQuantity,
    clearAll,
    
    // Utilities
    getItemQuantity,
    isInCart,
  };
}; 