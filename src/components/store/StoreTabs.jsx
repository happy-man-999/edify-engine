import React from "react";

const tabs = [
  //"Featured",
  "Apps",
  //"Bundles",
  //"World Templates",
  "3D Objects",
  //"Textures",
  //"Animations",
  "My Purchases"
];

const StoreTabs = ({ activeTab, onTabClick }) => (
  <div className="flex overflow-x-auto pb-2 space-x-8 border-b border-gray-200 mb-6">
    {tabs.map(tab => (
      <button
        key={tab}
        className={`relative pb-2 font-medium whitespace-nowrap transition ${
          activeTab === tab 
            ? 'text-[#42677D] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#42677D] after:transition-all after:duration-300' 
            : 'hover:text-[#42677D] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#42677D] hover:after:w-full after:transition-all after:duration-300'
        }`}
        onClick={() => onTabClick(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default StoreTabs;
