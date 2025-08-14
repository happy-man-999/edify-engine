import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { homepageTabs, storeTabs } from './tabs';
import HomepageAction from './HomepageAction'
import StoreAction from './StoreAction'
import { useAuth } from '../../hooks/useAuth';

const NavbarTabs = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  let tabs = location.pathname === '/store' ? storeTabs : homepageTabs;
  
  // Filter out "Sign In" tab if user is authenticated
  if (isAuthenticated) {
    tabs = tabs.filter(tab => tab.title !== "Sign In");
  }
  
  return (
    <>
      {tabs.map((tab, id) => (
        <Link key={id} to={tab.href} className="hover:text-[#5E8EA9] transition-colors duration-300 text-gray-700">
          {tab.title}
        </Link>
      ))}
    </>
  );
};

const NavbarAction = () => {
  const location = useLocation();
  
  return location.pathname === '/store' ? <StoreAction /> : <HomepageAction />;
};

const Navbar = () => (
  <nav className="glass navbar navbar-fixed border-b border-gray-200 px-6 py-4 flex items-center justify-between backdrop-blur-md">
    <div className="w-full flex items-center space-x-4">
      <a href="/" className="flex items-center">
        <video autoPlay loop muted playsInline className="logo-video mr-2" width={32} height={32}>
          <source src="https://labor-group.com/wp-content/uploads/2025/04/EE_Logo_Color_512x512_02-1.mp4" type="video/mp4" />
        </video>
      </a>
      <div className="hidden md:flex space-x-6">
        <NavbarTabs />
      </div>
      <div className="flex-1" />
      <NavbarAction />
    </div>
  </nav>
);

export default Navbar;
