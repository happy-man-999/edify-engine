import React from "react";

const MainLayout = ({ children }) => (
  <div 
    className="bg-transparent text-gray-800 min-h-screen flex flex-col"
    style={{ fontFamily: 'var(--font-family)' }}
  >
    {children}
  </div>
);

export default MainLayout;
