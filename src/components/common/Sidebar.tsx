import React from 'react';
import {
  Home,
  BarChart2,
  Settings,
  Info,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Battery,
  Bluetooth,
  Gauge,
  Power,
  Volume2,
} from 'lucide-react';
import { TabType, DeviceSettings } from '../../types/echonav';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  settings: DeviceSettings;
  currentDistance: number;
  simulationState: 'idle' | 'running' | 'paused';
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onResumeSimulation: () => void;
  onResetDemo: () => void;
  onSetDistance: (dist: number) => void;
  onToggleConnection: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  settings,
  currentDistance,
  simulationState,
  onStartSimulation,
  onPauseSimulation,
  onResumeSimulation,
  onResetDemo,
  onSetDistance,
  onToggleConnection,
}) => {
  const navItems: { tab: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'home', label: 'Home Dashboard', icon: Home },
    { tab: 'history', label: 'Detection History', icon: BarChart2 },
    { tab: 'settings', label: 'Settings & Controls', icon: Settings },
    { tab: 'about', label: 'About EchoNav', icon: Info },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-[#E5EFE7] p-5 shrink-0 justify-between h-screen sticky top-0 overflow-y-auto select-none"
      aria-label="Desktop Sidebar Navigation"
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-[#F0F5F1]">
          <div className="w-11 h-11 rounded-2xl bg-[#EAF6ED] border border-[#CDE7D2] flex items-center justify-center text-[#0D8249] shadow-sm shrink-0">
            <Compass className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold text-[#0B3821] tracking-tight">EchoNav</h1>
            </div>
            <p className="text-xs font-semibold text-[#5F7E6C]">Assistive Navigation</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="py-4 space-y-1.5" aria-label="Main Navigation">
          <span className="text-[10px] font-extrabold uppercase text-[#7A9586] tracking-wider px-3 block mb-1">
            Application Menu
          </span>
          {navItems.map(({ tab, label, icon: Icon }) => {
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 focus:outline-none ${
                  isActive
                    ? 'bg-[#EAF6ED] text-[#0D8249] shadow-sm border border-[#CDE7D2]'
                    : 'text-[#5F7E6C] hover:text-[#0B3821] hover:bg-[#F4F9F4]'
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 transition-transform ${
                    isActive ? 'stroke-[2.4] text-[#0D8249] scale-105' : 'stroke-[2]'
                  }`}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Simulation Testing Panel */}
        <div className="mt-2 p-3.5 bg-[#F4F9F4] rounded-2xl border border-[#E3EDE4] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#0B3821] flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#0D8249]" />
              Sensor Simulator
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                simulationState === 'running'
                  ? 'bg-emerald-100 text-[#0D8249]'
                  : simulationState === 'paused'
                  ? 'bg-amber-100 text-[#D97706]'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {simulationState === 'running' ? '● Running' : simulationState === 'paused' ? '❚❚ Paused' : '○ Idle'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            {simulationState === 'running' ? (
              <button
                onClick={onPauseSimulation}
                className="py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </button>
            ) : simulationState === 'paused' ? (
              <button
                onClick={onResumeSimulation}
                className="py-1.5 px-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Resume</span>
              </button>
            ) : (
              <button
                onClick={onStartSimulation}
                className="py-1.5 px-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start Feed</span>
              </button>
            )}

            <button
              onClick={onResetDemo}
              className="py-1.5 px-2 bg-white hover:bg-slate-50 text-[#0B3821] border border-[#D5E6D8] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-[#0D8249]" />
              <span>Reset</span>
            </button>
          </div>

          {/* Proximity presets */}
          <div>
            <div className="flex justify-between text-[10px] font-bold text-[#5F7E6C] mb-1">
              <span>Proximity Presets:</span>
              <span className="text-[#0D8249]">{currentDistance} cm</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => onSetDistance(20)}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                  currentDistance === 20
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                20 cm
              </button>
              <button
                onClick={() => onSetDistance(35)}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                  currentDistance === 35
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                35 cm
              </button>
              <button
                onClick={() => onSetDistance(60)}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                  currentDistance === 60
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                60 cm
              </button>
              <button
                onClick={() => onSetDistance(85)}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                  currentDistance === 85
                    ? 'bg-[#0B3821] text-white'
                    : 'bg-slate-100 text-[#0B3821] hover:bg-slate-200 border border-slate-200'
                }`}
              >
                85 cm
              </button>
              <button
                onClick={() => onSetDistance(120)}
                className={`col-span-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  currentDistance === 120
                    ? 'bg-[#0B3821] text-white'
                    : 'bg-slate-100 text-[#0B3821] hover:bg-slate-200 border border-slate-200'
                }`}
              >
                120 cm (Clear)
              </button>
            </div>
          </div>

          {/* Custom Slider */}
          <div className="pt-1">
            <input
              type="range"
              min="10"
              max="200"
              value={currentDistance}
              onChange={(e) => onSetDistance(Number(e.target.value))}
              className="w-full h-1 bg-[#E2EBE4] rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
            />
          </div>
        </div>
      </div>

      {/* Footer Device Status */}
      <div className="pt-4 border-t border-[#F0F5F1] space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-[#0B3821]">
            <Bluetooth className="w-4 h-4 text-[#0D8249]" />
            <span className="truncate">{settings.deviceName}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            settings.bluetoothConnected ? 'bg-emerald-100 text-[#0D8249]' : 'bg-red-100 text-[#DC2626]'
          }`}>
            {settings.bluetoothConnected ? 'BLE Demo' : 'Disconnected'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#7A9586]">
          <span className="flex items-center gap-1">
            <Battery className="w-3.5 h-3.5 text-[#0D8249]" />
            Battery: {settings.batteryPercentage}%
          </span>
          {settings.voiceAlerts && settings.soundNotification && (
            <span className="flex items-center gap-0.5 text-[#0D8249] font-semibold">
              <Volume2 className="w-3 h-3" />
              Voice On
            </span>
          )}
        </div>

        <button
          onClick={onToggleConnection}
          className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
            settings.bluetoothConnected
              ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60'
              : 'text-white bg-[#16A34A] hover:bg-[#15803D]'
          }`}
        >
          <Power className="w-3 h-3" />
          <span>{settings.bluetoothConnected ? 'Disconnect Demo' : 'Connect Demo'}</span>
        </button>
      </div>
    </aside>
  );
};
