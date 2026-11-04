import React from 'react';
import { Volume2, Battery, Bluetooth, Power, Mic, Eye, Type, Clock, Cpu, Languages } from 'lucide-react';
import { DeviceSettings, EmergencyContact } from '../types/echonav';
import { EmergencyContactsCard } from '../components/sos/EmergencyContactsCard';
import { EmailSettingsCard } from '../components/email/EmailSettingsCard';

interface SettingsScreenProps {
  settings: DeviceSettings;
  onUpdateSettings: (updater: (prev: DeviceSettings) => DeviceSettings) => void;
  onPlayBeep?: (level: 'High' | 'Medium' | 'Safe') => void;
  onToggleConnection?: () => void;
  lastReadingTime?: string;
  simulationState?: 'idle' | 'running' | 'paused';
  emergencyContacts?: EmergencyContact[];
  onAddContact?: (contact: Omit<EmergencyContact, 'id'>) => void;
  onRemoveContact?: (id: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onPlayBeep,
  onToggleConnection,
  lastReadingTime = '12:20:00 PM',
  simulationState = 'idle',
  emergencyContacts = [],
  onAddContact,
  onRemoveContact,
}) => {
  const distPct = Math.round(
    ((settings.distanceThresholdCm - 10) / (200 - 10)) * 100
  );

  const vibValue =
    settings.vibrationIntensity === 'Low'
      ? 1
      : settings.vibrationIntensity === 'Medium'
      ? 2
      : 3;
  const vibPct = Math.round(((vibValue - 1) / 2) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 pb-8">
      <h1 className="sr-only">EchoNav System Settings & Controls</h1>
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Left Column: Core Sensor & Feedback Controls */}
        <div className="space-y-4">
          {/* 1. Distance Sensitivity Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8]">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[15px] font-extrabold text-[#0B3821] tracking-tight">
                Distance Sensitivity Threshold
              </span>
              <span className="text-xs font-bold text-[#0D8249]">
                {settings.distanceSensitivity} ({settings.distanceThresholdCm} cm)
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={settings.distanceThresholdCm}
              aria-valuemin={10}
              aria-valuemax={200}
              aria-valuenow={settings.distanceThresholdCm}
              aria-valuetext={`${settings.distanceThresholdCm} centimeters, ${settings.distanceSensitivity} sensitivity`}
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
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0D8249]"
              aria-label="Distance Sensitivity Threshold"
            />

            <div className="flex justify-between items-center text-xs font-semibold text-[#7A9586] mt-2">
              <span>10 cm (High Sensitivity)</span>
              <span>200 cm (Max Range)</span>
            </div>
          </div>

          {/* 2. Vibration Intensity Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8]">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[15px] font-extrabold text-[#0B3821] tracking-tight">
                Vibration Haptic Intensity
              </span>
              <span className="text-xs font-bold text-[#0D8249]">
                {settings.vibrationIntensity}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={vibValue}
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={vibValue}
              aria-valuetext={`${settings.vibrationIntensity} vibration intensity`}
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
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0D8249]"
              aria-label="Vibration Haptic Intensity"
            />

            <div className="flex justify-between items-center text-xs font-semibold text-[#7A9586] mt-2">
              <span>Low (Subtle Pulse)</span>
              <span>High (Strong Alert)</span>
            </div>
          </div>

          {/* 3. Audio & Voice Alerts Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8] space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase text-[#7A9586] tracking-wider">
              Audio Feedback & Speech Alerts
            </h4>

            {/* Sound Notification Toggle (Full Row Clickable) */}
            <div
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
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  const nextVal = !settings.soundNotification;
                  onUpdateSettings((prev) => ({
                    ...prev,
                    soundNotification: nextVal,
                  }));
                  if (nextVal && onPlayBeep) {
                    onPlayBeep('High');
                  }
                }
              }}
              role="switch"
              tabIndex={0}
              aria-checked={settings.soundNotification}
              aria-label="Audio Beep Tones"
              className="flex items-center justify-between p-2.5 -mx-2.5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#0D8249]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0F7F2] flex items-center justify-center text-[#0B3821] shrink-0">
                  <Volume2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[14.5px] font-extrabold text-[#0B3821] leading-tight">
                    Audio Beep Tones
                  </div>
                  <div className="text-xs font-semibold text-[#7A9586] mt-0.5 leading-tight">
                    Proximity-dependent synthetic audio feedback
                  </div>
                </div>
              </div>

              <div
                className={`w-12 h-6.5 flex items-center rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                  settings.soundNotification ? 'bg-[#16A34A]' : 'bg-[#D6DFD9]'
                }`}
              >
                <div
                  className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ${
                    settings.soundNotification ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            {/* Voice Guidance Toggle (Full Row Clickable) */}
            <div
              onClick={() => {
                onUpdateSettings((prev) => ({
                  ...prev,
                  voiceAlerts: !prev.voiceAlerts,
                }));
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onUpdateSettings((prev) => ({
                    ...prev,
                    voiceAlerts: !prev.voiceAlerts,
                  }));
                }
              }}
              role="switch"
              tabIndex={0}
              aria-checked={settings.voiceAlerts}
              aria-label="Voice Guidance Announcements"
              className="flex items-center justify-between p-2.5 -mx-2.5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors pt-3 border-t border-[#F0F5F1] min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#0D8249]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#0D8249] shrink-0">
                  <Mic className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[14.5px] font-extrabold text-[#0B3821] leading-tight">
                    Voice Guidance Announcements
                  </div>
                  <div className="text-xs font-semibold text-[#7A9586] mt-0.5 leading-tight">
                    Natural speech alerts via Web Speech API
                  </div>
                </div>
              </div>

              <div
                className={`w-12 h-6.5 flex items-center rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                  settings.voiceAlerts ? 'bg-[#16A34A]' : 'bg-[#D6DFD9]'
                }`}
              >
                <div
                  className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ${
                    settings.voiceAlerts ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            {/* Voice Announcement Language Selector */}
            <div className="pt-3 border-t border-[#F0F5F1] space-y-2">
              <div className="flex items-center gap-2 text-[#0B3821]">
                <Languages className="w-4.5 h-4.5 text-[#0D8249]" />
                <span className="text-[14px] font-bold">Voice Alert Language</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, voiceLanguage: 'en' }))}
                  className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                    settings.voiceLanguage !== 'ta'
                      ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-sm'
                      : 'bg-[#F4F9F4] text-[#0B3821] border-[#DCE4DF] hover:bg-[#EAF5EC]'
                  }`}
                >
                  English (Default)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, voiceLanguage: 'ta' }))}
                  className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                    settings.voiceLanguage === 'ta'
                      ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-sm'
                      : 'bg-[#F4F9F4] text-[#0B3821] border-[#DCE4DF] hover:bg-[#EAF5EC]'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Contacts Management Card */}
          {onAddContact && onRemoveContact && (
            <EmergencyContactsCard
              contacts={emergencyContacts}
              onAddContact={onAddContact}
              onRemoveContact={onRemoveContact}
            />
          )}

          {/* Real-Time Email Integration: Emergency SOS Emails & Daily Reports */}
          <EmailSettingsCard reportUserName={settings.deviceName || 'EchoNav User'} />
        </div>

        {/* Right Column: Accessibility, Battery & Device Monitoring */}
        <div className="space-y-4">
          {/* 4. Accessibility Preferences Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8] space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase text-[#7A9586] tracking-wider">
              Accessibility Preferences
            </h4>

            {/* Large Text Mode (Full Row Clickable) */}
            <div
              onClick={() => {
                onUpdateSettings((prev) => ({
                  ...prev,
                  largeText: !prev.largeText,
                }));
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onUpdateSettings((prev) => ({
                    ...prev,
                    largeText: !prev.largeText,
                  }));
                }
              }}
              role="switch"
              tabIndex={0}
              aria-checked={settings.largeText}
              aria-label="Large Text Scaling"
              className="flex items-center justify-between p-2.5 -mx-2.5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#0D8249]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0F7F2] flex items-center justify-center text-[#0B3821] shrink-0">
                  <Type className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#0B3821] leading-tight">
                    Large Text Scaling
                  </div>
                  <div className="text-[11px] font-semibold text-[#7A9586] mt-0.5 leading-tight">
                    Enhanced font size for visually impaired users
                  </div>
                </div>
              </div>

              <div
                className={`w-12 h-6.5 flex items-center rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                  settings.largeText ? 'bg-[#16A34A]' : 'bg-[#D6DFD9]'
                }`}
              >
                <div
                  className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ${
                    settings.largeText ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            {/* High Contrast Mode (Full Row Clickable) */}
            <div
              onClick={() => {
                onUpdateSettings((prev) => ({
                  ...prev,
                  highContrast: !prev.highContrast,
                }));
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onUpdateSettings((prev) => ({
                    ...prev,
                    highContrast: !prev.highContrast,
                  }));
                }
              }}
              role="switch"
              tabIndex={0}
              aria-checked={settings.highContrast}
              aria-label="High Contrast Palette"
              className="flex items-center justify-between p-2.5 -mx-2.5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors pt-3 border-t border-[#F0F5F1] min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#0D8249]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0F7F2] flex items-center justify-center text-[#0B3821] shrink-0">
                  <Eye className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#0B3821] leading-tight">
                    High Contrast Palette
                  </div>
                  <div className="text-[11px] font-semibold text-[#7A9586] mt-0.5 leading-tight">
                    Sharpen borders and maximize color contrast
                  </div>
                </div>
              </div>

              <div
                className={`w-12 h-6.5 flex items-center rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                  settings.highContrast ? 'bg-[#16A34A]' : 'bg-[#D6DFD9]'
                }`}
              >
                <div
                  className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ${
                    settings.highContrast ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 5. Battery Status Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8]">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-[#0D8249]">
                <Battery className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[15px] font-extrabold text-[#0B3821]">
                  Simulated Battery Level
                </span>
              </div>
              <span className="text-sm font-extrabold text-[#0D8249]">
                {settings.batteryPercentage}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-[#E7ECE8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#16A34A] rounded-full transition-all duration-300"
                style={{ width: `${settings.batteryPercentage}%` }}
              />
            </div>
          </div>

          {/* 6. Device Hardware & Simulation Center */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F5F1]">
              <span className="text-xs font-extrabold uppercase text-[#7A9586] tracking-wider">
                Simulated Device Telemetry
              </span>
              <span className="text-[10px] font-bold text-[#0D8249] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                BLE Prototype
              </span>
            </div>

            <div className="divide-y divide-[#F0F5F1] text-[13px]">
              <div className="py-2 flex justify-between items-center">
                <span className="text-[#0B3821] font-medium">Device Profile</span>
                <span className="text-[#5F7E6C] font-semibold">{settings.deviceName}</span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <span className="text-[#0B3821] font-medium">Firmware Version</span>
                <span className="text-[#5F7E6C] font-semibold">{settings.firmwareVersion}</span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#0B3821] font-medium">
                  <Bluetooth className="w-4 h-4 text-[#0D8249]" />
                  <span>Bluetooth Link</span>
                </div>
                <span className={`text-xs font-bold ${
                  settings.bluetoothConnected ? 'text-[#0D8249]' : 'text-[#DC2626]'
                }`}>
                  {settings.bluetoothConnected ? 'Connected (BLE 5.0 Demo)' : 'Disconnected'}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#0B3821] font-medium">
                  <Clock className="w-4 h-4 text-[#0D8249]" />
                  <span>Last Reading Time</span>
                </div>
                <span className="text-xs font-semibold text-[#5F7E6C]">
                  {lastReadingTime}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
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

            {onToggleConnection && (
              <div className="pt-2">
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
      </div>
    </div>
  );
};
