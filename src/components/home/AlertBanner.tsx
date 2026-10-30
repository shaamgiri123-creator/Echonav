import React from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { DangerLevel } from '../../types/echonav';

interface AlertBannerProps {
  distance: number;
  dangerLevel: DangerLevel;
  isConnected?: boolean;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  distance,
  dangerLevel,
  isConnected = true,
}) => {
  if (!isConnected) {
    return (
      <div
        className="w-full bg-[#F3F6F4] border border-[#DCE4DF] rounded-2xl py-3 px-4 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors duration-300"
        role="status"
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
          <AlertCircle className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-[15px] font-extrabold text-slate-700 leading-tight">
            Device Disconnected
          </div>
          <div className="text-[12px] font-semibold text-slate-500 mt-0.5 leading-tight">
            Demo simulation paused • Reconnect in Demo Menu
          </div>
        </div>
      </div>
    );
  }

  if (dangerLevel === 'High') {
    return (
      <div
        className="w-full bg-[#FDECEB] border border-[#FAD8D6] rounded-2xl py-3 px-4 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(220,38,38,0.05)] transition-colors duration-300"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-[#DC2626]">
          <AlertTriangle className="w-5 h-5 fill-[#DC2626] text-white stroke-[1.6]" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-[15px] font-extrabold text-[#B91C1C] leading-tight">
            Obstacle Detected!
          </div>
          <div className="text-[13px] font-semibold text-[#B91C1C] mt-0.5 leading-tight">
            Distance: {distance} cm (High Danger)
          </div>
        </div>
      </div>
    );
  }

  if (dangerLevel === 'Medium') {
    return (
      <div
        className="w-full bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl py-3 px-4 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(217,119,6,0.05)] transition-colors duration-300"
        role="alert"
        aria-live="polite"
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-[#D97706]">
          <AlertTriangle className="w-5 h-5 fill-[#D97706] text-white stroke-[1.6]" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-[15px] font-extrabold text-[#92400E] leading-tight">
            Obstacle Detected!
          </div>
          <div className="text-[13px] font-semibold text-[#B45309] mt-0.5 leading-tight">
            Distance: {distance} cm (Medium Danger)
          </div>
        </div>
      </div>
    );
  }

  // Safe path
  return (
    <div
      className="w-full bg-[#EEF8F0] border border-[#D5EBD7] rounded-2xl py-3 px-4 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(16,185,129,0.05)] transition-colors duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-[#16A34A]">
        <CheckCircle2 className="w-5 h-5 stroke-[2.4]" />
      </div>
      <div className="flex-1 text-left">
        <div className="text-[15px] font-extrabold text-[#15803D] leading-tight">
          Clear Path
        </div>
        <div className="text-[13px] font-semibold text-[#16A34A] mt-0.5 leading-tight">
          No obstacles detected ({distance} cm)
        </div>
      </div>
    </div>
  );
};
