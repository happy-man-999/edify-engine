import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

// Get Solana network configuration from settings
const getSolanaNetwork = async () => {
  try {
    const response = await fetch('/api/admin/payment-settings');
    if (response.ok) {
      const { settings } = await response.json();
      const solanaMode = settings.solanaMode || 'devnet';
      const isTestMode = settings.isTestMode || false;
      
      // If test mode is enabled, force devnet
      if (isTestMode) {
        console.log('Test mode enabled, using Solana devnet');
        return 'devnet';
      }
      
      console.log(`Using Solana network: ${solanaMode.toUpperCase()}`);
      return solanaMode;
    }
  } catch (error) {
    console.warn('Failed to fetch Solana network settings, using devnet as fallback:', error);
  }
  return 'devnet'; // Default fallback
};

// Get Solana RPC endpoint based on network
const getSolanaEndpoint = (network) => {
  if (network === 'mainnet') {
    // Use Helius RPC for mainnet - API key should be in .env file
    const heliusApiKey = import.meta.env.VITE_HELIUS_API_KEY;
    if (!heliusApiKey) {
      console.warn('Helius API key not found in environment variables');
      // Fallback to a free endpoint if no API key
      return 'https://ssc-dao.genesysgo.net/';
    }
    return `https://rpc.helius.xyz/?api-key=${heliusApiKey}`;
  }
  return 'https://api.devnet.solana.com';
};

export const useSolBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const [error, setError] = useState(null);
  const { connected, publicKey } = useWallet();

  const fetchBalance = async () => {
    if (!connected || !publicKey) {
      setBalance(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get network configuration
      const network = await getSolanaNetwork();
      const endpoint = getSolanaEndpoint(network);
      
      const connection = new Connection(endpoint);
      
      // Get balance in lamports
      const lamports = await connection.getBalance(publicKey);
      
      // Convert lamports to SOL (1 SOL = 1e9 lamports)
      const solBalance = lamports / 1e9;
      
      setBalance(solBalance);
    } catch (err) {
      console.error('Error fetching SOL balance:', err);
      setError(err.message);
      setBalance(0);
    } finally {
      setLoading(false);
      setFirstLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    
    // Refresh balance every 30 seconds when connected
    const interval = connected ? setInterval(fetchBalance, 30000) : null;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connected, publicKey]);

  return {
    balance,
    loading,
    firstLoading,
    error,
    refreshBalance: fetchBalance
  };
};
