import React, { useState, createContext, useContext } from 'react';

const TabsContext = createContext(null);

const Tabs = ({ defaultValue, className = '', children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || 'all');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = '' }) => {
  // Check if className contains 'grid' to determine layout
  const isGrid = className.includes('grid');
  const baseClasses = isGrid 
    ? `rounded-lg p-1 border ${className}`
    : `inline-flex rounded-lg p-1 border ${className}`;
  
  return (
    <div 
      className={baseClasses}
      style={{
        backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
        borderColor: 'oklch(0.25 0.05 285 / 0.5)'
      }}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, children, className = '' }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'text-white'
          : 'text-gray-300 hover:text-white'
      } ${className}`}
      style={isActive ? {
        backgroundColor: 'oklch(0.45 0.15 290)',
        color: 'white'
      } : {
        color: 'rgb(209, 213, 219)'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
          e.currentTarget.style.color = 'white';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'rgb(209, 213, 219)';
        }
      }}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className = '' }) => {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

