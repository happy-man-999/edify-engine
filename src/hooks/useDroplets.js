import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDroplets,
  fetchDropletStats,
  fetchDropletById,
  syncDropletStatus,
  restartDroplet,
  backupDroplet,
  terminateDroplet,
  reprovisionDroplet,
  deleteDroplet,
  clearError,
  clearDroplets,
  setSelectedDroplet,
  clearSelectedDroplet
} from '../store/dropletSlice';

export const useDroplets = () => {
  const dispatch = useDispatch();
  const {
    droplets,
    stats,
    pagination,
    loading,
    statsLoading,
    error,
    selectedDroplet
  } = useSelector((state) => state.droplets);

  const loadDroplets = async (filters = {}) => {
    const result = await dispatch(fetchDroplets(filters));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const loadDropletStats = async () => {
    const result = await dispatch(fetchDropletStats());
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const loadDropletById = async (dropletId) => {
    const result = await dispatch(fetchDropletById(dropletId));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const syncDroplet = async (dropletId) => {
    const result = await dispatch(syncDropletStatus(dropletId));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const restartDropletAction = async (dropletId) => {
    const result = await dispatch(restartDroplet(dropletId));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const backupDropletAction = async (dropletId, snapshotName) => {
    const result = await dispatch(backupDroplet({ dropletId, snapshotName }));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const terminateDropletAction = async (dropletId) => {
    const result = await dispatch(terminateDroplet(dropletId));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const reprovisionDropletAction = async (dropletId) => {
    const result = await dispatch(reprovisionDroplet(dropletId));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const deleteDropletAction = async (dropletId) => {
    const result = await dispatch(deleteDroplet(dropletId));
    return {
      success: !result.error,
      error: result.error?.message || result.payload
    };
  };

  const clearDropletError = () => {
    dispatch(clearError());
  };

  const clearDropletData = () => {
    dispatch(clearDroplets());
  };

  const selectDroplet = (droplet) => {
    dispatch(setSelectedDroplet(droplet));
  };

  const clearSelectedDropletData = () => {
    dispatch(clearSelectedDroplet());
  };

  return {
    droplets,
    stats,
    pagination,
    loading,
    statsLoading,
    error,
    selectedDroplet,
    loadDroplets,
    loadDropletStats,
    loadDropletById,
    syncDroplet,
    restartDroplet: restartDropletAction,
    backupDroplet: backupDropletAction,
    terminateDroplet: terminateDropletAction,
    reprovisionDroplet: reprovisionDropletAction,
    deleteDroplet: deleteDropletAction,
    clearError: clearDropletError,
    clearDroplets: clearDropletData,
    selectDroplet,
    clearSelectedDroplet: clearSelectedDropletData
  };
}; 