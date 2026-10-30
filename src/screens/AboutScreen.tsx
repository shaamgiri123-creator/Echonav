import React from 'react';
import {
  Compass,
  Target,
  Cpu,
  Radio,
  Zap,
  Bluetooth,
  BatteryCharging,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="flex-1 px-5 pt-1 pb-6 overflow-y-auto space-y-3.5 min-h-0">
      {/* 1. Brand Hero Card */}
      <div className="bg-white rounded-[26px] p-5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8] text-center">
        {/* Logo Emblem */}
        <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-[#E8F5E9] animate-pulse opacity-70" />
          <div className="relative w-14 h-14 rounded-2xl bg-[#EAF6ED] border border-[#CDE7D2] flex items-center justify-center text-[#0D8249] shadow-sm">
            <Compass className="w-7 h-7 stroke-[2.3]" />
          </div>
        </div>

        {/* Application Name & Subtitle */}
        <h2 className="text-[24px] font-extrabold text-[#0B3821] tracking-tight leading-tight">
          Echonav
        </h2>
        <p className="text-xs font-bold text-[#0D8249] mt-0.5 tracking-tight">
          Your Safe Companion
        </p>

        {/* Primary Description */}
        <p className="text-[12.5px] text-[#5F7E6C] mt-2.5 leading-relaxed font-normal px-1">
          EchoNav is an assistive navigation system designed to help visually impaired people detect nearby obstacles using ultrasonic sensing and intelligent vibration feedback.
        </p>
      </div>

      {/* 2. Project Objective Card */}
      <div className="bg-white rounded-[24px] p-4.5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8]">
        <div className="flex items-center gap-2 mb-2.5 text-[#0B3821]">
          <div className="w-7 h-7 rounded-lg bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
            <Target className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h3 className="text-[15px] font-extrabold tracking-tight">
            Project Objective
          </h3>
        </div>
        <p className="text-[12.5px] text-[#5F7E6C] leading-relaxed">
          EchoNav empowers visually impaired individuals with enhanced spatial confidence and independent mobility. By translating real-time physical proximity into intuitive tactile vibration cues, it bridges the gap between traditional white canes and modern sensor-assisted navigation.
        </p>
      </div>

      {/* 3. How It Works (Step-by-Step Flow) */}
      <div className="bg-white rounded-[24px] p-4.5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8]">
        <div className="flex items-center gap-2 mb-3 text-[#0B3821]">
          <div className="w-7 h-7 rounded-lg bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
            <Layers className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h3 className="text-[15px] font-extrabold tracking-tight">
            How It Works
          </h3>
        </div>

        <div className="space-y-2.5 text-[12.5px] text-[#5F7E6C]">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E8F5E9] text-[#0D8249] font-extrabold text-[11px] flex items-center justify-center mt-0.5 border border-[#CDE7D2]">
              1
            </span>
            <div className="flex-1 leading-snug">
              <span className="font-bold text-[#0B3821]">Ultrasonic Detection:</span> The sensor scans ahead to detect nearby obstacles in real time.
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E8F5E9] text-[#0D8249] font-extrabold text-[11px] flex items-center justify-center mt-0.5 border border-[#CDE7D2]">
              2
            </span>
            <div className="flex-1 leading-snug">
              <span className="font-bold text-[#0B3821]">Embedded Processing:</span> The onboard ESP32 microcontroller calculates accurate distance measurements.
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E8F5E9] text-[#0D8249] font-extrabold text-[11px] flex items-center justify-center mt-0.5 border border-[#CDE7D2]">
              3
            </span>
            <div className="flex-1 leading-snug">
              <span className="font-bold text-[#0B3821]">Intelligent Haptics:</span> The vibration motor triggers proportional tactile feedback matching obstacle distance.
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E8F5E9] text-[#0D8249] font-extrabold text-[11px] flex items-center justify-center mt-0.5 border border-[#CDE7D2]">
              4
            </span>
            <div className="flex-1 leading-snug">
              <span className="font-bold text-[#0B3821]">Mobile Companion:</span> The EchoNav app displays live radar visuals, distance readings, and device status.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Hardware Components */}
      <div className="bg-white rounded-[24px] p-4.5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8]">
        <div className="flex items-center gap-2 mb-3 text-[#0B3821]">
          <div className="w-7 h-7 rounded-lg bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
            <Cpu className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h3 className="text-[15px] font-extrabold tracking-tight">
            Hardware Components
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs">
          {/* Component 1 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
            <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
              <Cpu className="w-4 h-4 text-[#0D8249]" />
              <span>ESP32 Microcontroller</span>
            </div>
            <span className="text-[11px] font-bold text-[#5F7E6C]">Core Processing</span>
          </div>

          {/* Component 2 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
            <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
              <Radio className="w-4 h-4 text-[#0D8249]" />
              <span>Ultrasonic Sensor</span>
            </div>
            <span className="text-[11px] font-bold text-[#5F7E6C]">Proximity Tracking</span>
          </div>

          {/* Component 3 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
            <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
              <Zap className="w-4 h-4 text-[#0D8249]" />
              <span>Vibration Motor</span>
            </div>
            <span className="text-[11px] font-bold text-[#5F7E6C]">Tactile Haptics</span>
          </div>

          {/* Component 4 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
            <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
              <Bluetooth className="w-4 h-4 text-[#0D8249]" />
              <span>Bluetooth Connectivity</span>
            </div>
            <span className="text-[11px] font-bold text-[#5F7E6C]">BLE 5.0 Wireless</span>
          </div>

          {/* Component 5 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
            <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
              <BatteryCharging className="w-4 h-4 text-[#0D8249]" />
              <span>Rechargeable Battery</span>
            </div>
            <span className="text-[11px] font-bold text-[#5F7E6C]">Li-Po Power Cell</span>
          </div>
        </div>
      </div>

      {/* 5. Device Information Card */}
      <div className="bg-white rounded-[24px] p-4.5 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8]">
        <div className="flex items-center gap-2 mb-2 text-[#0B3821]">
          <div className="w-7 h-7 rounded-lg bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
            <Sparkles className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h3 className="text-[15px] font-extrabold tracking-tight">
            Device Information
          </h3>
        </div>

        <div className="divide-y divide-[#F0F5F1] text-[13px]">
          <div className="py-2 flex justify-between items-center">
            <span className="text-[#0B3821] font-medium">Device</span>
            <span className="text-[#5F7E6C] font-semibold">Echonav Glove</span>
          </div>
          <div className="py-2 flex justify-between items-center">
            <span className="text-[#0B3821] font-medium">Firmware</span>
            <span className="text-[#5F7E6C] font-semibold">v1.0.0</span>
          </div>
          <div className="py-2 flex justify-between items-center">
            <span className="text-[#0B3821] font-medium">Application Version</span>
            <span className="text-[#5F7E6C] font-semibold">1.0.0</span>
          </div>
          <div className="py-2 flex justify-between items-center">
            <span className="text-[#0B3821] font-medium">System Status</span>
            <span className="text-[#0D8249] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Operational
            </span>
          </div>
        </div>
      </div>

      {/* 6. Project Credits Card */}
      <div className="bg-white rounded-[24px] p-4 shadow-[0_2px_10px_rgba(11,56,33,0.04)] border border-[#E7EFE8] text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0B3821]">
          <HeartHandshake className="w-4 h-4 text-[#0D8249]" />
          <span>EchoNav Assistive Project</span>
        </div>
        <p className="text-[11px] text-[#7A9586] mt-1 leading-snug">
          Engineered for assistive accessibility, safety, and independent mobility for the visually impaired community.
        </p>
      </div>
    </div>
  );
};
