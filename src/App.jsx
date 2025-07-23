import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import GlobalStyles from './components/GlobalStyles';

function App() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  return (
    <MainLayout>
      <GlobalStyles />
      <Navbar onProfileClick={() => setWalletModalOpen(true)} />
      <Homepage />
      <Footer />
      {/* Wallet modal and other modals would go here as components */}
      {/* {walletModalOpen && <WalletModal onClose={() => setWalletModalOpen(false)} />} */}
    </MainLayout>
  );
}

export default App;