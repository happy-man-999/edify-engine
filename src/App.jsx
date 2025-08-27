import React, { useMemo, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import StoreFooter from './components/store/StoreFooter';
import ErrorModal from './components/ErrorModal';
import Notification from './components/Notification';
import LoadingSpinner from './components/LoadingSpinner';
import CustomWalletModal from './components/CustomWalletModal';
import AnimatedBackground from './components/AnimatedBackground';
import PaymentModal from './components/PaymentModal';
import Homepage from './pages/Homepage';
import LandingPage from './pages/LandingPage';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import SignupSuccess from './pages/SignupSuccess';
import AuthCallback from './pages/AuthCallback';
import Admin from './pages/Admin';

import { useDispatch, useSelector } from 'react-redux';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
  PhantomWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { checkAndRedirectPhantom, checkAndRedirectCoinbase } from './utils/walletRedirects';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';
import {
  showErrorModal,
  closeErrorModal,
  showNotification,
  clearNotification,
} from './store/uiSlice';
import YesNoModal from './components/YesNoModal';
import { usePaymentModal } from './hooks/usePaymentModal';

import './App.css';

function App() {
  const dispatch = useDispatch();
  const { errorModal, notification } = useSelector(state => state.ui);

  // Global payment modal state
  const { isOpen, paymentData, openPaymentModal, closePaymentModal } = usePaymentModal();

  // Dynamic network configuration from settings
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  const [endpoint, setEndpoint] = useState(clusterApiUrl(WalletAdapterNetwork.Devnet));

  useEffect(() => {
    const fetchNetworkSettings = async () => {
      try {
        const response = await fetch('/api/admin/payment-settings');
        if (response.ok) {
          const settings = await response.json();
          const solanaMode = settings.solanaMode || 'devnet';
          const isTestMode = settings.isTestMode || false;
          
          // If test mode is enabled, force devnet
          const effectiveSolanaMode = isTestMode ? 'devnet' : solanaMode;
          
          const newNetwork = effectiveSolanaMode === 'mainnet' 
            ? WalletAdapterNetwork.Mainnet 
            : WalletAdapterNetwork.Devnet;
          
          setNetwork(newNetwork);
          setEndpoint(clusterApiUrl(newNetwork));
          
          console.log(`Network configured: ${effectiveSolanaMode.toUpperCase()} (Test Mode: ${isTestMode})`);
        }
      } catch (error) {
        console.warn('Failed to fetch Solana network settings, using devnet as fallback:', error);
        // Keep default devnet configuration
      }
    };

    fetchNetworkSettings();
    
    // Set up periodic refresh to check for settings changes
    const interval = setInterval(fetchNetworkSettings, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
              <AnimatedBackground />
              <MainLayout>
                <Routes>
                  <Route path="/home" element={<Navbar />} />
                  <Route path="/store" element={<Navbar />} />
                  <Route path="/cart" element={<Navbar />} />
                  <Route path="/checkout" element={<Navbar />} />
                </Routes>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<Homepage />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup-success" element={<SignupSuccess />} />
                  <Route path="/auth-callback" element={<AuthCallback />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>

                <Routes>
                  <Route path="/home" element={<Footer />} />
                  <Route path="/store" element={<StoreFooter />} />
                </Routes>
                <LoadingSpinner />
                {notification && <Notification message={notification} onClose={() => dispatch(clearNotification())} />}
                <ErrorModal open={errorModal.open} message={errorModal.message} onClose={() => dispatch(closeErrorModal())} />
                <YesNoModal />
                <CustomWalletModal />
                <PaymentModal
                  open={isOpen}
                  onClose={closePaymentModal}
                  {...paymentData}
                />
              </MainLayout>
            </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;