import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { tabs as allTabs, premiumTabs } from './tabs';
import StoreAction from './StoreAction'
import { useAuth } from '../../hooks/useAuth';

const NavbarTabs = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  
  let tabs = allTabs;
  
  // Filter out "Sign In" and "Try" tabs if user is authenticated
  if (isAuthenticated) {
    tabs = tabs.filter(tab => tab.title !== "Sign In" && tab.title !== "Demo");
    
    // Add role-based tabs
    if (user?.isContributor) {
      tabs.push({ title: "Contribute", href: "/contribute" });
    }
    
    if (user?.role === 'admin') {
      tabs.push({ title: "Admin Dashboard", href: "/admin" });
    }
    
    // Add premium tabs for premium plan users
    if (user?.plan === 'premium') {
      tabs.push(...premiumTabs);
    }
  }
  
  return (
    <>
      {tabs.map((tab, id) => {
        
        // Handle external links
        if (tab.external) {
          return (
            <a
              key={id}
              href={tab.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 text-gray-300"
              onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
            >
              {tab.title}
            </a>
          );
        }
        
        // Handle internal links
        return (
          <Link 
            key={id} 
            to={tab.href} 
            className="transition-colors duration-300 text-gray-300"
            onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
          >
            {tab.title}
          </Link>
        );
      })}
    </>
  );
};

const NavbarAction = () => {
  return <StoreAction />;
};

const Navbar = () => (
  <nav 
    className="navbar navbar-fixed border-b px-6 py-4 flex items-center justify-between backdrop-blur-md"
    style={{
      borderColor: 'oklch(0.25 0.05 285 / 0.5)',
      backgroundColor: 'oklch(0.12 0.02 280 / 0.95)'
    }}
  >
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
