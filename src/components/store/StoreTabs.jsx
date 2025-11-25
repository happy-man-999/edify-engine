import React from "react";

const tabs = [
  //"Featured",
  "Apps",
  //"Bundles",
  "World Templates",
  "3D Objects",
  //"Textures",
  //"Animations",
  "My Purchases"
];

const StoreTabs = ({ activeTab, onTabClick }) => (
  <div className="flex overflow-x-auto pb-2 space-x-8 border-b mb-6" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
    {tabs.map(tab => (
      <button
        key={tab}
        className="relative pb-2 font-medium whitespace-nowrap transition"
        style={activeTab === tab ? {
          color: 'oklch(0.45 0.15 290)'
        } : {
          color: 'oklch(0.65 0.05 280)'
        }}
        onMouseEnter={(e) => {
          if (activeTab !== tab) {
            e.currentTarget.style.color = 'oklch(0.45 0.15 290)';
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== tab) {
            e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
          }
        }}
        onClick={() => onTabClick(tab)}
      >
        {tab}
        {activeTab === tab && (
          <span 
            className="absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300"
            style={{ backgroundColor: 'oklch(0.45 0.15 290)' }}
          />
        )}
      </button>
    ))}
  </div>
);

export default StoreTabs;
