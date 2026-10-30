import React from 'react';
import { Volume2, Battery, Bluetooth, Power, Mic, Eye, Type, Clock, Cpu } from 'lucide-react';
import { DeviceSettings } from '../types/echonav';

interface SettingsScreenProps {
  settings: DeviceSettings;
  onUpdateSettings: (updater: (prev: DeviceSettings) => DeviceSettings) => void;
  onPlayBeep?: (level: 'High' | 'Medium' | 'Safe') => void;
  onToggleConnection?: () => void;
  lastReadingTime?: string;
  simulationState?: 'idle' | 'running' | 'paused';
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onPlayBeep,
  onToggleConnection,
  lastReadingTime = '12:20:00 PM',
  simulationState = 'idle',
}) => {
  // Distance percentage for continuous gradient track
  const distPct = Math.round(
    ((settings.distanceThresholdCm - 10) / (200 - 10)) * 100
  );

  // Vibration step to percentage
  const vibValue =
    settings.vibrationIntensity === 'Low'
      ? 1
      : settings.vibrationIntensity === 'Medium'
      ? 2
      : 3;
  const vibPct = Math.round(((vibValue - 1) / 2) * 100);

  return (
    <div className="flex-1 px-5 pt-1 pb-6 overflow-y-auto space-y-3.5 min-h-0">
      {/* 1. Distance Sensitivity Card */}
      <div className="bg-white rounded-[24px] p-4.5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8]">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[15px] font-extrabold text-[#0B3821] tracking-tight">
            Distance Sensitivity
          </span>
          <span className="text-xs font-bold text-[#0D8249]">
            {settings.distanceSensitivity} ({settings.distanceThresholdCm} cm)
          </span>
        </div>

        {/* Custom Progress Slider */}
        <input
          type="range"
          min="10"
          max="200"
          step="5"
          value={settings.distanceThresholdCm}
          onChange={(e) => {
            const val = Number(e.target.value);
            const label = val <= 65 ? 'High' : val <= 135 ? 'Medium' : 'Low';
            onUpdateSettings((prev) => ({
              ...prev,
              distanceThresholdCm: val,
              highThresholdCm: Math.round(val * 0.5),
              distanceSensitivity: label,
            }));
          }}
          style={{
            background: `linear-gradient(to right, #16A34A ${distPct}%, #E4EBE5 ${distPct}%)`,
          }}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          aria-label="Distance Sensitivity"
        />

        <div className="flex justify-between items-center text-xs font-semibold text-[#7A9586] mt-2">
          <span>10 cm</span>
          <span>200 cm</span>
        </div>
      </div>

      {/* 2. Vibration Intensity Card */}
      <div className="bg-white rounded-[24px] p-4.5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8]">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[15px] font-extrabold text-[#0B3821] tracking-tight">
            Vibration Intensity
          </span>
          <span className="text-xs font-bold text-[#0D8249]">
            {settings.vibrationIntensity}
          </span>
        </div>

        {/* Custom 3-Step Slider */}
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={vibValue}
          onChange={(e) => {
            const val = Number(e.target.value);
            const level = val === 1 ? 'Low' : val === 2 ? 'Medium' : 'High';
            onUpdateSettings((prev) => ({
              ...prev,
              vibrationIntensity: level,
            }));
          }}
          style={{
            background: `linear-gradient(to right, #16A34A ${vibPct}%, #E4EBE5 ${vibPct}%)`,
          }}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          aria-label="Vibration Intensity"
        />

        <div className="flex justify-between items-center text-xs font-semibold text-[#7A9586] mt-2">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* 3. Audio & Voice Alerts Card */}
      <div className="bg-white rounded-[24px] p-4.5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8] space-y-3">
        {/* Sound Notification Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F0F7F2] flex items-center justify-center text-[#0B3821]">
              <Volume2 className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[14.5px] font-extrabold text-[#0B3821] leading-tight">
                Sound Notification
              </div>
              <div className="text-xs font-medium text-[#7A9586] mt-0.5 leading-tight">
                Tone alerts on obstacle detection
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const nextVal = !settings.soundNotification;
              onUpdateSettings((prev) => ({
                ...prev,
                soundNotification: nextVal,
              }));
              if (nextVal && onPlayBeep) {
                onPlayBeep('High');
              }
            }}
            className={`w-12 h-6.5 flex items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
              settings.soundNotification ? 'bg-[#16A34A]' : 'bg-[#D6DFD9]'
            }`}
            aria-label="Toggle Sound Notification"
            role="switch"
            aria-checked={settings.soundNotification}
          >
            <div
              className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ${
                settings.soundNotification ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Voice Announcement Toggle (Section 2) */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#F0F5F1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#0D8249]">
              <Mic className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[14.5px] font-extrabold text-[#0B3821] leading-tight">
                Voice Guidance
              </div>
              <div className="text-xs font-medium text-[#7A9586] mt-0.5 leading-tight">
                Speech announcements via Web Speech API
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onUpdateSettings((prev) => ({
                ...prev,
                voiceAlerts: !prev.voiceAlerts,
              }));
            }}
            className={`w-12 h-6.5 flex items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
              settings.voiceAlerts ? 'bg-[#16A34A]' : 'bg-[#D6DFD9]'
            }`}
            aria-label="Toggle Voice Guidance"
            role="switch"
            aria-checked={settings.voiceAlerts}
          >
            <div
              className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ${
                settings.voiceAlerts ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. Accessibility Options Card (Section 4) */}
      <div className="bg-white rounded-[24px] p-4.5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8] space-y-3">
        <h3 className="text-xs font-extrabold text-[#7A9586] uppercase tracking-wider">
          Accessibility Options
        </h3>

        {/* Large Text Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F0F7F2] flex items-center justify-center text-[#0B3821]">
              <Type className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#0B3821] leading-tight">
                Large Text Mode
              </div>
              <div className="text-[11px] font-medium text-[#7A9586] mt-0.5 leading-tight">
                Enlarge UI typography for low vision
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onUpdateSettings((prev) => ({
                ...prev,
                largeText: !prev.largeText,
              }));
            }}
            className={`w-12 h-6.5 flex items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
              settings.largeText ? 'bg-[#16A34A]' : 'bg-[#D6DFD9]'
            }`}
            aria-label="Toggle Large Text"
            role="switch"
            aria-checked={settings.largeText}
          >
            <div
              className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ${
                settings.largeText ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* High Contrast Mode */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0F5F1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F0F7F2] flex items-center justify-center text-[#0B3821]">
              <Eye className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#0B3821] leading-tight">
                High Contrast Mode
              </div>
              <div className="text-[11px] font-medium text-[#7A9586] mt-0.5 leading-tight">
                Enhanced borders & high visual clarity
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onUpdateSettings((prev) => ({
                ...prev,
                highContrast: !prev.highContrast,
              }));
            }}
            className={`w-12 h-6.5 flex items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
              settings.highContrast ? 'bg-[#16A34A]' : 'bg-[#D6DFD9]'
            }`}
            aria-label="Toggle High Contrast"
            role="switch"
            aria-checked={settings.highContrast}
          >
            <div
              className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ${
                settings.highContrast ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 5. Battery Status Card */}
      <div className="bg-white rounded-[24px] p-4.5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8]">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-[#0D8249]">
            <Battery className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[15px] font-extrabold text-[#0B3821]">
              Battery Status
            </span>
          </div>
          <span className="text-sm font-extrabold text-[#0D8249]">
            {settings.batteryPercentage}%
          </span>
        </div>

        {/* Battery Progress Bar */}
        <div className="w-full h-2 bg-[#E7ECE8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#16A34A] rounded-full transition-all duration-300"
            style={{ width: `${settings.batteryPercentage}%` }}
          />
        </div>
      </div>

      {/* 6. Device Monitoring Section (Section 5) */}
      <div className="pt-1">
        <h3 className="text-sm font-extrabold text-[#0B3821] tracking-tight mb-2 px-1 flex items-center justify-between">
          <span>Device Monitoring</span>
          <span className="text-[10px] font-bold text-[#0D8249] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Simulated Hardware
          </span>
        </h3>

        {/* Grouped Details Card */}
        <div className="bg-white rounded-[24px] px-4.5 py-2 divide-y divide-[#F0F5F1] shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8]">
          <div className="py-2.5 flex justify-between items-center text-[13px]">
            <span className="text-[#0B3821] font-medium">Device Name</span>
            <span className="text-[#5F7E6C] font-semibold">{settings.deviceName}</span>
          </div>

          <div className="py-2.5 flex justify-between items-center text-[13px]">
            <span className="text-[#0B3821] font-medium">Firmware Version</span>
            <span className="text-[#5F7E6C] font-semibold">{settings.firmwareVersion}</span>
          </div>

          <div className="py-2.5 flex justify-between items-center text-[13px]">
            <div className="flex items-center gap-2 text-[#0B3821] font-medium">
              <Bluetooth className="w-4 h-4 text-[#0D8249]" />
              <span>Bluetooth Status</span>
            </div>
            <span className={`text-xs font-bold ${
              settings.bluetoothConnected ? 'text-[#0D8249]' : 'text-[#DC2626]'
            }`}>
              {settings.bluetoothConnected ? 'Connected (BLE 5.0 Demo)' : 'Disconnected'}
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center text-[13px]">
            <div className="flex items-center gap-2 text-[#0B3821] font-medium">
              <Battery className="w-4 h-4 text-[#0D8249]" />
              <span>Simulated Battery</span>
            </div>
            <span className="text-xs font-bold text-[#0B3821]">
              {settings.batteryPercentage}%
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center text-[13px]">
            <div className="flex items-center gap-2 text-[#0B3821] font-medium">
              <Clock className="w-4 h-4 text-[#0D8249]" />
              <span>Last Reading Time</span>
            </div>
            <span className="text-xs font-semibold text-[#5F7E6C]">
              {lastReadingTime}
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center text-[13px]">
            <div className="flex items-center gap-2 text-[#0B3821] font-medium">
              <Cpu className="w-4 h-4 text-[#0D8249]" />
              <span>Simulation Mode</span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              simulationState === 'running'
                ? 'bg-emerald-100 text-[#0D8249]'
                : simulationState === 'paused'
                ? 'bg-amber-100 text-[#D97706]'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {simulationState === 'running' ? 'Active Feed' : simulationState === 'paused' ? 'Paused' : 'Manual / Demo'}
            </span>
          </div>
        </div>

        {/* Connect / Disconnect Simulation Action Button */}
        {onToggleConnection && (
          <div className="mt-3">
            <button
              onClick={onToggleConnection}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                settings.bluetoothConnected
                  ? 'border border-[#FCA5A5] text-[#DC2626] bg-red-50/50 hover:bg-red-100/60'
                  : 'bg-[#16A34A] text-white hover:bg-[#15803D] shadow-sm'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>
                {settings.bluetoothConnected
                  ? 'Simulate Disconnect Device'
                  : 'Simulate Connect Device'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
