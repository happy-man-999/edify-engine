import { useState, useEffect, useCallback } from 'react';
import entri from 'entrijs';
import { isSubdomain, getDnsHost } from '../utils/domainUtils';

export const useEntri = (handleOnEntriClose) => {
  useEffect(() => {
    window.addEventListener('onEntriClose', handleOnEntriClose, false);

    return () => {
      window.removeEventListener('onEntriClose', handleOnEntriClose, false);
    }
  }, []);

  const clearAuthToken = useCallback(() => {
    setAuthToken(null);
    setError(null);
  }, []);

  const getAuthToken = useCallback(async () => {
    try {
      const response = await fetch('/api/dns/entri/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.auth_token) {
        return data.auth_token;
      } else {
        throw new Error(data.message || 'No auth token received from backend');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to authenticate with Entri';
      console.error('Entri authentication error:', err);
      throw err;
    }
  }, []);

  const proceedWithEntri = useCallback(async (domain, dropletIP) => {
    const token = await getAuthToken();
    
    // Use utility function to get the correct host for DNS records
    const host = getDnsHost(domain);
    
    const config = {
      applicationId: import.meta.env.VITE_ENTRI_APPLICATION_ID,
      token: token,
      prefilledDomain: domain,
      dnsRecords: [
        {
          type: "A",
          host: host,
          value: dropletIP,
          ttl: 300,
        },
      ],
    };

    entri.showEntri(config);
  }, [getAuthToken]);

  return {
    proceedWithEntri,
  };
};
