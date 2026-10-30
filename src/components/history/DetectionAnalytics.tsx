import React from 'react';
import { DetectionReading } from '../../types/echonav';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';

interface DetectionAnalyticsProps {
  history: DetectionReading[];
}

export const DetectionAnalytics: React.FC<DetectionAnalyticsProps> = ({ history }) => {
  const totalReadings = history.length;
  const highCount = history.filter((h) => h.level === 'High').length;
  const mediumCount = history.filter((h) => h.level === 'Medium').length;
  const safeCount = history.filter((h) => h.level === 'Safe').length;

  const validDistances = history
    .filter((h) => h.distance !== undefined && h.distance !== null)
    .map((h) => h.distance as number);

  const avgDistance = validDistances.length
    ? Math.round(validDistances.reduce((acc, curr) => acc + curr, 0) / validDistances.length)
    : 0;

  // Prepare trend data (take latest 10 items in chronological left-to-right order)
  const trendReadings = [...history].reverse().slice(-10);

  // SVG Chart Dimensions
  const width = 310;
  const height = 90;
  const padX = 22;
  const padY = 12;

  // Map distances (0 to 200 cm) to coordinates
  const points = trendReadings.map((r, i) => {
    const val = r.distance !== undefined ? r.distance : 130;
    const x = padX + (i / Math.max(1, trendReadings.length - 1)) * (width - padX * 2);
    const y = height - padY - (val / 200) * (height - padY * 2);
    return { x, y, val, level: r.level, time: r.time };
  });

  const pathD = points.length
    ? points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '')
    : '';

  const areaD = points.length
    ? `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`
    : '';

  return (
    <div className="bg-white rounded-3xl p-4 shadow-[0_2px_12px_rgba(11,56,33,0.04)] border border-[#E7EFE8] mb-3.5">
      {/* Analytics Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#F0F5F1]">
        <div className="flex items-center gap-2 text-[#0B3821]">
          <div className="w-7 h-7 rounded-lg bg-[#EAF6ED] flex items-center justify-center text-[#0D8249]">
            <Activity className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h3 className="text-[15px] font-extrabold tracking-tight">Detection Analytics</h3>
        </div>
        <span className="text-[11px] font-bold text-[#5F7E6C] flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5 text-[#0D8249]" />
          Avg: {avgDistance} cm
        </span>
      </div>

      {/* Metrics Counters Grid */}
      <div className="grid grid-cols-4 gap-1.5 py-2.5 text-center">
        {/* Total */}
        <div className="bg-[#F8FAF8] rounded-xl p-1.5 border border-[#EEF4EF]">
          <div className="text-[10px] font-bold text-[#7A9586]">Total</div>
          <div className="text-[15px] font-extrabold text-[#0B3821]">{totalReadings}</div>
        </div>

        {/* High */}
        <div className="bg-[#FEEBEB]/60 rounded-xl p-1.5 border border-[#FCDADA]/80">
          <div className="text-[10px] font-bold text-[#DC2626]">High</div>
          <div className="text-[15px] font-extrabold text-[#B91C1C]">{highCount}</div>
        </div>

        {/* Medium */}
        <div className="bg-[#FEF3C7]/60 rounded-xl p-1.5 border border-[#FDE68A]/80">
          <div className="text-[10px] font-bold text-[#D97706]">Medium</div>
          <div className="text-[15px] font-extrabold text-[#B45309]">{mediumCount}</div>
        </div>

        {/* Safe */}
        <div className="bg-[#DCFCE7]/60 rounded-xl p-1.5 border border-[#BBF7D0]/80">
          <div className="text-[10px] font-bold text-[#15803D]">Safe</div>
          <div className="text-[15px] font-extrabold text-[#15803D]">{safeCount}</div>
        </div>
      </div>

      {/* Real-time Distance Trend Chart */}
      <div className="mt-1 pt-2 border-t border-[#F0F5F1]">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#0B3821] mb-1 px-1">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#0D8249]" />
            Proximity Trend (cm)
          </span>
          <span className="text-[10px] text-[#7A9586]">Recent Readings</span>
        </div>

        {trendReadings.length < 2 ? (
          <div className="py-4 text-center text-xs text-[#7A9586]">
            Gathering trend data...
          </div>
        ) : (
          <div className="w-full relative overflow-hidden rounded-xl bg-[#F8FCF9] border border-[#E3EDE5] p-1">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-20 overflow-visible"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="#E5EFE7" strokeDasharray="2 3" />
              <line x1={padX} y1={height / 2} x2={width - padX} y2={height / 2} stroke="#E5EFE7" strokeDasharray="2 3" />
              <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#E5EFE7" />

              {/* Shaded Area */}
              <path d={areaD} fill="url(#trendGradient)" />

              {/* Path Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((pt, idx) => {
                const color =
                  pt.level === 'High'
                    ? '#EF4444'
                    : pt.level === 'Medium'
                    ? '#F59E0B'
                    : '#10B981';

                return (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="3.5" fill="#FFFFFF" stroke={color} strokeWidth="2" />
                    {idx === points.length - 1 && (
                      <text
                        x={pt.x}
                        y={pt.y - 7}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill={color}
                      >
                        {pt.val}cm
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
