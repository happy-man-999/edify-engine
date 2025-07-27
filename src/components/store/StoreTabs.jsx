import React from "react";

const tabs = [
  "Featured",
  "Apps",
  "Bundles",
  "World Templates",
  "3D Objects",
  "Textures",
  "Animations",
  "My Purchases"
];

const StoreTabs = ({ activeTab, onTabClick }) => (
  <div className="flex overflow-x-auto pb-2 space-x-8 border-b border-gray-200 mb-6">
    {tabs.map(tab => (
      <button
        key={tab}
        className={`tab-underline pb-2 font-medium whitespace-nowrap transition ${activeTab === tab ? 'active text-[#42677D]' : 'hover:text-[#42677D]'}`}
        onClick={() => onTabClick(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default StoreTabs;
