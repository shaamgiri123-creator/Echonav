import React from 'react';
import { Menu, ChevronLeft, SlidersHorizontal } from 'lucide-react';
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
    <header className="md:hidden flex-shrink-0 px-4 py-2.5 bg-white border-b border-[#E5EFE7] flex items-center justify-between relative z-20">
      {/* Left Action Button */}
      {currentTab === 'settings' ? (
        <button
          onClick={() => onTabChange('home')}
          className="p-1 text-[#0B3821] hover:text-[#16A34A] transition-colors focus:outline-none rounded-lg active:scale-95"
          aria-label="Back to home"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.4]" />
        </button>
      ) : (
        <button
          onClick={onMenuToggle}
          className="p-1 text-[#0B3821] hover:text-[#16A34A] transition-colors focus:outline-none rounded-lg active:scale-95"
          aria-label="Open menu drawer"
        >
          <Menu className="w-6 h-6 stroke-[2.4]" />
        </button>
      )}

      {/* Center Title / Subtitle */}
      <div className="flex-1 text-center">
        {currentTab === 'home' && (
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#0B3821] leading-none">
              Echonav
            </h1>
            <p className="text-[11px] font-semibold text-[#5F7E6C] mt-0.5">
              Your Safe Companion
            </p>
          </div>
        )}

        {currentTab === 'history' && (
          <h1 className="text-lg font-extrabold tracking-tight text-[#0B3821] leading-none py-1">
            Detection History
          </h1>
        )}

        {currentTab === 'settings' && (
          <h1 className="text-lg font-extrabold tracking-tight text-[#0B3821] leading-none py-1">
            Settings
          </h1>
        )}

        {currentTab === 'about' && (
          <h1 className="text-lg font-extrabold tracking-tight text-[#0B3821] leading-none py-1">
            About Echonav
          </h1>
        )}
      </div>

      {/* Right Action Button - Opens Demo Panel */}
      <div className="flex justify-end">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-[#0D8249] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors focus:outline-none rounded-xl active:scale-95 text-[11px] font-bold flex items-center gap-1"
          aria-label="Open Demo Testing Panel"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[10px]">Demo</span>
        </button>
      </div>
    </header>
  );
};
