// Utility functions to handle wallet redirects when wallets aren't installed

export const checkAndRedirectPhantom = () => {
  if (!window.solana || !window.solana.isPhantom) {
    window.open('https://phantom.app/', '_blank');
    const errorMessage = 'Phantom wallet is not installed. Please install it from https://phantom.app/';
    throw new Error(errorMessage);
  }
  return true;
};

export const checkAndRedirectCoinbase = () => {
  if (!window.coinbaseWalletExtension) {
    window.open('https://wallet.coinbase.com/', '_blank');
    const errorMessage = 'Coinbase Wallet is not installed. Please install it from https://wallet.coinbase.com/';
    throw new Error(errorMessage);
  }
  return true;
};