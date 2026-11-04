import React from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { DangerLevel } from '../../types/echonav';

interface AlertBannerProps {
  distance: number;
  dangerLevel: DangerLevel;
  isConnected?: boolean;
  isVoiceAlertActive?: boolean;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  distance,
  dangerLevel,
  isConnected = true,
  isVoiceAlertActive = false,
}) => {
  // When Web Speech API is actively announcing aloud, keep aria-live off to prevent double-speech collisions
  const liveSetting = isVoiceAlertActive ? 'off' : 'polite';

  if (!isConnected) {
    return (
      <div
        className="w-full bg-[#F3F6F4] border border-[#DCE4DF] rounded-2xl py-3 px-4 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors duration-300"
        role="status"
        aria-live={liveSetting}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700">
          <AlertCircle className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-[15px] font-extrabold text-slate-800 leading-tight">
            Device Disconnected
          </div>
          <div className="text-[12px] font-semibold text-slate-600 mt-0.5 leading-tight">
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
        aria-live={isVoiceAlertActive ? 'off' : 'assertive'}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-[#DC2626]">
          <AlertTriangle className="w-5 h-5 fill-[#DC2626] text-white stroke-[1.6]" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-[15px] font-extrabold text-[#991B1B] leading-tight">
            Obstacle Detected!
          </div>
          <div className="text-[13px] font-bold text-[#991B1B] mt-0.5 leading-tight">
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
        aria-live={liveSetting}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-[#D97706]">
          <AlertTriangle className="w-5 h-5 fill-[#D97706] text-white stroke-[1.6]" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-[15px] font-extrabold text-[#78350F] leading-tight">
            Obstacle Detected!
          </div>
          <div className="text-[13px] font-bold text-[#78350F] mt-0.5 leading-tight">
            Distance: {distance} cm (Caution Zone)
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
      aria-live={liveSetting}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-[#14532D]">
        <CheckCircle2 className="w-5 h-5 stroke-[2.4]" />
      </div>
      <div className="flex-1 text-left">
        <div className="text-[15px] font-extrabold text-[#14532D] leading-tight">
          Clear Path
        </div>
        <div className="text-[13px] font-bold text-[#14532D] mt-0.5 leading-tight">
          No obstacles detected ({distance} cm)
        </div>
      </div>
    </div>
  );
};
