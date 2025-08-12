import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { changeCurrency } from '../store/uiSlice';
import { useDispatch } from 'react-redux';

export const useCurrency = () => {
  const { currency } = useSelector((state) => state.ui);
  const [solPrice, setSolPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  // Fetch current SOL price in USD
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch SOL price');
        }
        
        const data = await response.json();
        setSolPrice(data.solana.usd);
        setError(null);
      } catch (err) {
        console.error('Error fetching SOL price:', err);
        setError(err.message);
        // Fallback to a reasonable default price
        setSolPrice(100); // Default fallback price
      } finally {
        setLoading(false);
      }
    };

    fetchSolPrice();
    
    // Refresh price every 5 minutes
    const interval = setInterval(fetchSolPrice, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const showPrice = (price) => {
    if (currency === 'USD') {
      return price;
    }
    // Convert USD to SOL using current exchange rate
    return solPrice ? price / solPrice : null;
  };

  const convertUsdToSol = (usdAmount) => {
    if (!solPrice) return null;
    return usdAmount / solPrice;
  };

  const convertSolToUsd = (solAmount) => {
    if (!solPrice) return null;
    return solAmount * solPrice;
  };

  const getCurrentSolPrice = () => solPrice;

  const toggleCurrency = () => {
    if (currency === 'USD') {
      dispatch(changeCurrency('SOL'));
    } else {
      dispatch(changeCurrency('USD'));
    }
  };

  return { 
    showPrice, 
    convertUsdToSol, 
    convertSolToUsd, 
    getCurrentSolPrice,
    loading,
    error,
    solPrice,
    currency,
    toggleCurrency
  };
};