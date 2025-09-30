import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDroplets } from '../store/dropletSlice';

export const useUserDroplets = () => {
  const dispatch = useDispatch();
  const { userDroplets, userDropletsLoading, userDropletsError } = useSelector((state) => state.droplets);
  const { token } = useSelector((state) => state.auth);

  // Fetch user droplets on mount and when token changes
  useEffect(() => {
    if (token) {
      dispatch(fetchUserDroplets());
    }
  }, [dispatch, token]);

  // Function to refresh user droplets
  const refreshUserDroplets = useCallback(() => {
    if (token) {
      dispatch(fetchUserDroplets());
    }
  }, [dispatch, token]);

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
    loading: userDropletsLoading,
    error: userDropletsError,
    refreshUserDroplets,
    getStatusColor,
    formatSpecs,
    formatPrice
  };
}; 