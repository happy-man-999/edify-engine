import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../store/uiSlice';

export const useDeleteWorld = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  const deleteWorld = async (dropletId) => {
    if (isDeleting) return { success: false, error: 'Already deleting' };

    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/user/droplets/${dropletId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(showNotification('World deleted successfully'));
        return { success: true, data: result };
      } else {
        throw new Error(result.message || 'Failed to delete world');
      }
    } catch (error) {
      console.error('Error deleting world:', error);
      dispatch(showNotification(`Failed to delete world: ${error.message}`));
      return { success: false, error: error.message };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteWorld,
    isDeleting
  };
};
