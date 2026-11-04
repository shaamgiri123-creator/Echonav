import React from 'react';
import { Menu, ChevronLeft, SlidersHorizontal, Mic, ShieldAlert } from 'lucide-react';
import { TabType } from '../../types/echonav';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onMenuToggle: () => void;
  onOpenVoiceAssistant?: () => void;
  onTriggerSOS?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onMenuToggle,
  onOpenVoiceAssistant,
  onTriggerSOS,
}) => {
  return (
    <header className="md:hidden flex-shrink-0 px-3 py-2 bg-white border-b border-[#E5EFE7] flex items-center justify-between relative z-20">
      {/* Left Action Button (Min 44x44px Touch Target) */}
      {currentTab === 'settings' ? (
        <button
          onClick={() => onTabChange('home')}
          className="min-w-[44px] min-h-[44px] p-2 text-[#0B3821] hover:text-[#16A34A] transition-colors rounded-xl flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#0D8249] active:scale-95"
          aria-label="Back to home"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.4]" />
        </button>
      ) : (
        <button
          onClick={onMenuToggle}
          className="min-w-[44px] min-h-[44px] p-2 text-[#0B3821] hover:text-[#16A34A] transition-colors rounded-xl flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#0D8249] active:scale-95"
          aria-label="Open menu drawer"
        >
          <Menu className="w-6 h-6 stroke-[2.4]" />
        </button>
      )}

      {/* Center Title / Subtitle */}
      <div className="flex-1 text-center px-1">
        {currentTab === 'home' && (
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-[#0B3821] leading-none">
              Echonav
            </h1>
            <p className="text-[10px] font-semibold text-[#5F7E6C] mt-0.5">
              Your Safe Companion
            </p>
          </div>
        )}

        {currentTab === 'history' && (
          <h1 className="text-base font-extrabold tracking-tight text-[#0B3821] leading-none py-1">
            Detection History
          </h1>
        )}

        {currentTab === 'settings' && (
          <h1 className="text-base font-extrabold tracking-tight text-[#0B3821] leading-none py-1">
            Settings
          </h1>
        )}

        {currentTab === 'about' && (
          <h1 className="text-base font-extrabold tracking-tight text-[#0B3821] leading-none py-1">
            About Echonav
          </h1>
        )}
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Voice Assistant Shortcut */}
        {onOpenVoiceAssistant && (
          <button
            onClick={onOpenVoiceAssistant}
            className="min-h-[44px] min-w-[44px] p-2 text-[#0D8249] hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#0D8249]"
            aria-label="Open Voice Assistant"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}

        {/* SOS Emergency Shortcut */}
        {onTriggerSOS && (
          <button
            onClick={onTriggerSOS}
            className="min-h-[44px] min-w-[44px] p-2 text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-600"
            aria-label="Trigger Emergency SOS"
          >
            <ShieldAlert className="w-5 h-5" />
          </button>
        )}

        {/* Demo Button */}
        <button
          onClick={onMenuToggle}
          className="min-h-[44px] px-2 text-[#0A6035] bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors rounded-xl active:scale-95 text-xs font-bold flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#0D8249]"
          aria-label="Open Demo Testing Panel"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
