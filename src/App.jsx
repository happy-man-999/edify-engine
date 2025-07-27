import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import StoreFooter from './components/store/StoreFooter';
import ErrorModal from './components/ErrorModal';
import WalletModal from './components/WalletModal';
import Notification from './components/Notification';
import Homepage from './pages/Homepage';
import Store from './pages/Store';

import {
  useAccount,
  useConnect,
} from 'wagmi';

import { useDispatch, useSelector } from 'react-redux';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  closeWalletModal,
  showErrorModal,
  closeErrorModal,
  showNotification,
} from './store/uiSlice';
import {
  setAddress as setPhantomAddress,
  connected as phantomConnected,
  setBalance as setPhantomBalance,
  setBalanceLoading as setPhantomLoading,
} from './store/phantomSlice';
import YesNoModal from './components/YesNoModal';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { walletModalOpen, errorModal, notification } = useSelector(state => state.ui);

  const { connect, connectors, status, error } = useConnect();
  const { connector } = useAccount();

  // Initialize Phantom wallet connection if already connected
  useEffect(() => {
    if (localStorage.getItem('phantomAddress')) {
      handleConnect('phantom')
    }
  }, [])

  const fetchPhanTomBalance = async (walletAddress) => {
    dispatch(setPhantomLoading(true));
    const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');
    const publicKey = new PublicKey(walletAddress);
    try {
      const walletBalance = await connection.getBalance(publicKey);
      dispatch(setPhantomBalance(walletBalance / 1e9)); // Convert lamports to SOL
    } catch (err) {
      console.error('Error fetching balance:', err);
      dispatch(showErrorModal(err?.message || 'Failed fetching balance'));
    } finally {
      dispatch(setPhantomLoading(false));
    }
  };
  const handleConnect = async (connectorName) => {
    if (connectorName === 'phantom') {
      if (window.solana && window.solana.isPhantom) {
        try {
          // Request connection to Phantom
          const resp = await window.solana.connect();
          dispatch(setPhantomAddress(resp.publicKey.toString()));
          //fetchPhanTomBalance(resp.publicKey.toString());
          dispatch(phantomConnected());
          console.log('Connected to Phantom:', resp.publicKey.toString());
          dispatch(showNotification(`Connected to Phantom`));
          dispatch(closeWalletModal());
        } catch (err) {
          console.error('Failed to connect Phantom:', err);
          dispatch(showErrorModal(err?.message || 'Wallet connection failed'));
        }
      } else {
        dispatch(showErrorModal(<>
          Phantom extension not found. Please install it from
          <br />
          <a href="https://phantom.app/" target="_blank">
            <p className="text-blue-800 hover:underline">
              https://phantom.app/
            </p>
          </a>
        </>));
      }
    }
    else {
      const connector = connectors.find(connector => {
        return connector.name.toLowerCase() === connectorName.toLowerCase();
      });
      if (connector) {
        connect(
          { connector },
          {
            onSuccess: () => {
              dispatch(showNotification(`Connected to ${connector.name}`));
              dispatch(closeWalletModal());
            },
            onError: (err) => {
              console.error('Connection error:', err);
              dispatch(showErrorModal(err?.message || 'Wallet connection failed'));
            },
          }
        );
      }
    }
  };

  return (
    <Router>
      <MainLayout>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/store" element={<Store />} />
        </Routes>

        <Routes>
          <Route path="/" element={<Footer />} />
          <Route path="/store" element={<StoreFooter />} />
        </Routes>
        {notification && <Notification message={notification} onClose={() => dispatch(clearNotification())} />}
        <WalletModal open={walletModalOpen} onClose={() => dispatch(closeWalletModal())} onConnect={handleConnect} />
        <ErrorModal open={errorModal.open} message={errorModal.message} onClose={() => dispatch(closeErrorModal())} />
        <YesNoModal />
      </MainLayout>
    </Router>
  );
}

export default App;