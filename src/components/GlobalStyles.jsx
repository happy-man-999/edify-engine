import React from "react";

const GlobalStyles = () => (
  <style>{`
    /* Color Variables - Match Design Exactly */
    :root {
      --color-background: oklch(0.12 0.02 280);
      --color-foreground: oklch(0.98 0.01 280);
      --color-card: oklch(0.18 0.05 285);
      --color-card-foreground: oklch(0.98 0.01 280);
      --color-primary: oklch(0.45 0.15 290);
      --color-primary-foreground: oklch(1 0 0);
      --color-secondary: oklch(0.50 0.18 260);
      --color-secondary-foreground: oklch(1 0 0);
      --color-muted: oklch(0.25 0.04 285);
      --color-muted-foreground: oklch(0.65 0.05 280);
      --color-accent: oklch(0.85 0.18 130);
      --color-accent-foreground: oklch(0.12 0.02 280);
      --color-border: oklch(0.25 0.05 285);
      --color-ring: oklch(0.70 0.12 240);
    }

    /* Font Configuration - Match Design */
    body {
      font-family: 'Inter', sans-serif;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Orbitron', sans-serif;
    }

    /* Gradient Text */
    .gradient-text {
      background: linear-gradient(135deg, oklch(0.70 0.12 240), oklch(0.45 0.15 290));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Glow Effects */
    .glow-effect {
      box-shadow: 0 0 20px oklch(0.45 0.15 290 / 0.3);
    }

    .glow-accent {
      box-shadow: 0 0 30px oklch(0.85 0.18 130 / 0.4);
    }

    /* Dark Theme Scrollbar - Match Design */
    ::-webkit-scrollbar { 
      width: 10px; 
      height: 10px;
    }

    ::-webkit-scrollbar-track { 
      background: oklch(0.12 0.02 280 / 0.5);
      border-radius: 8px;
      margin: 2px;
    }

    ::-webkit-scrollbar-thumb { 
      background: linear-gradient(135deg, oklch(0.45 0.15 290), oklch(0.50 0.18 260));
      border-radius: 8px;
      border: 2px solid transparent;
      background-clip: content-box;
      transition: all 0.3s ease;
    }

    ::-webkit-scrollbar-thumb:hover { 
      background: linear-gradient(135deg, oklch(0.50 0.18 260), oklch(0.45 0.15 290));
      transform: scale(1.1);
    }

    ::-webkit-scrollbar-corner {
      background: transparent;
    }

    /* Firefox scrollbar */
    * {
      scrollbar-width: thin;
      scrollbar-color: oklch(0.45 0.15 290) oklch(0.12 0.02 280 / 0.5);
    }

    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }

    /* Logo video */
    .logo-video { 
      width: 32px; 
      height: 32px; 
      object-fit: contain; 
    }

    /* Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(66, 103, 125, 0.3); }
      50% { box-shadow: 0 0 30px rgba(66, 103, 125, 0.6); }
    }

    .animate-float {
      animation: float 3s ease-in-out infinite;
    }

    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }

    @keyframes glow {
      0% { box-shadow: 0 0 5px rgba(66, 103, 125, 0.5); }
      50% { box-shadow: 0 0 20px rgba(66, 103, 125, 0.8); }
      100% { box-shadow: 0 0 5px rgba(66, 103, 125, 0.5); }
    }

    .glowing-border { 
      animation: glow 2s infinite ease-in-out; 
    }

    .glowing-border:hover { 
      animation: glow 1s infinite ease-in-out; 
    }

    @keyframes spin { 
      to { transform: rotate(360deg); } 
    }

    .spinner { 
      width: 24px; 
      height: 24px; 
      border: 3px solid rgba(255,255,255,.3); 
      border-radius: 50%; 
      border-top-color: white; 
      animation: spin 1s ease-in-out infinite; 
    }

    /* World card hover effect */
    .world-card { 
      transition: all 0.3s ease; 
    }

    .world-card:hover { 
      transform: translateY(-5px); 
      box-shadow: 0 10px 20px rgba(0,0,0,0.1); 
    }

    /* Email input animation */
    .email-input { 
      max-height: 0; 
      overflow: hidden; 
      transition: max-height 0.3s ease-out; 
    }

    .email-input.show { 
      max-height: 100px; 
      transition: max-height 0.3s ease-in; 
    }

    /* Modal animations */
    @keyframes modalFadeIn { 
      from { opacity: 0; transform: scale(0.9) translateY(-20px); } 
      to { opacity: 1; transform: scale(1) translateY(0); } 
    }

    .animate-modalFadeIn { 
      animation: modalFadeIn 0.3s ease-out; 
    }

    /* Navbar fixed positioning */
    .navbar-fixed {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
    }

    /* Ensure body doesn't have horizontal scroll */
    body {
      overflow-x: hidden;
    }
  `}</style>
);

export default GlobalStyles;
