import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/payment-settings');
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      } else if (response.status === 401) {
        setError('Authentication required');
      } else {
        setError(`Failed to fetch settings: ${response.status}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const refreshSettings = () => {
    if (user) {
      fetchSettings();
    }
  };

  return {
    settings,
    loading,
    error,
    refreshSettings,
    // Convenience getters for commonly used settings
    stripePublicKey: settings?.stripePublicKey || null,
    stripeSecretKey: settings?.stripeSecretKey || null,
    solanaWalletAddress: settings?.solanaWalletAddress || null,
    defaultSnapshotId: settings?.defaultSnapshotId || null,
    defaultDnsDomain: settings?.defaultDnsDomain || null,
    stripeMode: settings?.stripeMode || 'live',
    solanaMode: settings?.solanaMode || 'mainnet',
    isTestMode: settings?.isTestMode || false
  };
}; 