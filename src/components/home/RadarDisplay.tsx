import React, { useEffect, useState } from 'react';
import { PedestrianWithCaneSvg } from './PedestrianWithCaneSvg';
import { ObstacleConeSvg } from './ObstacleConeSvg';
import { DangerLevel } from '../../types/echonav';

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

  const textColor = isHigh
    ? 'text-[#DC2626]'
    : isMedium
    ? 'text-[#D97706]'
    : 'text-[#15803D]';

  const dashedLineBorder = isHigh
    ? 'border-[#EF4444]'
    : isMedium
    ? 'border-[#F59E0B]'
    : 'border-[#16A34A]';

  // Dynamic radar wave colors based on danger level
  const outerRingBorder = isHigh
    ? 'border-red-300/70 bg-red-50/25'
    : isMedium
    ? 'border-amber-300/70 bg-amber-50/25'
    : 'border-[#D5EAD8]/80 bg-[#F4FAF5]/40';

  const middleRingBorder = isHigh
    ? 'border-red-400/80 bg-red-100/25'
    : isMedium
    ? 'border-amber-400/80 bg-amber-100/25'
    : 'border-[#CDE7D2]/85 bg-[#EAF7ED]/35';

  const innerRingBorder = isHigh
    ? 'border-red-500/80 bg-red-200/25'
    : isMedium
    ? 'border-amber-500/80 bg-amber-200/25'
    : 'border-[#C1E2C7]/90 bg-[#DEF3E2]/40';

  const coreGlow = isHigh
    ? 'bg-red-400/35'
    : isMedium
    ? 'bg-amber-400/35'
    : 'bg-[#D4EED8]/50';

  // Radar pulse animation duration varies with proximity
  const pulseDuration = isHigh ? '1.2s' : isMedium ? '2.2s' : '4.0s';

  // Subtle visual feedback pulse when distance updates
  const [pulseFeedback, setPulseFeedback] = useState(false);
  useEffect(() => {
    setPulseFeedback(true);
    const timer = setTimeout(() => setPulseFeedback(false), 350);
    return () => clearTimeout(timer);
  }, [distance]);

  return (
    <div className="relative w-[320px] h-[320px] max-w-full max-h-[44vh] aspect-square mx-auto flex items-center justify-center my-0">
      {/* Concentric Radar Rings background - Animated based on distance */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outermost Ring */}
        <div
          className={`w-[316px] h-[316px] max-w-full max-h-full rounded-full border ${outerRingBorder} transition-colors duration-500`}
        />
        {/* Middle Ring with active pulse */}
        <div
          style={{ animationDuration: pulseDuration }}
          className={`absolute w-[246px] h-[246px] rounded-full border ${middleRingBorder} animate-radar transition-colors duration-500`}
        />
        {/* Inner Ring */}
        <div
          className={`absolute w-[176px] h-[176px] rounded-full border ${innerRingBorder} transition-colors duration-500`}
        />
        {/* Core Soft Glow */}
        <div
          className={`absolute w-[120px] h-[120px] rounded-full ${coreGlow} blur-[2px] transition-colors duration-500`}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pt-1 pb-2">
        {/* Top: Obstacle Cone + Dashed Guideline + Distance Indicator */}
        <div className="flex flex-col items-center pt-0.5 transition-all duration-300">
          {/* Obstacle Cone with dynamic danger visual state */}
          <ObstacleConeSvg className="w-14 h-14" dangerLevel={dangerLevel} />

          {/* Dynamic Guideline towards Pedestrian */}
          <div
            className={`h-4 border-l-2 border-dashed ${dashedLineBorder} my-0.5 opacity-90 transition-colors duration-300`}
          />

          {/* Obstacle Distance Text with smooth scale & visual feedback */}
          <div
            className={`text-[15px] font-extrabold ${textColor} tracking-tight leading-none transition-all duration-200 transform ${
              pulseFeedback ? 'scale-110 drop-shadow-sm' : 'scale-100'
            }`}
          >
            {isConnected ? `${distance} cm` : '-- cm'}
          </div>
        </div>

        {/* Lower/Center: Visually Impaired Pedestrian Walking with Cane */}
        <div className="flex items-center justify-center pb-2">
          <PedestrianWithCaneSvg className="w-28 h-38 drop-shadow-[0_2px_4px_rgba(11,56,33,0.08)]" />
        </div>
      </div>
    </div>
  );
};
