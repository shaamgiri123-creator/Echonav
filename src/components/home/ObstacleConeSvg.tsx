import React from 'react';
import { DangerLevel } from '../../types/echonav';

interface ObstacleConeSvgProps {
  className?: string;
  dangerLevel?: DangerLevel;
}

export const ObstacleConeSvg: React.FC<ObstacleConeSvgProps> = ({
  className = "w-14 h-14",
  dangerLevel = 'High',
}) => {
  // Theme palette based on danger state
  const isHigh = dangerLevel === 'High';
  const isMedium = dangerLevel === 'Medium';

  const auraColor = isHigh
    ? 'bg-red-400/25'
    : isMedium
    ? 'bg-amber-400/25'
    : 'bg-emerald-400/20';

  const pulseRingBorder = isHigh
    ? 'border-red-300/40 bg-red-100/30'
    : isMedium
    ? 'border-amber-300/40 bg-amber-100/30'
    : 'border-emerald-300/40 bg-emerald-100/30';

  const primaryFill = isHigh
    ? '#DC2626'
    : isMedium
    ? '#D97706'
    : '#15803D';

  const secondaryFill = isHigh
    ? '#EF4444'
    : isMedium
    ? '#F59E0B'
    : '#16A34A';

  const shadowColor = isHigh
    ? 'rgba(220,38,38,0.3)'
    : isMedium
    ? 'rgba(217,119,6,0.3)'
    : 'rgba(22,163,74,0.25)';

  return (
    <div className={`relative flex items-center justify-center ${className} transition-all duration-300`}>
      {/* Ambient glowing aura */}
      <div className={`absolute inset-0 -m-2 rounded-full ${auraColor} blur-md pointer-events-none animate-pulse`} />

      {/* Faint danger pulse circle */}
      <div className={`absolute -inset-1 rounded-full border ${pulseRingBorder}`} />

      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 transition-transform duration-300"
        style={{ filter: `drop-shadow(0 4px 10px ${shadowColor})` }}
      >
        {/* Soft rounded base aura */}
        <ellipse
          cx="32"
          cy="54"
          rx="24"
          ry="5.5"
          fill={primaryFill}
          fillOpacity="0.25"
        />

        {/* Base of Cone */}
        <path
          d="M12 52 C12 50 16 48 32 48 C48 48 52 50 52 52 C52 54 48 56 32 56 C16 56 12 54 12 52 Z"
          fill={primaryFill}
        />

        {/* Bottom Tier */}
        <path
          d="M18 49 L21 40 C28 41 36 41 43 40 L46 49 C42 51 22 51 18 49 Z"
          fill={secondaryFill}
        />

        {/* White Stripe 1 */}
        <path
          d="M21 40 L24 32 C29 33 35 33 40 32 L43 40 C36 41 28 41 21 40 Z"
          fill="#FFFFFF"
        />

        {/* Middle Tier */}
        <path
          d="M24 32 L27 24 C30 25 34 25 37 24 L40 32 C35 33 29 33 24 32 Z"
          fill={secondaryFill}
        />

        {/* White Stripe 2 */}
        <path
          d="M27 24 L29 17 C31 18 33 18 35 17 L37 24 C34 25 30 25 27 24 Z"
          fill="#FFFFFF"
        />

        {/* Top Cap */}
        <path
          d="M29 17 C30 13 34 13 35 17 C33 18 31 18 29 17 Z"
          fill={primaryFill}
        />
      </svg>
    </div>
  );
};
