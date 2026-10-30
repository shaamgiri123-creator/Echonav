import React from 'react';
import { Bluetooth, Battery, Mic, SlidersHorizontal } from 'lucide-react';
import { TabType, DeviceSettings } from '../../types/echonav';

interface DesktopHeaderProps {
  currentTab: TabType;
  settings: DeviceSettings;
  onOpenDemoPanel: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentTab,
  settings,
  onOpenDemoPanel,
}) => {
  const titles = {
    home: {
      title: 'Live Navigation Dashboard',
      subtitle: 'Real-time ultrasonic proximity tracking & assistive multimodal alerts',
    },
    history: {
      title: 'Detection History & Analytics',
      subtitle: 'Obstacle telemetry logs, proximity trends, and historical danger distribution',
    },
    settings: {
      title: 'System Settings & Controls',
      subtitle: 'Configure sensitivity thresholds, vibration intensity, and accessibility preferences',
    },
    about: {
      title: 'About EchoNav Assistive System',
      subtitle: 'Hardware specifications, embedded architecture, and assistive mission',
    },
  };

  const current = titles[currentTab] || titles.home;

  return (
    <header className="hidden md:flex sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-[#E5EFE7] px-6 lg:px-8 py-3.5 items-center justify-between select-none">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-extrabold text-[#0B3821] tracking-tight leading-tight">
          {current.title}
        </h2>
        <p className="text-xs font-medium text-[#5F7E6C] mt-0.5">
          {current.subtitle}
        </p>
      </div>

      {/* Right Telemetry Badges & Testing Action */}
      <div className="flex items-center gap-3">
        {/* Voice alerts indicator */}
        {settings.voiceAlerts && settings.soundNotification && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#0D8249] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Alerts On</span>
          </span>
        )}

        {/* Battery badge */}
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#0B3821] bg-[#F4F9F4] px-2.5 py-1 rounded-full border border-[#D5E6D8]">
          <Battery className="w-3.5 h-3.5 text-[#0D8249]" />
          <span>{settings.batteryPercentage}%</span>
        </span>

        {/* Connection status badge */}
        <span
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
            settings.bluetoothConnected
              ? 'bg-emerald-50 text-[#0D8249] border-emerald-200'
              : 'bg-red-50 text-[#DC2626] border-red-200'
          }`}
        >
          <Bluetooth className="w-3.5 h-3.5" />
          <span>{settings.bluetoothConnected ? 'Connected (Demo BLE)' : 'Disconnected'}</span>
        </span>

        {/* Testing Suite Button */}
        <button
          onClick={onOpenDemoPanel}
          className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#16A34A] hover:bg-[#15803D] px-3.5 py-1.5 rounded-xl shadow-sm transition-all focus:outline-none"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Testing Suite</span>
        </button>
      </div>
    </header>
  );
};
