import { useState, useEffect } from 'react';

export const useUserSnapshots = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserSnapshots = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setSnapshots([]);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/user/snapshots', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSnapshots(data.snapshots || []);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch snapshots');
      }
    } catch (err) {
      console.error('Error fetching user snapshots:', err);
      setError(err.message);
      setSnapshots([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserSnapshots = () => {
    fetchUserSnapshots();
  };

  useEffect(() => {
    fetchUserSnapshots();
  }, []);

  return {
    snapshots,
    loading,
    error,
    refreshUserSnapshots
  };
};

