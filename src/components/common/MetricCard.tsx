import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  label,
}) => {
  return (
    <div className="bg-white rounded-2xl py-3 px-2 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(11,56,33,0.04)] border border-[#E7EFE8] min-w-0 transition-transform duration-150 hover:translate-y-[-1px]">
      {/* Icon */}
      <div className="mb-1.5 text-[#0D8249] flex items-center justify-center h-5">
        {icon}
      </div>

      {/* Main Value */}
      <div className="text-[15px] font-extrabold text-[#0B3821] tracking-tight leading-tight truncate w-full">
        {value}
      </div>

      {/* Sub Label */}
      <div className="text-[11px] font-semibold text-[#7A9586] mt-0.5 leading-tight truncate w-full">
        {label}
      </div>
    </div>
  );
};
