import { useState, useEffect, useCallback } from 'react';

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: null,
    category: null,
    featured: null,
    search: null
  });

  // Fetch all items
  const fetchItems = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      
      // Add filters
      Object.entries({ ...filters, ...params }).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`/api/items?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data.items || data);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch items by type
  const fetchItemsByType = useCallback(async (type) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/items/type/${type}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error(`Error fetching ${type} items:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured items
  const fetchFeaturedItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/items/featured/items');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error('Error fetching featured items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search items
  const searchItems = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      await fetchItems();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/items/search/${encodeURIComponent(query)}');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error('Error searching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      type: null,
      category: null,
      featured: null,
      search: null
    });
  }, []);

  // Get items by type
  const getItemsByType = useCallback((type) => {
    return items.filter(item => item.type === type);
  }, [items]);

  // Get featured items
  const getFeaturedItems = useCallback(() => {
    return items.filter(item => item.isFeatured);
  }, [items]);

  // Get apps
  const getApps = useCallback(() => {
    return items.filter(item => item.type === 'app');
  }, [items]);

  // Get bundles
  const getBundles = useCallback(() => {
    return items.filter(item => item.type === 'bundle');
  }, [items]);

  // Get templates
  const getTemplates = useCallback(() => {
    return items.filter(item => item.type === 'template');
  }, [items]);

  // Get services
  const getServices = useCallback(() => {
    return items.filter(item => item.type === 'service');
  }, [items]);

  // Get 3D objects
  const get3DObjects = useCallback(() => {
    return items.filter(item => item.type === '3d-object');
  }, [items]);

  // Initial fetch on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    filters,
    fetchItems,
    fetchItemsByType,
    fetchFeaturedItems,
    searchItems,
    updateFilters,
    clearFilters,
    getItemsByType,
    getFeaturedItems,
    getApps,
    getBundles,
    getTemplates,
    getServices,
    get3DObjects
  };
}; 