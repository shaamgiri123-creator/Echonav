import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { DetectionReading } from '../types/echonav';
import { StatusBadge } from '../components/common/StatusBadge';
import { DetectionAnalytics } from '../components/history/DetectionAnalytics';

interface HistoryScreenProps {
  history: DetectionReading[];
  onClearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onClearHistory,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmClear = () => {
    onClearHistory();
    setShowConfirmModal(false);
  };

  return (
    <div className="flex-1 px-5 pt-1 pb-4 min-h-0 flex flex-col overflow-y-auto relative">
      {/* 1. Detection Analytics & Trend Chart (Section 3) */}
      <DetectionAnalytics history={history} />

      {/* 2. Chronological Readings Card (Matches history.png) */}
      <div className="bg-white rounded-[32px] p-5 shadow-[0_4px_16px_rgba(11,56,33,0.05)] border border-[#E7EFE8] flex-1 flex flex-col min-h-[300px]">
        {/* Section Heading: "Today" + Clear History Button */}
        <div className="pb-3 border-b border-[#F0F5F1] flex-shrink-0 flex items-center justify-between">
          <h2 className="text-[19px] font-extrabold text-[#0B3821] tracking-tight">
            Today
          </h2>

          {history.length > 0 && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#8B9E94] hover:text-[#DC2626] transition-colors px-2.5 py-1 rounded-xl hover:bg-red-50 focus:outline-none active:scale-95"
              aria-label="Clear all detection history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Chronological List of Detection Records */}
        <div className="flex-1 divide-y divide-[#F0F5F1] pr-0.5 mt-0.5">
          {history.length === 0 ? (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 text-[#7A9586]">
              <AlertCircle className="w-8 h-8 text-[#A3B8AC] mb-2 stroke-[1.8]" />
              <div className="text-sm font-bold text-[#0B3821]">No Detection History</div>
              <p className="text-xs mt-1 max-w-[220px] leading-relaxed">
                New detection readings will automatically appear here as simulated sensor events occur.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const dotColor =
                item.level === 'High'
                  ? 'bg-[#EF4444]'
                  : item.level === 'Medium'
                  ? 'bg-[#F59E0B]'
                  : 'bg-[#10B981]';

              return (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-3 text-left transition-colors duration-150 hover:bg-[#F9FCFA] rounded-xl px-1"
                >
                  {/* Timestamp */}
                  <div className="text-[13px] font-semibold text-[#8B9E94] min-w-[62px] flex-shrink-0">
                    {item.time}
                  </div>

                  {/* Coloured Status Dot Indicator */}
                  <div className="flex-shrink-0">
                    <span className={`block w-2.5 h-2.5 rounded-full ${dotColor} shadow-sm`} />
                  </div>

                  {/* Event Details (Status & Distance) */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="text-[14.5px] font-extrabold text-[#0B3821] truncate leading-snug">
                      {item.status}
                    </div>
                    <div className="text-[12.5px] font-medium text-[#7A9586] truncate mt-0.5 leading-tight">
                      {item.distance !== undefined
                        ? `Distance: ${item.distance} cm`
                        : 'No obstacle detected'}
                    </div>
                  </div>

                  {/* Rounded Severity Badge */}
                  <div className="flex-shrink-0">
                    <StatusBadge level={item.level} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirmation Modal Dialog for Clear History */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-5 max-w-[320px] w-full shadow-2xl border border-[#E7EFE8] text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#DC2626] mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-extrabold text-[#0B3821]">
              Clear Detection History?
            </h3>
            <p className="text-xs text-[#5F7E6C] mt-1.5 leading-relaxed">
              Are you sure you want to remove all logged obstacle detection readings? This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-[#5F7E6C] bg-[#F0F5F1] hover:bg-[#E4ECE5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors shadow-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
