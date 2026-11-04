import React from 'react';
import { RadarDisplay } from '../components/home/RadarDisplay';
import { AlertBanner } from '../components/home/AlertBanner';
import { MetricCard } from '../components/common/MetricCard';
import { ProximityThresholdBar } from '../components/home/ProximityThresholdBar';
import { QuickPresetsBar } from '../components/home/QuickPresetsBar';
import { MapPin, Battery, Compass, ShieldCheck, Activity } from 'lucide-react';
import { DangerLevel, VibrationLevel } from '../types/echonav';

interface HomeScreenProps {
  distance: number;
  dangerLevel: DangerLevel;
  vibrationLevel: VibrationLevel;
  batteryPercentage: number;
  isConnected?: boolean;
  onSetDistance?: (distance: number) => void;
  highThresholdCm?: number;
  distanceThresholdCm?: number;
  isVoiceAlertActive?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  distance,
  dangerLevel,
  vibrationLevel,
  batteryPercentage,
  isConnected = true,
  onSetDistance,
  highThresholdCm = 40,
  distanceThresholdCm = 80,
  isVoiceAlertActive = false,
}) => {
  return (
    <div className="w-full">
      <h1 className="sr-only">EchoNav Live Obstacle Detection Dashboard</h1>

      {/* DESKTOP LAYOUT (12-Column Responsive Dashboard) */}
      <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Prominent Hero Radar Card */}
        <section
          aria-labelledby="radar-heading"
          className="col-span-7 bg-white rounded-3xl p-7 border border-[#E7EFE8] shadow-sm flex flex-col items-center justify-between min-h-[540px]"
        >
          {/* Card Header */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-[#F0F5F1]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
                <Compass className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div>
                <h2 id="radar-heading" className="text-lg font-extrabold text-[#0B3821] tracking-tight">
                  Real-Time Obstacle Radar
                </h2>
                <p className="text-xs font-medium text-[#5F7E6C]">
                  Ultrasonic spatial proximity & cane guidance visualizer
                </p>
              </div>
            </div>

            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
              isConnected
                ? 'bg-emerald-50 text-[#0D8249] border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-[#16A34A] animate-pulse' : 'bg-slate-400'
              }`} />
              <span>{isConnected ? 'Live Simulation Feed' : 'Standby / Offline'}</span>
            </span>
          </div>

          {/* Central Radar Visualization with Dynamic Cone Positioning */}
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
              Active Range: 10 cm – 200 cm
            </span>
            <span className="font-semibold text-[#0B3821]">
              Status: {dangerLevel === 'High' ? '🔴 High Danger' : dangerLevel === 'Medium' ? '🟠 Caution Zone' : '🟢 Path Clear'}
            </span>
          </div>
        </section>

        {/* Right Column: Telemetry, Dynamic Threshold Indicator & Presets */}
        <section aria-label="Obstacle Telemetry and Guidance Controls" className="col-span-5 space-y-4">
          {/* 1. Dynamic Alert Banner Card */}
          <AlertBanner
            distance={distance}
            dangerLevel={dangerLevel}
            isConnected={isConnected}
            isVoiceAlertActive={isVoiceAlertActive}
          />

          {/* 2. Three Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
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

          {/* 3. Dynamic Threshold Proximity Indicator (Phase 1 Feature) */}
          <ProximityThresholdBar
            currentDistance={distance}
            dangerLevel={dangerLevel}
            highThresholdCm={highThresholdCm}
            distanceThresholdCm={distanceThresholdCm}
            isConnected={isConnected}
          />

          {/* 4. Quick Testing Presets Bar (Desktop) */}
          {onSetDistance && (
            <QuickPresetsBar
              currentDistance={distance}
              onSetDistance={onSetDistance}
            />
          )}

          {/* 5. Assistive Context Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E7EFE8] shadow-sm text-xs text-[#5F7E6C] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#0B3821] pb-1 border-b border-[#F0F5F1]">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#0D8249]" />
                Assistive Guidance
              </span>
              <span className="text-[#0D8249]">
                {dangerLevel === 'High' ? 'Urgent Alert' : dangerLevel === 'Medium' ? 'Caution' : 'Path Clear'}
              </span>
            </div>
            <p className="pt-1 leading-relaxed">
              {dangerLevel === 'High'
                ? 'Immediate physical obstacle within danger zone. Strong haptic pulses active.'
                : dangerLevel === 'Medium'
                ? 'Approaching obstacle in forward path. Moderate haptic warning active.'
                : 'Forward trajectory is clear. Standard standby scanning active.'}
            </p>
          </div>
        </section>
      </div>

      {/* MOBILE LAYOUT (Full-width mobile screen with no horizontal scroll) */}
      <section aria-label="Mobile Obstacle Navigation Dashboard" className="lg:hidden flex flex-col space-y-3 pb-6">
        {/* Radar Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#E7EFE8] shadow-sm flex items-center justify-center">
          <RadarDisplay
            distance={distance}
            dangerLevel={dangerLevel}
            isConnected={isConnected}
          />
        </div>

        {/* Dynamic Alert Banner Card */}
        <AlertBanner
          distance={distance}
          dangerLevel={dangerLevel}
          isConnected={isConnected}
          isVoiceAlertActive={isVoiceAlertActive}
        />

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2">
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

        {/* Mobile Dynamic Threshold Indicator */}
        <ProximityThresholdBar
          currentDistance={distance}
          dangerLevel={dangerLevel}
          highThresholdCm={highThresholdCm}
          distanceThresholdCm={distanceThresholdCm}
          isConnected={isConnected}
        />

        {/* Mobile Quick-Testing Presets (Phase 1 Feature - Now Directly on Mobile Home Screen) */}
        {onSetDistance && (
          <QuickPresetsBar
            currentDistance={distance}
            onSetDistance={onSetDistance}
          />
        )}
      </section>
    </div>
  );
};
