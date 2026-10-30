import React from 'react';
import { RadarDisplay } from '../components/home/RadarDisplay';
import { AlertBanner } from '../components/home/AlertBanner';
import { MetricCard } from '../components/common/MetricCard';
import { MapPin, Battery } from 'lucide-react';
import { DangerLevel, VibrationLevel } from '../types/echonav';

interface HomeScreenProps {
  distance: number;
  dangerLevel: DangerLevel;
  vibrationLevel: VibrationLevel;
  batteryPercentage: number;
  isConnected?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  distance,
  dangerLevel,
  vibrationLevel,
  batteryPercentage,
  isConnected = true,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between px-5 pt-0 pb-3.5 min-h-0 overflow-y-auto">
      {/* Center Radar & Cane Pedestrian Visualization */}
      <div className="flex-1 flex items-center justify-center my-auto min-h-0 py-1">
        <RadarDisplay
          distance={distance}
          dangerLevel={dangerLevel}
          isConnected={isConnected}
        />
      </div>

      {/* Bottom Information Stack */}
      <div className="space-y-3 flex-shrink-0 mt-1">
        {/* Dynamic Alert Banner Card */}
        <AlertBanner
          distance={distance}
          dangerLevel={dangerLevel}
          isConnected={isConnected}
        />

        {/* 3-Column Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Distance */}
          <MetricCard
            icon={<MapPin className="w-5 h-5 text-[#0D8249] fill-[#0D8249]/20 stroke-[2.2]" />}
            value={isConnected ? `${distance} cm` : '--'}
            label="Distance"
          />

          {/* Card 2: Vibration Level */}
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

          {/* Card 3: Battery */}
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
