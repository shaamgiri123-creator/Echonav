import React from 'react';
import { Home, BarChart2, Settings, Info } from 'lucide-react';
import { TabType } from '../../types/echonav';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
}) => {
  const navItems: { tab: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'history', label: 'History', icon: BarChart2 },
    { tab: 'settings', label: 'Settings', icon: Settings },
    { tab: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E5EFE7] px-6 pt-2 pb-3.5 flex items-center justify-between shadow-[0_-4px_16px_rgba(11,56,33,0.05)]"
      aria-label="Mobile Bottom Navigation"
    >
      {navItems.map(({ tab, label, icon: Icon }) => {
        const isActive = currentTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex flex-col items-center justify-center py-0.5 px-3 transition-colors duration-150 rounded-xl focus:outline-none ${
              isActive
                ? 'text-[#0D8249]'
                : 'text-[#8B9E94] hover:text-[#52705E]'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className={`w-6 h-6 transition-transform duration-150 ${
                isActive ? 'scale-105 stroke-[2.4] fill-[#0D8249]/15' : 'stroke-[1.9]'
              }`}
            />
            <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
