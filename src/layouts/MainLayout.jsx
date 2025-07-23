import React from "react";

const MainLayout = ({ children }) => (
  <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col">
    {children}
  </div>
);

export default MainLayout;
