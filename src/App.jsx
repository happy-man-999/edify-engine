import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import StoreFooter from './components/store/StoreFooter';
import ErrorModal from './components/ErrorModal';
import Notification from './components/Notification';
import LoadingSpinner from './components/LoadingSpinner';
import CustomWalletModal from './components/CustomWalletModal';
import Homepage from './pages/Homepage';
import Store from './pages/Store';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import SignupSuccess from './pages/SignupSuccess';
import AuthCallback from './pages/AuthCallback';

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
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { errorModal, notification } = useSelector(state => state.ui);

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

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
            <AuthProvider>
              <MainLayout>
              <Routes>
                <Route path="/" element={<Navbar />} />
                <Route path="/store" element={<Navbar />} />
              </Routes>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/store" element={<Store />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup-success" element={<SignupSuccess />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
              </Routes>

              <Routes>
                <Route path="/" element={<Footer />} />
                <Route path="/store" element={<StoreFooter />} />
              </Routes>
              <LoadingSpinner />
              {notification && <Notification message={notification} onClose={() => dispatch(clearNotification())} />}
              <ErrorModal open={errorModal.open} message={errorModal.message} onClose={() => dispatch(closeErrorModal())} />
              <YesNoModal />
              <CustomWalletModal />
            </MainLayout>
            </AuthProvider>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;