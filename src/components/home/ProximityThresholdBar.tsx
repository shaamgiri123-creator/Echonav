import React from 'react';
import { DangerLevel } from '../../types/echonav';
import { Sliders } from 'lucide-react';

interface ProximityThresholdBarProps {
  currentDistance: number;
  dangerLevel: DangerLevel;
  highThresholdCm: number;
  distanceThresholdCm: number;
  isConnected?: boolean;
}

export const ProximityThresholdBar: React.FC<ProximityThresholdBarProps> = ({
  currentDistance,
  dangerLevel,
  highThresholdCm = 40,
  distanceThresholdCm = 80,
  isConnected = true,
}) => {
  // Calculate segment percentage widths based on active thresholds
  const highPct = Math.max(10, Math.min(60, (highThresholdCm / 200) * 100));
  const mediumPct = Math.max(15, Math.min(60, ((distanceThresholdCm - highThresholdCm) / 200) * 100));
  const safePct = Math.max(20, 100 - (highPct + mediumPct));

  // Current distance pointer position along the bar
  const markerPct = Math.max(2, Math.min(98, (currentDistance / 200) * 100));

  const markerColor =
    dangerLevel === 'High'
      ? 'bg-red-600 text-white'
      : dangerLevel === 'Medium'
      ? 'bg-amber-500 text-white'
      : 'bg-emerald-600 text-white';

  return (
    <div
      className="bg-white rounded-2xl p-3.5 border border-[#E7EFE8] shadow-sm space-y-2 select-none"
      role="region"
      aria-label="Active Threshold Proximity Indicator"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-extrabold text-[#0B3821] flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#0D8249]" />
          <span>Active Proximity Zones</span>
        </span>
        <span className="text-[11px] font-bold text-[#5F7E6C]">
          Current: <strong className={isConnected ? (dangerLevel === 'High' ? 'text-red-600' : dangerLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-700') : 'text-slate-400'}>
            {isConnected ? `${currentDistance} cm` : 'Disconnected'}
          </strong>
        </span>
      </div>

      {/* Segmented Bar with Distance Marker */}
      <div className="relative pt-4 pb-1">
        {/* Dynamic Distance Marker Pin */}
        {isConnected && (
          <div
            style={{ left: `${markerPct}%` }}
            className="absolute top-0 -translate-x-1/2 transition-all duration-300 pointer-events-none z-10 flex flex-col items-center"
          >
            <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md shadow-sm ${markerColor} leading-tight whitespace-nowrap`}>
              {currentDistance}cm
            </span>
            <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4px] border-t-slate-700 mt-[-1px]" />
          </div>
        )}

        {/* 3-Zone Segmented Track */}
        <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-[#E7ECE8]">
          {/* High Danger Zone */}
          <div
            style={{ width: `${highPct}%` }}
            className="h-full bg-red-500/90 transition-all duration-300"
            title={`High Danger Zone: 0 - ${highThresholdCm} cm`}
          />
          {/* Medium Caution Zone */}
          <div
            style={{ width: `${mediumPct}%` }}
            className="h-full bg-amber-400/95 transition-all duration-300"
            title={`Medium Caution Zone: ${highThresholdCm + 1} - ${distanceThresholdCm} cm`}
          />
          {/* Safe Clear Zone */}
          <div
            style={{ width: `${safePct}%` }}
            className="h-full bg-emerald-500/90 transition-all duration-300"
            title={`Safe Zone: > ${distanceThresholdCm} cm`}
          />
        </div>
      </div>

      {/* Zone Legend Labels */}
      <div className="grid grid-cols-3 gap-1 text-[10px] font-extrabold text-center pt-0.5">
        <div className="text-red-900 bg-red-50 rounded-md py-0.5 border border-red-300">
          Danger ≤ {highThresholdCm}cm
        </div>
        <div className="text-amber-950 bg-amber-50 rounded-md py-0.5 border border-amber-300">
          Caution ≤ {distanceThresholdCm}cm
        </div>
        <div className="text-emerald-950 bg-emerald-50 rounded-md py-0.5 border border-emerald-300">
          Safe &gt; {distanceThresholdCm}cm
        </div>
      </div>
    </div>
  );
};
