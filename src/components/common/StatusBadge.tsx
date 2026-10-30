import React from 'react';

interface StatusBadgeProps {
  level: 'High' | 'Medium' | 'Safe';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ level }) => {
  const styles = {
    High: 'bg-[#FDE8E8] text-[#DC2626]',
    Medium: 'bg-[#FEF3C7] text-[#D97706]',
    Safe: 'bg-[#DCFCE7] text-[#16A34A]',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold leading-none inline-flex items-center justify-center min-w-[54px] ${styles[level]}`}
    >
      {level}
    </span>
  );
};
