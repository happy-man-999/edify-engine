import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { homepageTabs, storeTabs } from './tabs';
import HomepageAction from './HomepageAction'
import StoreAction from './StoreAction'

const routeWithTabs = (path, tabs) => (
  <Route 
    path={path}
    element={<>
      {tabs.map((tab, id) => (
        <Link key={id} to={tab.href} className="hover:text-[#42677D] transition">
          {tab.title}
        </Link>
      ))}
    </>}
  >
  </Route>
)

const Navbar = () => (
  <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    <div className="w-full flex items-center space-x-4">
      <a href="/" className="flex items-center">
        <video autoPlay loop muted playsInline className="logo-video mr-2" width={32} height={32}>
          <source src="https://labor-group.com/wp-content/uploads/2025/04/EE_Logo_Color_512x512_02-1.mp4" type="video/mp4" />
        </video>
      </a>
      <div className="hidden md:flex space-x-6">
        <Routes>
          {routeWithTabs("/", homepageTabs)}
          {routeWithTabs("/store", storeTabs)}
        </Routes>
      </div>
      <div className="flex-1" />
      <Routes>
        <Route path="/" element={<HomepageAction />} />
        <Route path="/store" element={<StoreAction />} />
      </Routes>
    </div>
  </nav>
);

export default Navbar;
