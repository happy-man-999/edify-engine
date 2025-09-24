import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../store/uiSlice';

export const useUserPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  const dispatch = useDispatch();

  const fetchPurchases = useCallback(async (page = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/user/purchases?page=${page}&limit=${pagination.limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch purchases');
      }

      const data = await response.json();
      
      if (append) {
        setPurchases(prev => [...prev, ...data.purchases]);
      } else {
        setPurchases(data.purchases);
      }
      
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError(err.message);
      //dispatch(showNotification('Failed to load purchases', 'error'));
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, dispatch]);

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.pages && !loading) {
      fetchPurchases(pagination.page + 1, true);
    }
  }, [pagination.page, pagination.pages, loading, fetchPurchases]);

  const refreshPurchases = useCallback(() => {
    fetchPurchases(1, false);
  }, [fetchPurchases]);

  const downloadItem = useCallback(async (transactionId, itemName, fileType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/purchases/${transactionId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const data = await response.json();
      
      // Show loading notification
      dispatch(showNotification(`Starting download for ${itemName}...`));
      
      // Fetch the file as a blob to handle CORS properly
      const fileResponse = await fetch(data.downloadUrl);
      
      if (!fileResponse.ok) {
        throw new Error(`HTTP error! status: ${fileResponse.status}`);
      }
      
      const blob = await fileResponse.blob();
      
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${itemName}.${fileType.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
      
      dispatch(showNotification(`Download completed for ${itemName}`));
      return true;
    } catch (err) {
      console.error('Error downloading file:', err);
      dispatch(showNotification('Failed to download file', 'error'));
      return false;
    }
  }, [dispatch]);

  // Load purchases on mount
  useEffect(() => {
    fetchPurchases(1, false);
  }, [fetchPurchases]);

  return {
    purchases,
    loading,
    error,
    pagination,
    hasMore: pagination.page < pagination.pages,
    loadMore,
    refreshPurchases,
    downloadItem
  };
};
