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
    <div className="w-full max-w-5xl mx-auto space-y-5 pb-8">
      {/* Desktop Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Left Column: Brand, Mission, & Credits */}
        <div className="space-y-4">
          {/* 1. Brand Hero Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E7EFE8] text-center">
            {/* Logo Emblem */}
            <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-[#E8F5E9] animate-pulse opacity-70" />
              <div className="relative w-14 h-14 rounded-2xl bg-[#EAF6ED] border border-[#CDE7D2] flex items-center justify-center text-[#0D8249] shadow-sm">
                <Compass className="w-7 h-7 stroke-[2.3]" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0B3821] tracking-tight leading-tight">
              Echonav
            </h2>
            <p className="text-xs font-bold text-[#0D8249] mt-0.5 tracking-tight">
              Your Safe Companion • Assistive Navigation Prototype
            </p>

            <p className="text-xs text-[#5F7E6C] mt-3 leading-relaxed font-normal px-2">
              EchoNav is an assistive navigation system designed to help visually impaired people detect nearby obstacles using ultrasonic sensing and intelligent vibration feedback.
            </p>
          </div>

          {/* 2. Project Objective Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8] space-y-2.5">
            <div className="flex items-center gap-2.5 text-[#0B3821] pb-2 border-b border-[#F0F5F1]">
              <div className="w-8 h-8 rounded-xl bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
                <Target className="w-4.5 h-4.5 stroke-[2.4]" />
              </div>
              <h3 className="text-[15px] font-extrabold tracking-tight">
                Project Objective & Impact
              </h3>
            </div>
            <p className="text-xs text-[#5F7E6C] leading-relaxed">
              EchoNav empowers visually impaired individuals with enhanced spatial confidence and independent mobility. By translating real-time physical proximity into intuitive tactile vibration cues, it bridges the gap between traditional white mobility canes and modern sensor-assisted spatial navigation.
            </p>
          </div>

          {/* 3. Project Credits Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8] text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0B3821]">
              <HeartHandshake className="w-4.5 h-4.5 text-[#0D8249]" />
              <span>EchoNav Assistive Technology Project</span>
            </div>
            <p className="text-xs text-[#7A9586] leading-relaxed">
              Engineered with passion for assistive accessibility, personal safety, and independent mobility for the visually impaired community.
            </p>
          </div>
        </div>

        {/* Right Column: How it Works, Hardware, & Device Specs */}
        <div className="space-y-4">
          {/* 4. How It Works (Step-by-Step Flow) */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8] space-y-3">
            <div className="flex items-center gap-2.5 text-[#0B3821] pb-2 border-b border-[#F0F5F1]">
              <div className="w-8 h-8 rounded-xl bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
                <Layers className="w-4.5 h-4.5 stroke-[2.4]" />
              </div>
              <h3 className="text-[15px] font-extrabold tracking-tight">
                How It Works (System Pipeline)
              </h3>
            </div>

            <div className="space-y-3 text-xs text-[#5F7E6C]">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E8F5E9] text-[#0D8249] font-extrabold text-xs flex items-center justify-center mt-0.5 border border-[#CDE7D2]">
                  1
                </span>
                <div className="flex-1 leading-relaxed">
                  <span className="font-bold text-[#0B3821]">Ultrasonic Detection:</span> Forward-facing sensor continuously scans the physical path for proximity obstacles.
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E8F5E9] text-[#0D8249] font-extrabold text-xs flex items-center justify-center mt-0.5 border border-[#CDE7D2]">
                  2
                </span>
                <div className="flex-1 leading-relaxed">
                  <span className="font-bold text-[#0B3821]">Embedded Processing:</span> Onboard ESP32 microcontroller processes echo time-of-flight into calibrated centimeters.
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E8F5E9] text-[#0D8249] font-extrabold text-xs flex items-center justify-center mt-0.5 border border-[#CDE7D2]">
                  3
                </span>
                <div className="flex-1 leading-relaxed">
                  <span className="font-bold text-[#0B3821]">Multimodal Haptics & Audio:</span> Proportional tactile vibrations and synthesized voice alerts communicate proximity levels.
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E8F5E9] text-[#0D8249] font-extrabold text-xs flex items-center justify-center mt-0.5 border border-[#CDE7D2]">
                  4
                </span>
                <div className="flex-1 leading-relaxed">
                  <span className="font-bold text-[#0B3821]">EchoNav Companion Dashboard:</span> Web dashboard displays live radar visuals, distance telemetry, and danger analytics.
                </div>
              </div>
            </div>
          </div>

          {/* 5. Hardware Components */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8] space-y-3">
            <div className="flex items-center gap-2.5 text-[#0B3821] pb-2 border-b border-[#F0F5F1]">
              <div className="w-8 h-8 rounded-xl bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
                <Cpu className="w-4.5 h-4.5 stroke-[2.4]" />
              </div>
              <h3 className="text-[15px] font-extrabold tracking-tight">
                Hardware Architecture
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
                <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
                  <Cpu className="w-4 h-4 text-[#0D8249]" />
                  <span>ESP32 Microcontroller</span>
                </div>
                <span className="text-[11px] font-bold text-[#5F7E6C]">Core MCU</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
                <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
                  <Radio className="w-4 h-4 text-[#0D8249]" />
                  <span>Ultrasonic Proximity Sensor</span>
                </div>
                <span className="text-[11px] font-bold text-[#5F7E6C]">10–200 cm Range</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
                <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
                  <Zap className="w-4 h-4 text-[#0D8249]" />
                  <span>Haptic Vibration Motor</span>
                </div>
                <span className="text-[11px] font-bold text-[#5F7E6C]">Tactile Cues</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
                <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
                  <Bluetooth className="w-4 h-4 text-[#0D8249]" />
                  <span>Bluetooth Low Energy (BLE 5.0)</span>
                </div>
                <span className="text-[11px] font-bold text-[#5F7E6C]">Wireless Link</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF]">
                <div className="flex items-center gap-2.5 text-[#0B3821] font-semibold">
                  <BatteryCharging className="w-4 h-4 text-[#0D8249]" />
                  <span>Rechargeable Li-Po Battery</span>
                </div>
                <span className="text-[11px] font-bold text-[#5F7E6C]">Portable Power</span>
              </div>
            </div>
          </div>

          {/* 6. Device Specifications */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8] space-y-2.5">
            <div className="flex items-center gap-2.5 text-[#0B3821] pb-2 border-b border-[#F0F5F1]">
              <div className="w-8 h-8 rounded-xl bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
                <Sparkles className="w-4.5 h-4.5 stroke-[2.4]" />
              </div>
              <h3 className="text-[15px] font-extrabold tracking-tight">
                System Specifications
              </h3>
            </div>

            <div className="divide-y divide-[#F0F5F1] text-xs">
              <div className="py-2 flex justify-between items-center">
                <span className="text-[#0B3821] font-medium">Device Profile</span>
                <span className="text-[#5F7E6C] font-semibold">Echonav Glove</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-[#0B3821] font-medium">Firmware Version</span>
                <span className="text-[#5F7E6C] font-semibold">v1.0.0</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-[#0B3821] font-medium">Application Software</span>
                <span className="text-[#5F7E6C] font-semibold">v1.0.0 (Web Architecture)</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-[#0B3821] font-medium">System Telemetry State</span>
                <span className="text-[#0D8249] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Operational (Simulated Prototype)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
