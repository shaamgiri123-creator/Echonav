import React, { useEffect, useState } from 'react';
import { PedestrianWithCaneSvg } from './PedestrianWithCaneSvg';
import { ObstacleConeSvg } from './ObstacleConeSvg';
import { DangerLevel } from '../../types/echonav';
import { WifiOff } from 'lucide-react';

interface RadarDisplayProps {
  distance: number;
  dangerLevel: DangerLevel;
  isConnected?: boolean;
}

export const RadarDisplay: React.FC<RadarDisplayProps> = ({
  distance,
  dangerLevel,
  isConnected = true,
}) => {
  const isHigh = dangerLevel === 'High';
  const isMedium = dangerLevel === 'Medium';

  const textColor = !isConnected
    ? 'text-slate-400'
    : isHigh
    ? 'text-[#DC2626]'
    : isMedium
    ? 'text-[#D97706]'
    : 'text-[#15803D]';

  const dashedLineBorder = !isConnected
    ? 'border-slate-300'
    : isHigh
    ? 'border-[#EF4444]'
    : isMedium
    ? 'border-[#F59E0B]'
    : 'border-[#16A34A]';

  // Dynamic radar wave colors based on danger level & connection
  const outerRingBorder = !isConnected
    ? 'border-slate-200 bg-slate-50/20'
    : isHigh
    ? 'border-red-300/70 bg-red-50/25'
    : isMedium
    ? 'border-amber-300/70 bg-amber-50/25'
    : 'border-[#D5EAD8]/80 bg-[#F4FAF5]/40';

  const middleRingBorder = !isConnected
    ? 'border-slate-200 bg-slate-100/20'
    : isHigh
    ? 'border-red-400/80 bg-red-100/25'
    : isMedium
    ? 'border-amber-400/80 bg-amber-100/25'
    : 'border-[#CDE7D2]/85 bg-[#EAF7ED]/35';

  const innerRingBorder = !isConnected
    ? 'border-slate-200 bg-slate-100/20'
    : isHigh
    ? 'border-red-500/80 bg-red-200/25'
    : isMedium
    ? 'border-amber-500/80 bg-amber-200/25'
    : 'border-[#C1E2C7]/90 bg-[#DEF3E2]/40';

  const coreGlow = !isConnected
    ? 'bg-slate-200/30'
    : isHigh
    ? 'bg-red-400/35'
    : isMedium
    ? 'bg-amber-400/35'
    : 'bg-[#D4EED8]/50';

  // Radar pulse animation duration varies with proximity; paused when disconnected
  const pulseDuration = isHigh ? '1.2s' : isMedium ? '2.2s' : '4.0s';

  // Subtle visual feedback pulse when distance updates
  const [pulseFeedback, setPulseFeedback] = useState(false);
  useEffect(() => {
    if (!isConnected) return;
    setPulseFeedback(true);
    const timer = setTimeout(() => setPulseFeedback(false), 350);
    return () => clearTimeout(timer);
  }, [distance, isConnected]);

  // 1. Dynamic Obstacle Positioning:
  // Maps distance 10cm–200cm smoothly to vertical translation:
  // At 200cm (far away): translateY = 0px
  // At 10cm (close to cane): translateY = 46px
  const clampedDist = Math.max(10, Math.min(200, distance));
  const proximityRatio = (200 - clampedDist) / (200 - 10);
  const dynamicTranslateY = isConnected ? Math.round(proximityRatio * 46) : 0;

  return (
    <div
      className="relative w-full max-w-[310px] sm:max-w-[340px] lg:max-w-[370px] aspect-square mx-auto flex items-center justify-center my-0 select-none"
      role="region"
      aria-label="Ultrasonic Proximity Radar Visualizer"
    >
      {/* Concentric Radar Rings background - fluid percentage sizing for small mobile screens */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        isConnected ? 'opacity-100' : 'opacity-40'
      }`}>
        {/* Outermost Ring */}
        <div
          className={`w-[98%] h-[98%] rounded-full border ${outerRingBorder} transition-colors duration-500`}
        />
        {/* Middle Ring with active pulse (stops when disconnected) */}
        <div
          style={{ animationDuration: isConnected ? pulseDuration : undefined }}
          className={`absolute w-[76%] h-[76%] rounded-full border ${middleRingBorder} ${
            isConnected ? 'animate-radar' : ''
          } transition-colors duration-500`}
        />
        {/* Inner Ring */}
        <div
          className={`absolute w-[54%] h-[54%] rounded-full border ${innerRingBorder} transition-colors duration-500`}
        />
        {/* Core Soft Glow */}
        <div
          className={`absolute w-[36%] h-[36%] rounded-full ${coreGlow} blur-[2px] transition-colors duration-500`}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pt-1 pb-2">
        {/* Top: Obstacle Cone + Dashed Guideline + Distance Indicator with dynamic vertical positioning */}
        <div
          style={{ transform: `translateY(${dynamicTranslateY}px)` }}
          className="flex flex-col items-center pt-0.5 transition-transform duration-500 ease-out z-20"
        >
          {/* Obstacle Cone with dynamic danger visual state */}
          <ObstacleConeSvg
            className="w-13 h-13 sm:w-14 sm:h-14"
            dangerLevel={isConnected ? dangerLevel : 'Safe'}
          />

          {/* Dynamic Guideline towards Pedestrian */}
          <div
            className={`h-4 border-l-2 border-dashed ${dashedLineBorder} my-0.5 opacity-90 transition-colors duration-300`}
          />

          {/* Obstacle Distance Text with ARIA meter attributes and visual pulse */}
          <div
            role="meter"
            aria-valuenow={isConnected ? distance : 0}
            aria-valuemin={10}
            aria-valuemax={200}
            aria-valuetext={
              isConnected
                ? `${distance} centimeters obstacle distance, ${dangerLevel} danger level`
                : 'Device disconnected, radar in standby'
            }
            aria-label="Obstacle Proximity Reading"
            className={`text-[15px] font-extrabold ${textColor} tracking-tight leading-none transition-all duration-200 transform ${
              pulseFeedback ? 'scale-110 drop-shadow-sm' : 'scale-100'
            }`}
          >
            {isConnected ? `${distance} cm` : '-- cm'}
          </div>
        </div>

        {/* Lower/Center: Visually Impaired Pedestrian Walking with Cane */}
        <div className="flex items-center justify-center pb-2 relative z-10">
          <PedestrianWithCaneSvg className="w-28 h-38 drop-shadow-[0_2px_4px_rgba(11,56,33,0.08)]" />

          {/* Disconnected Standby Badge */}
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full bg-white/90 text-slate-600 border border-slate-300 shadow-sm backdrop-blur-sm">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Radar Standby</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
