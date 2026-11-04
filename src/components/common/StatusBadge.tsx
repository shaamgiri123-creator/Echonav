import React from 'react';

interface StatusBadgeProps {
  level: 'High' | 'Medium' | 'Safe';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ level }) => {
  const styles = {
    High: 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] font-extrabold',
    Medium: 'bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D] font-extrabold',
    Safe: 'bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC] font-extrabold',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs leading-none inline-flex items-center justify-center min-w-[56px] transition-colors ${styles[level]}`}
    >
      {level}
    </span>
  );
};
