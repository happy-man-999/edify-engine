import React from "react";

const StoreGlobalStyles = () => (
  <style>{`
    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
    .gradient-text { background: linear-gradient(90deg, #42677D, #5E8EA9); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .preview-container { perspective: 1000px; transform-style: preserve-3d; }
    .store-item { transition: all 0.3s ease; }
    .store-item:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
    .featured-item { animation: float 4s ease-in-out infinite; }
    .tab-underline { position: relative; }
    .tab-underline::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background: #42677D; transition: width 0.3s ease; }
    .tab-underline:hover::after { width: 100%; }
    .tab-underline.active::after { width: 100%; }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    .currency-toggle-container { display: flex; align-items: center; gap: 8px; }
    .currency-toggle { position: relative; display: inline-block; width: 70px; height: 34px; }
    .currency-toggle input { opacity: 0; width: 0; height: 0; }
    .currency-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #42677D; transition: .4s; border-radius: 34px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); }
    .currency-slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #42677D; font-size: 14px; }
    input:checked + .currency-slider { background-color: #f7931a; }
    input:checked + .currency-slider:before { transform: translateX(36px); color: #f7931a; }
    .usd-icon, .btc-icon { position: absolute; top: 50%; transform: translateY(-50%); color: white; font-weight: bold; font-size: 14px; }
    .usd-icon { left: 10px; }
    .btc-icon { right: 10px; }
    .active-currency { font-weight: bold; color: #42677D; }
    .btc-active .active-currency { color: #f7931a; }
    .bundle-card { background: linear-gradient(135deg, #42677D 0%, #5E8EA9 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(66, 103, 125, 0.2); }
    .bundle-badge { position: absolute; top: 16px; right: 16px; background: #f7931a; color: white; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 14px; transform: rotate(5deg); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .countdown-timer { background: rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 12px; display: inline-flex; align-items: center; }
    .countdown-number { font-weight: bold; font-size: 18px; margin: 0 4px; color: white; }
    .value-box { background: rgba(255,255,255,0.2); border-radius: 8px; padding: 8px 12px; display: inline-block; }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
    .pulse { animation: pulse 2s infinite; }
    .wallet-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 1000; justify-content: center; align-items: center; }
    .wallet-modal-content { background-color: white; border-radius: 12px; width: 90%; max-width: 400px; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: modalFadeIn 0.3s ease-out; }
    @keyframes modalFadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    .wallet-option { display: flex; align-items: center; padding: 15px; margin-bottom: 10px; border-radius: 8px; background-color: #f8fafc; cursor: pointer; transition: all 0.2s ease; }
    .wallet-option:hover { background-color: #f1f5f9; transform: translateY(-2px); }
    .wallet-option img { width: 32px; height: 32px; margin-right: 15px; }
    .wallet-option span { font-weight: 600; color: #1e293b; }
    .close-modal { position: absolute; top: 15px; right: 15px; font-size: 24px; color: #64748b; cursor: pointer; }
  `}</style>
);

export default StoreGlobalStyles;
