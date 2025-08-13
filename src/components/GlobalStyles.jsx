import React from "react";

const GlobalStyles = () => (
  <style>{`
    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
    .world-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .hero-section { background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%); border-radius: 1.5rem; position: relative; overflow: hidden; }
    .sky-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%); z-index: 0; }
    .clouds { position: absolute; width: 100%; height: 100%; background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="500" viewBox="0 0 1440 500"><path fill="%23FFFFFF" fill-opacity="0.7" d="M0 300q60-60 120-60t120 60q60-60 120-60t120 60q60-60 120-60t120 60q60-60 120-60t120 60q60-60 120-60t120 60q60-60 120-60t120 60v200H0z"/><path fill="%23FFFFFF" fill-opacity="0.7" d="M0 250q80-40 160-40t160 40q80-40 160-40t160 40q80-40 160-40t160 40q80-40 160-40t160 40v250H0z"/><path fill="%23FFFFFF" fill-opacity="0.5" d="M0 200q100-30 200-30t200 30q100-30 200-30t200 30q100-30 200-30t200 30v300H0z"/></svg>') repeat-x; animation: cloudAnimation 60s linear infinite; z-index: 1; }
    @keyframes cloudAnimation { 0% { background-position: 0 0; } 100% { background-position: 1440px 0; } }
    .hero-content { position: relative; z-index: 2; }
    .connect-wallet:hover { animation: pulse 1.5s infinite; }
    .logo-video { width: 32px; height: 32px; object-fit: contain; }
    @keyframes glow { 0% { box-shadow: 0 0 5px rgba(66, 103, 125, 0.5); } 50% { box-shadow: 0 0 20px rgba(66, 103, 125, 0.8); } 100% { box-shadow: 0 0 5px rgba(66, 103, 125, 0.5); } }
    .glowing-border { animation: glow 2s infinite ease-in-out; }
    .glowing-border:hover { animation: glow 1s infinite ease-in-out; }
    .wallet-connected { background-color: #42677D; color: white; }
    .spinner { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .world-card { transition: all 0.3s ease; }
    .world-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .email-input { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
    .email-input.show { max-height: 100px; transition: max-height 0.3s ease-in; }
    @keyframes modalFadeIn { 
      from { opacity: 0; transform: scale(0.9) translateY(-20px); } 
      to { opacity: 1; transform: scale(1) translateY(0); } 
    }
    .animate-modalFadeIn { animation: modalFadeIn 0.3s ease-out; }
  `}</style>
);

export default GlobalStyles;
