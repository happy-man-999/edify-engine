import React from "react";

const MainLayout = ({ children }) => (
  <div 
    className="bg-transparent min-h-screen flex flex-col"
    style={{ 
      fontFamily: 'var(--font-family)',
      backgroundColor: 'oklch(0.12 0.02 280)',
      color: 'oklch(0.98 0.01 280)'
    }}
  >
    {children}
  </div>
);

export default MainLayout;
