import { Building2, TrendingUp, Leaf, Target, Package } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  {
    id: 'profile',
    label: 'Account Profile',
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: 'products',
    label: 'Products & Packaging',
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: 'sustainability',
    label: 'Sustainability Overview',
    icon: <Leaf className="w-4 h-4" />,
  },
  {
    id: 'trends',
    label: 'Trends & Regulations',
    icon: <TrendingUp className="w-4 h-4" />,
    disabled: false,
  },
  {
    id: 'strategy',
    label: 'Commercial Strategy',
    icon: <Target className="w-4 h-4" />,
    disabled: false,
  },
];

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-medium overflow-hidden">
      <div className="flex overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              flex items-center gap-3 px-8 py-5 text-base font-semibold transition-all whitespace-nowrap relative
              ${index > 0 ? 'border-l border-gray-200' : ''}
              ${
                activeTab === tab.id
                  ? 'text-red-600 bg-red-50 border-b-3 border-red-600'
                  : tab.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors'
              }
            `}
          >
            <div className={`${activeTab === tab.id ? 'text-red-600' : 'text-gray-500'}`}>
              {tab.icon}
            </div>
            {tab.label}
            {tab.disabled && (
              <span className="text-xs bg-gray-300 text-gray-600 px-3 py-1 rounded-full font-normal">
                Soon
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};