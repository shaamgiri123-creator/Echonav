import React from 'react';
import { Menu, Settings as SettingsIcon, ChevronLeft } from 'lucide-react';
import { TabType } from '../../types/echonav';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onMenuToggle,
}) => {
  return (
    <header className="flex-shrink-0 px-6 pt-1 pb-1 flex items-center justify-between relative z-20">
      {/* Left Action Button */}
      {currentTab === 'settings' ? (
        <button
          onClick={() => onTabChange('home')}
          className="p-1 -ml-1 text-[#0B3821] hover:text-[#16A34A] transition-colors focus:outline-none rounded-lg active:scale-95"
          aria-label="Back to home"
        >
          <ChevronLeft className="w-7 h-7 stroke-[2.4]" />
        </button>
      ) : (
        <button
          onClick={onMenuToggle}
          className="p-1 -ml-1 text-[#0B3821] hover:text-[#16A34A] transition-colors focus:outline-none rounded-lg active:scale-95"
          aria-label="Open menu drawer"
        >
          <Menu className="w-7 h-7 stroke-[2.4]" />
        </button>
      )}

      {/* Center Title / Subtitle */}
      <div className="flex-1 text-center">
        {currentTab === 'home' && (
          <div>
            <h1 className="text-[26px] font-extrabold tracking-tight text-[#0B3821] leading-none">
              Echonav
            </h1>
            <p className="text-xs font-semibold text-[#5F7E6C] mt-1">
              Your Safe Companion
            </p>
          </div>
        )}

        {currentTab === 'history' && (
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0B3821] leading-none py-1">
            Detection History
          </h1>
        )}

        {currentTab === 'settings' && (
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0B3821] leading-none py-1">
            Settings
          </h1>
        )}

        {currentTab === 'about' && (
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0B3821] leading-none py-1">
            About Echonav
          </h1>
        )}
      </div>

      {/* Right Action Button */}
      <div className="w-8 flex justify-end">
        {currentTab === 'home' ? (
          <button
            onClick={() => onTabChange('settings')}
            className="p-1 text-[#0B3821] hover:text-[#16A34A] transition-colors focus:outline-none rounded-lg active:scale-95"
            aria-label="Go to settings"
          >
            <SettingsIcon className="w-6 h-6 stroke-[2.2]" />
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>
    </header>
  );
};
