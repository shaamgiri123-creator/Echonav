import React from 'react';
import { RadarDisplay } from '../components/home/RadarDisplay';
import { AlertBanner } from '../components/home/AlertBanner';
import { MetricCard } from '../components/common/MetricCard';
import { MapPin, Battery, Activity, Compass, ShieldCheck } from 'lucide-react';
import { DangerLevel, VibrationLevel } from '../types/echonav';

interface HomeScreenProps {
  distance: number;
  dangerLevel: DangerLevel;
  vibrationLevel: VibrationLevel;
  batteryPercentage: number;
  isConnected?: boolean;
  onSetDistance?: (distance: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  distance,
  dangerLevel,
  vibrationLevel,
  batteryPercentage,
  isConnected = true,
  onSetDistance,
}) => {
  return (
    <div className="w-full">
      {/* DESKTOP LAYOUT (Full-width responsive grid) */}
      <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Prominent Hero Radar Card */}
        <div className="col-span-7 bg-white rounded-3xl p-7 border border-[#E7EFE8] shadow-sm flex flex-col items-center justify-between min-h-[520px]">
          {/* Card Header */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-[#F0F5F1]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
                <Compass className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#0B3821] tracking-tight">
                  Real-Time Obstacle Radar
                </h3>
                <p className="text-xs font-medium text-[#5F7E6C]">
                  Ultrasonic spatial proximity & walking cane guidance
                </p>
              </div>
            </div>

            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#0D8249] border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Live Radar Feed</span>
            </span>
          </div>

          {/* Central Radar Visualization */}
          <div className="py-4 my-auto flex items-center justify-center w-full">
            <RadarDisplay
              distance={distance}
              dangerLevel={dangerLevel}
              isConnected={isConnected}
            />
          </div>

          {/* Radar Footer Guide */}
          <div className="w-full pt-3 border-t border-[#F0F5F1] flex items-center justify-between text-xs text-[#5F7E6C]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0D8249]" />
              Adaptive Proximity Zone: 10 cm – 200 cm
            </span>
            <span className="font-semibold text-[#0B3821]">
              Status: {dangerLevel === 'High' ? '🔴 High Danger' : dangerLevel === 'Medium' ? '🟠 Caution Zone' : '🟢 Path Clear'}
            </span>
          </div>
        </div>

        {/* Right Column: Telemetry Cards & Live Alert Stack */}
        <div className="col-span-5 space-y-5">
          {/* 1. Live Dynamic Alert Banner */}
          <AlertBanner
            distance={distance}
            dangerLevel={dangerLevel}
            isConnected={isConnected}
          />

          {/* 2. Three Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            {/* Distance */}
            <MetricCard
              icon={<MapPin className="w-5 h-5 text-[#0D8249] fill-[#0D8249]/20 stroke-[2.2]" />}
              value={isConnected ? `${distance} cm` : '--'}
              label="Distance"
            />

            {/* Vibration Level */}
            <MetricCard
              icon={
                <div className="flex items-end gap-1 h-5 w-5 justify-center">
                  <span className={`w-1 rounded-full transition-all duration-300 ${
                    vibrationLevel !== 'None' ? 'bg-[#0D8249] h-2' : 'bg-slate-300 h-1.5'
                  }`} />
                  <span className={`w-1 rounded-full transition-all duration-300 ${
                    vibrationLevel === 'Medium' || vibrationLevel === 'Strong' ? 'bg-[#0D8249] h-3.5' : 'bg-slate-300 h-1.5'
                  }`} />
                  <span className={`w-1 rounded-full transition-all duration-300 ${
                    vibrationLevel === 'Strong' ? 'bg-[#0D8249] h-5' : 'bg-slate-300 h-1.5'
                  }`} />
                </div>
              }
              value={isConnected ? vibrationLevel : 'Off'}
              label="Vibration Level"
            />

            {/* Battery */}
            <MetricCard
              icon={<Battery className="w-5 h-5 text-[#0D8249] stroke-[2.2]" />}
              value={isConnected ? `${batteryPercentage}%` : '--'}
              label="Battery"
            />
          </div>

          {/* 3. Obstacle Guidance Details Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#E7EFE8] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F5F1]">
              <span className="text-xs font-extrabold uppercase text-[#7A9586] tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#0D8249]" />
                Assistive Guidance
              </span>
              <span className="text-xs font-bold text-[#0D8249]">
                {dangerLevel === 'High' ? 'Urgent Alert' : dangerLevel === 'Medium' ? 'Advisory' : 'Safe to Proceed'}
              </span>
            </div>

            <p className="text-xs text-[#5F7E6C] leading-relaxed">
              {dangerLevel === 'High'
                ? 'Immediate physical obstacle detected within 40 cm. Strong tactile haptic pulsing activated on glove to advise immediate deceleration or course adjustment.'
                : dangerLevel === 'Medium'
                ? 'Object detected in forward path between 41 cm and 80 cm. Gentle intermittent haptic vibration warns the user of an approaching physical structure.'
                : 'Forward trajectory is unobstructed beyond 80 cm. System is actively scanning in standby navigation mode.'}
            </p>

            {/* Quick Interactive Presets Bar */}
            {onSetDistance && (
              <div className="pt-2 border-t border-[#F0F5F1]">
                <span className="text-[11px] font-bold text-[#0B3821] block mb-2">
                  Interactive Proximity Presets:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  <button
                    onClick={() => onSetDistance(20)}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all text-center ${
                      distance === 20 ? 'bg-red-600 text-white shadow-sm' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    }`}
                  >
                    20 cm
                  </button>
                  <button
                    onClick={() => onSetDistance(35)}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all text-center ${
                      distance === 35 ? 'bg-[#16A34A] text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    35 cm
                  </button>
                  <button
                    onClick={() => onSetDistance(60)}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all text-center ${
                      distance === 60 ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    60 cm
                  </button>
                  <button
                    onClick={() => onSetDistance(85)}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all text-center ${
                      distance === 85 ? 'bg-[#0B3821] text-white shadow-sm' : 'bg-slate-100 text-[#0B3821] hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    85 cm
                  </button>
                  <button
                    onClick={() => onSetDistance(120)}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all text-center ${
                      distance === 120 ? 'bg-[#0B3821] text-white shadow-sm' : 'bg-slate-100 text-[#0B3821] hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    120 cm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT (Full-width mobile screen without phone borders) */}
      <div className="lg:hidden flex flex-col justify-between space-y-3.5 pb-6">
        {/* Radar Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#E7EFE8] shadow-sm flex items-center justify-center">
          <RadarDisplay
            distance={distance}
            dangerLevel={dangerLevel}
            isConnected={isConnected}
          />
        </div>

        {/* Alert Banner Card */}
        <AlertBanner
          distance={distance}
          dangerLevel={dangerLevel}
          isConnected={isConnected}
        />

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <MetricCard
            icon={<MapPin className="w-5 h-5 text-[#0D8249] fill-[#0D8249]/20 stroke-[2.2]" />}
            value={isConnected ? `${distance} cm` : '--'}
            label="Distance"
          />

          <MetricCard
            icon={
              <div className="flex items-end gap-1 h-5 w-5 justify-center">
                <span className={`w-1 rounded-full transition-all duration-300 ${
                  vibrationLevel !== 'None' ? 'bg-[#0D8249] h-2' : 'bg-slate-300 h-1.5'
                }`} />
                <span className={`w-1 rounded-full transition-all duration-300 ${
                  vibrationLevel === 'Medium' || vibrationLevel === 'Strong' ? 'bg-[#0D8249] h-3.5' : 'bg-slate-300 h-1.5'
                }`} />
                <span className={`w-1 rounded-full transition-all duration-300 ${
                  vibrationLevel === 'Strong' ? 'bg-[#0D8249] h-5' : 'bg-slate-300 h-1.5'
                }`} />
              </div>
            }
            value={isConnected ? vibrationLevel : 'Off'}
            label="Vibration Level"
          />

          <MetricCard
            icon={<Battery className="w-5 h-5 text-[#0D8249] stroke-[2.2]" />}
            value={isConnected ? `${batteryPercentage}%` : '--'}
            label="Battery"
          />
        </div>
      </div>
    </div>
  );
};
