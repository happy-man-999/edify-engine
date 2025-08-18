import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useUserDroplets = () => {
  const [userDroplets, setUserDroplets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { token } = useSelector((state) => state.auth);

  const fetchUserDroplets = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/droplets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user droplets');
      }

      const data = await response.json();
      setUserDroplets(data.droplets || []);
    } catch (err) {
      console.error('Error fetching user droplets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch user droplets on mount and when token changes
  useEffect(() => {
    fetchUserDroplets();
  }, [fetchUserDroplets]);

  // Function to refresh user droplets
  const refreshUserDroplets = useCallback(() => {
    fetchUserDroplets();
  }, [fetchUserDroplets]);

  // Function to get droplet status color
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'new':
        return 'text-blue-600 bg-blue-100';
      case 'off':
        return 'text-yellow-600 bg-yellow-100';
      case 'archive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }, []);

  // Function to format droplet specs
  const formatSpecs = useCallback((specs) => {
    if (!specs) return 'N/A';
    return `${specs.memory}GB RAM, ${specs.vcpus} vCPU, ${specs.disk}GB SSD`;
  }, []);

  // Function to format price
  const formatPrice = useCallback((price) => {
    if (!price) return 'N/A';
    return `$${price.toFixed(2)}/month`;
  }, []);

  return {
    userDroplets,
    loading,
    error,
    refreshUserDroplets,
    getStatusColor,
    formatSpecs,
    formatPrice
  };
}; 