import React from 'react';
import { Bluetooth, Battery, Mic, SlidersHorizontal, Eye, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { TabType, DeviceSettings } from '../../types/echonav';

interface DesktopHeaderProps {
  currentTab: TabType;
  settings: DeviceSettings;
  onOpenDemoPanel: () => void;
  isOnline?: boolean;
  onOpenVoiceAssistant?: () => void;
  onOpenVision?: () => void;
  onTriggerSOS?: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentTab,
  settings,
  onOpenDemoPanel,
  isOnline = true,
  onOpenVoiceAssistant,
  onOpenVision,
  onTriggerSOS,
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

      {/* Right Telemetry Badges & Smart Actions */}
      <div className="flex items-center gap-2.5">
        {/* Offline / Online Network Indicator */}
        <span
          className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
            isOnline
              ? 'bg-emerald-50 text-[#0D8249] border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}
          title={isOnline ? 'Online - Local telemetry synchronized' : 'Offline - Running locally with Cache storage'}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-[#0D8249]" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-700" />
              <span>Offline (Saved Locally)</span>
            </>
          )}
        </span>

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

        {/* Voice Assistant Trigger */}
        {onOpenVoiceAssistant && (
          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0B3821] bg-[#EAF6ED] hover:bg-[#D5EED8] border border-[#CDE7D2] px-3 py-1.5 rounded-xl shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-[#0D8249]"
            title="Open Voice Assistant (Push-to-Talk)"
            aria-label="Open Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-[#0D8249]" />
            <span>Voice</span>
          </button>
        )}

        {/* AI Vision Trigger */}
        {onOpenVision && (
          <button
            onClick={onOpenVision}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0B3821] bg-[#EAF6ED] hover:bg-[#D5EED8] border border-[#CDE7D2] px-3 py-1.5 rounded-xl shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-[#0D8249]"
            title="Open AI Object Recognition Camera"
            aria-label="Open AI Object Recognition Camera"
          >
            <Eye className="w-3.5 h-3.5 text-[#0D8249]" />
            <span>AI Vision</span>
          </button>
        )}

        {/* Emergency SOS Button */}
        {onTriggerSOS && (
          <button
            onClick={onTriggerSOS}
            className="flex items-center gap-1.5 text-xs font-black text-white bg-red-600 hover:bg-red-700 px-3.5 py-1.5 rounded-xl shadow-md transition-all focus-visible:ring-2 focus-visible:ring-red-600"
            title="Trigger Emergency SOS with GPS Broadcast"
            aria-label="Emergency SOS Alert"
          >
            <ShieldAlert className="w-4 h-4 stroke-[2.4]" />
            <span>SOS</span>
          </button>
        )}

        {/* Testing Suite Button */}
        <button
          onClick={onOpenDemoPanel}
          className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#16A34A] hover:bg-[#15803D] px-3.5 py-1.5 rounded-xl shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-[#0D8249]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Testing Suite</span>
        </button>
      </div>
    </header>
  );
};
