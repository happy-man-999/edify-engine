import React from "react";

const Navbar = ({ onProfileClick }) => (
  <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <video autoPlay loop muted playsInline className="logo-video mr-2" width={32} height={32}>
          <source src="https://labor-group.com/wp-content/uploads/2025/04/EE_Logo_Color_512x512_02-1.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hidden md:flex space-x-6">
        <a href="#" className="hover:text-[#42677D] transition">Dashboard</a>
        <a href="#" className="hover:text-[#42677D] transition">Explore</a>
        <a href="#" className="hover:text-[#42677D] transition">Store</a>
        <a href="#" className="hover:text-[#42677D] transition">Login</a>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <button onClick={() => window.location.href='https://form.typeform.com/to/KmQr2jrU'} className="bg-[#42677D] hover:bg-[#355263] text-white px-4 py-2 rounded-md transition shadow-sm">
        <i className="fas fa-plus mr-2"></i> New World
      </button>
      <div id="profileIcon" className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer connect-wallet" onClick={onProfileClick}>
        <i className="fas fa-wallet"></i>
      </div>
    </div>
  </nav>
);

export default Navbar;
