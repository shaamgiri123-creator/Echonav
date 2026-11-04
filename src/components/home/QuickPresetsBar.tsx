import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickPresetsBarProps {
  currentDistance: number;
  onSetDistance: (dist: number) => void;
  className?: string;
}

export const QuickPresetsBar: React.FC<QuickPresetsBarProps> = ({
  currentDistance,
  onSetDistance,
  className = '',
}) => {
  const presets = [
    {
      val: 20,
      label: '20 cm',
      desc: 'High',
      activeClass: 'bg-red-700 text-white shadow-sm ring-2 ring-red-400 font-extrabold',
      idleClass: 'bg-red-50 text-red-900 hover:bg-red-100 border border-red-300 font-bold',
    },
    {
      val: 35,
      label: '35 cm',
      desc: 'Obstacle',
      activeClass: 'bg-[#15803D] text-white shadow-sm ring-2 ring-emerald-400 font-extrabold',
      idleClass: 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300 font-bold',
    },
    {
      val: 60,
      label: '60 cm',
      desc: 'Caution',
      activeClass: 'bg-[#B45309] text-white shadow-sm ring-2 ring-amber-400 font-extrabold',
      idleClass: 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300 font-bold',
    },
    {
      val: 85,
      label: '85 cm',
      desc: 'Safe',
      activeClass: 'bg-[#0B3821] text-white shadow-sm ring-2 ring-[#0B3821]/40 font-extrabold',
      idleClass: 'bg-slate-100 text-[#02140A] hover:bg-slate-200 border border-slate-300 font-bold',
    },
    {
      val: 120,
      label: '120 cm',
      desc: 'Clear',
      activeClass: 'bg-[#0B3821] text-white shadow-sm ring-2 ring-[#0B3821]/40 font-extrabold',
      idleClass: 'bg-slate-100 text-[#02140A] hover:bg-slate-200 border border-slate-300 font-bold',
    },
  ];

  return (
    <div
      className={`bg-white rounded-2xl p-3.5 border border-[#E7EFE8] shadow-sm select-none ${className}`}
      role="group"
      aria-label="Simulation Distance Presets"
    >
      <div className="flex items-center justify-between text-xs font-extrabold text-[#0B3821] mb-2">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#0D8249]" />
          <span>Quick Proximity Presets</span>
        </span>
        <span className="text-[11px] font-bold text-[#5F7E6C]">
          Simulated Feed
        </span>
      </div>

      {/* 5-Button Grid: Touch friendly and responsive */}
      <div className="grid grid-cols-5 gap-1.5">
        {presets.map(({ val, label, desc, activeClass, idleClass }) => {
          const isActive = currentDistance === val;
          return (
            <button
              key={val}
              onClick={() => onSetDistance(val)}
              aria-label={`Set simulated distance to ${val} centimeters (${desc})`}
              aria-pressed={isActive}
              className={`py-2 px-1 rounded-xl text-center transition-all duration-150 min-h-[44px] flex flex-col items-center justify-center focus:outline-none active:scale-95 ${
                isActive ? activeClass : idleClass
              }`}
            >
              <span className="text-[11px] sm:text-xs font-extrabold leading-tight">
                {label}
              </span>
              <span className="text-[9px] font-semibold opacity-85 leading-tight mt-0.5">
                {desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
