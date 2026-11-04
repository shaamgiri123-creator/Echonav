import React from 'react';
import {
  X,
  Radio,
  Sliders,
  ShieldCheck,
  Bluetooth,
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Battery,
  Layers,
  Power,
  ChevronRight,
} from 'lucide-react';
import { TabType, DeviceSettings } from '../../types/echonav';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  settings: DeviceSettings;
  currentDistance: number;
  simulationState: 'idle' | 'running' | 'paused';
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onResumeSimulation: () => void;
  onResetDemo: () => void;
  onSetDistance: (dist: number) => void;
  onToggleConnection: () => void;
  onUpdateBattery: (battery: number) => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  settings,
  currentDistance,
  simulationState,
  onStartSimulation,
  onPauseSimulation,
  onResumeSimulation,
  onResetDemo,
  onSetDistance,
  onToggleConnection,
  onUpdateBattery,
}) => {
  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Simulation Demonstration Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
        <div>
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F5F1]">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-extrabold text-[#0B3821]">Echonav</h2>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-[#0D8249] tracking-wider">
                  Demo Mode
                </span>
              </div>
              <p className="text-xs text-[#5F7E6C]">Assistive Demonstration Suite</p>
            </div>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-[#0B3821] hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#0D8249] flex items-center justify-center"
              aria-label="Close menu drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Shortcuts */}
          <div className="py-3 border-b border-[#F0F5F1] space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-[#7A9586] tracking-wider block mb-1">
              Screen Navigation
            </span>
            <button
              onClick={() => {
                onSelectTab('home');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#0B3821] hover:bg-[#F2FAF4]"
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-[#0D8249]" />
                <span>Home (Live Radar)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => {
                onSelectTab('history');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#0B3821] hover:bg-[#F2FAF4]"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#0D8249]" />
                <span>Detection History & Analytics</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => {
                onSelectTab('settings');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#0B3821] hover:bg-[#F2FAF4]"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-[#0D8249]" />
                <span>Settings & Monitoring</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => {
                onSelectTab('about');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#0B3821] hover:bg-[#F2FAF4]"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0D8249]" />
                <span>About EchoNav</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* DEMO CONTROL PANEL (Section 6) */}
          <div className="pt-3 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-[#0B3821] tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#0D8249]" />
                Simulation Controls
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                simulationState === 'running'
                  ? 'bg-emerald-100 text-[#0D8249]'
                  : simulationState === 'paused'
                  ? 'bg-amber-100 text-[#D97706]'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {simulationState === 'running' ? '● Running' : simulationState === 'paused' ? '❚❚ Paused' : '○ Idle'}
              </span>
            </div>

            {/* Start / Pause / Resume / Reset Action Grid */}
            <div className="grid grid-cols-2 gap-2">
              {simulationState === 'running' ? (
                <button
                  onClick={onPauseSimulation}
                  className="py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Feed</span>
                </button>
              ) : simulationState === 'paused' ? (
                <button
                  onClick={onResumeSimulation}
                  className="py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm bg-[#16A34A] hover:bg-[#15803D] text-white"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Feed</span>
                </button>
              ) : (
                <button
                  onClick={onStartSimulation}
                  className="py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm bg-[#16A34A] hover:bg-[#15803D] text-white"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Feed</span>
                </button>
              )}

              <button
                onClick={onResetDemo}
                className="py-2 px-3 rounded-xl text-xs font-bold text-[#0B3821] bg-[#EEF5F0] hover:bg-[#E3EDE5] transition-all flex items-center justify-center gap-1.5 border border-[#D5E6D8]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#0D8249]" />
                <span>Reset Demo</span>
              </button>
            </div>

            {/* Distance Presets */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#0B3821] mb-1.5">
                <span>Proximity Presets:</span>
                <span className="text-[11px] font-extrabold text-[#0D8249]">
                  {currentDistance} cm
                </span>
              </div>
              <div className="space-y-1.5">
                {/* 20 cm */}
                <button
                  onClick={() => onSetDistance(20)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    currentDistance === 20
                      ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-300'
                      : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60'
                  }`}
                >
                  <span>20 cm</span>
                  <span className="text-[10px] font-semibold opacity-90">High Danger</span>
                </button>

                {/* 35 cm */}
                <button
                  onClick={() => onSetDistance(35)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    currentDistance === 35
                      ? 'bg-[#16A34A] text-white shadow-sm ring-2 ring-emerald-300'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                  }`}
                >
                  <span>35 cm</span>
                  <span className="text-[10px] font-semibold opacity-90">Obstacle Detected (Ref)</span>
                </button>

                {/* 60 cm */}
                <button
                  onClick={() => onSetDistance(60)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    currentDistance === 60
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                  }`}
                >
                  <span>60 cm</span>
                  <span className="text-[10px] font-semibold opacity-90">Medium Danger</span>
                </button>

                {/* 85 cm */}
                <button
                  onClick={() => onSetDistance(85)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    currentDistance === 85
                      ? 'bg-[#0B3821] text-white shadow-sm ring-2 ring-[#0B3821]/40'
                      : 'bg-[#F0F7F2] text-[#0B3821] hover:bg-[#E4EFE7] border border-[#D5E6D8]'
                  }`}
                >
                  <span>85 cm</span>
                  <span className="text-[10px] font-semibold opacity-90">Safe Path</span>
                </button>

                {/* 120 cm */}
                <button
                  onClick={() => onSetDistance(120)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    currentDistance === 120
                      ? 'bg-[#0B3821] text-white shadow-sm ring-2 ring-[#0B3821]/40'
                      : 'bg-[#F0F7F2] text-[#0B3821] hover:bg-[#E4EFE7] border border-[#D5E6D8]'
                  }`}
                >
                  <span>120 cm</span>
                  <span className="text-[10px] font-semibold opacity-90">Clear Path</span>
                </button>
              </div>
            </div>

            {/* Custom Distance Slider (10 cm to 200 cm) */}
            <div className="pt-1 bg-[#F9FCFA] p-3 rounded-2xl border border-[#E7EFE8]">
              <div className="flex justify-between items-center text-xs font-bold text-[#0B3821] mb-1.5">
                <span>Custom Distance Control:</span>
                <span className="text-[#0D8249]">{currentDistance} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="1"
                value={currentDistance}
                onChange={(e) => onSetDistance(Number(e.target.value))}
                className="w-full h-1.5 bg-[#E2EBE4] rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
              />
              <div className="flex justify-between text-[10px] text-[#7A9586] font-semibold mt-1">
                <span>10 cm</span>
                <span>100 cm</span>
                <span>200 cm</span>
              </div>
            </div>

            {/* Simulated Battery Level Adjuster */}
            <div className="bg-[#F9FCFA] p-3 rounded-2xl border border-[#E7EFE8]">
              <div className="flex justify-between items-center text-xs font-bold text-[#0B3821] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-[#0D8249]" />
                  Simulated Battery:
                </span>
                <span className="text-[#0D8249]">{settings.batteryPercentage}%</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onUpdateBattery(82)}
                  className={`py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    settings.batteryPercentage === 82
                      ? 'bg-[#16A34A] text-white border-[#16A34A]'
                      : 'bg-white text-[#0B3821] border-[#D5E6D8] hover:bg-[#F2FAF4]'
                  }`}
                >
                  82% (Default)
                </button>
                <button
                  onClick={() => onUpdateBattery(50)}
                  className={`py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    settings.batteryPercentage === 50
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-[#0B3821] border-[#D5E6D8] hover:bg-[#F2FAF4]'
                  }`}
                >
                  50%
                </button>
                <button
                  onClick={() => onUpdateBattery(15)}
                  className={`py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    settings.batteryPercentage === 15
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-[#0B3821] border-[#D5E6D8] hover:bg-[#F2FAF4]'
                  }`}
                >
                  15% (Low)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Device Simulation Status */}
        <div className="pt-4 border-t border-[#F0F5F1] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#0B3821]">
              <Bluetooth className="w-4 h-4 text-[#0D8249]" />
              <span>{settings.deviceName}</span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              settings.bluetoothConnected
                ? 'bg-emerald-100 text-[#0D8249]'
                : 'bg-red-100 text-[#DC2626]'
            }`}>
              {settings.bluetoothConnected ? 'Connected (BLE 5.0 Demo)' : 'Disconnected'}
            </span>
          </div>

          <button
            onClick={onToggleConnection}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              settings.bluetoothConnected
                ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60'
                : 'text-white bg-[#16A34A] hover:bg-[#15803D]'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>
              {settings.bluetoothConnected ? 'Disconnect Demo Device' : 'Connect Demo Device'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
