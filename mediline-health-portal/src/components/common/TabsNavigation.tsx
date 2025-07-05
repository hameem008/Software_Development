import React from 'react';

interface Tab {
  key: string;
  label: string;
}

interface TabsNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.key
                ? 'border-medical-600 text-medical-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabsNavigation;