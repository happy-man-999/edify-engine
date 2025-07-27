import React from "react";

export const wallets = [
  {
    name: "MetaMask",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    key: "metamask"
  },
  {
    name: "WalletConnect",
    img: "https://altcoinsbox.com/wp-content/uploads/2023/04/wallet-connect-logo.png",
    key: "walletconnect"
  },
  {
    name: "Coinbase Wallet",
    img: "https://lh3.googleusercontent.com/HE43gZIKp76W3bCaCbPwiTf8uB__YpY8byc4dkb300gNQGDcAraTM4l1uiwfsjhre9rtsHGiok8d3TY11dirxvLq=s60",
    key: "coinbase wallet"
  },
  {
    name: "Phantom",
    img: "https://lh3.googleusercontent.com/dXvdD2VjLS-imsW8WG2oB3y7sBHhL9gFlv7KZnqZSA9_MU1VROSHRpJidav8-a77uQT1-8X_zK5ibsAC39IFn5tn=s60",
    key: "phantom"
  }
];

const WalletModal = ({ open, onClose, onConnect }) => {
  if (!open) return null;
  return (
    <div className="wallet-modal fixed inset-0 bg-black bg-opacity-70 z-[1000] flex justify-center items-center" style={{display:'flex'}}>
      <div className="wallet-modal-content relative bg-white rounded-xl w-full max-w-md p-8 shadow-xl animate-modalFadeIn">
        <span className="close-modal absolute top-4 right-4 text-2xl text-slate-400 cursor-pointer" onClick={onClose}>&times;</span>
        <h2 className="text-2xl font-bold mb-6 text-center">Connect Wallet</h2>
        <p className="text-gray-600 mb-6 text-center">Choose your preferred wallet to connect to Edify Engine</p>
        {wallets.map(w => (
          <div key={w.key} className="wallet-option flex items-center p-4 mb-2 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition" onClick={() => onConnect(w.key)}>
            <img src={w.img} alt={w.name} className="w-8 h-8 mr-4" />
            <span className="font-semibold text-slate-800">{w.name}</span>
          </div>
        ))}
        <p className="text-gray-500 text-sm mt-6 text-center">By connecting, you agree to our <a href="#" className="text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-500">Privacy Policy</a></p>
      </div>
    </div>
  );
};

export default WalletModal;
