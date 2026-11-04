import React, { useState, useEffect, useRef } from 'react';
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
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const clearTriggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleConfirmClear = () => {
    onClearHistory();
    setShowConfirmModal(false);
    setFeedbackMessage('Detection history has been cleared successfully.');
    // Restore focus to main card or container
    setTimeout(() => {
      setFeedbackMessage('');
    }, 4000);
  };

  // Keyboard accessibility: Escape key listener and focus trapping for modal dialog
  useEffect(() => {
    if (!showConfirmModal) return;

    // Focus cancel button on open
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowConfirmModal(false);
        clearTriggerBtnRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmModal]);

  return (
    <div className="flex-1 px-4 sm:px-5 pt-1 pb-4 min-h-0 flex flex-col overflow-y-auto relative">
      <h1 className="sr-only">Detection History and Proximity Logs</h1>

      {/* Screen Reader Live Feedback for Clear History */}
      <div role="status" aria-live="polite" className="sr-only">
        {feedbackMessage}
      </div>

      {/* 1. Detection Analytics & Trend Chart (Section 3) */}
      <DetectionAnalytics history={history} />

      {/* 2. Chronological Readings Card */}
      <section
        aria-labelledby="history-heading"
        className="bg-white rounded-[32px] p-5 shadow-[0_4px_16px_rgba(11,56,33,0.05)] border border-[#E7EFE8] flex-1 flex flex-col min-h-[300px]"
      >
        {/* Section Heading: "Today" + Clear History Button with 44px touch target */}
        <div className="pb-3 border-b border-[#F0F5F1] flex-shrink-0 flex items-center justify-between">
          <h2 id="history-heading" className="text-[19px] font-extrabold text-[#0B3821] tracking-tight">
            Today
          </h2>

          {history.length > 0 && (
            <button
              ref={clearTriggerBtnRef}
              onClick={() => setShowConfirmModal(true)}
              className="min-h-[44px] min-w-[44px] flex items-center gap-2 text-xs font-bold text-[#8B9E94] hover:text-[#DC2626] transition-colors px-3 py-2 rounded-xl hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-[#DC2626] active:scale-95"
              aria-label="Clear all detection history"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Chronological List of Detection Records wrapped in semantic <ul> and <li> */}
        <div className="flex-1 pr-0.5 mt-0.5">
          {history.length === 0 ? (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 text-[#7A9586]">
              <AlertCircle className="w-8 h-8 text-[#A3B8AC] mb-2 stroke-[1.8]" />
              <div className="text-sm font-bold text-[#0B3821]">No Detection History</div>
              <p className="text-xs mt-1 max-w-[220px] leading-relaxed">
                New detection readings will automatically appear here as simulated sensor events occur.
              </p>
            </div>
          ) : (
            <ul
              role="list"
              aria-label="Obstacle detection records"
              className="divide-y divide-[#F0F5F1]"
            >
              {history.map((item) => {
                const dotColor =
                  item.level === 'High'
                    ? 'bg-[#EF4444]'
                    : item.level === 'Medium'
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#10B981]';

                return (
                  <li
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-3 text-left transition-colors duration-150 hover:bg-[#F9FCFA] rounded-xl px-1"
                  >
                    {/* Timestamp */}
                    <time
                      dateTime={new Date(item.timestamp).toISOString()}
                      className="text-[13px] font-semibold text-[#8B9E94] min-w-[72px] flex-shrink-0"
                    >
                      {item.time}
                    </time>

                    {/* Coloured Status Dot Indicator */}
                    <div className="flex-shrink-0" aria-hidden="true">
                      <span className={`block w-2.5 h-2.5 rounded-full ${dotColor} shadow-sm`} />
                    </div>

                    {/* Event Details (Status & Distance) */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-[14.5px] font-extrabold text-[#0B3821] truncate leading-snug">
                        {item.status}
                      </div>
                      <div className="text-[12.5px] font-semibold text-[#7A9586] truncate mt-0.5 leading-tight">
                        {item.distance !== undefined
                          ? `Distance: ${item.distance} cm`
                          : 'No obstacle detected'}
                      </div>
                    </div>

                    {/* Rounded Severity Badge */}
                    <div className="flex-shrink-0">
                      <StatusBadge level={item.level} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Confirmation Modal Dialog for Clear History */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-title"
          aria-describedby="clear-modal-desc"
        >
          <div className="bg-white rounded-3xl p-6 max-w-[340px] w-full shadow-2xl border-2 border-[#E7EFE8] text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#DC2626] mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 id="clear-modal-title" className="text-base font-extrabold text-[#0B3821]">
              Clear Detection History?
            </h3>
            <p id="clear-modal-desc" className="text-xs text-[#5F7E6C] mt-1.5 leading-relaxed">
              Are you sure you want to remove all logged obstacle detection readings? This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                ref={cancelBtnRef}
                onClick={() => {
                  setShowConfirmModal(false);
                  clearTriggerBtnRef.current?.focus();
                }}
                className="min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold text-[#0B3821] bg-[#F0F5F1] hover:bg-[#E4ECE5] transition-colors focus-visible:ring-2 focus-visible:ring-[#0D8249]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC2626]"
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
