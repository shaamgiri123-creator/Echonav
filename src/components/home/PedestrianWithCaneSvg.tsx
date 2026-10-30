import React from 'react';

interface PedestrianWithCaneSvgProps {
  className?: string;
  color?: string;
}

export const PedestrianWithCaneSvg: React.FC<PedestrianWithCaneSvgProps> = ({
  className = "w-32 h-44",
  color = "#0B3821"
}) => {
  return (
    <svg
      viewBox="0 0 170 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pedestrian walking with white mobility cane"
      role="img"
    >
      {/* Head */}
      <circle cx="84" cy="30" r="16" fill={color} />

      {/* Torso & Upper Body in forward walking posture */}
      <path
        d="M70 52 C65 58, 61 72, 60 94 C60 108, 63 120, 68 126 C75 128, 88 125, 96 120 C99 104, 98 84, 95 64 C93 54, 86 50, 78 50 C74 50, 71 51, 70 52 Z"
        fill={color}
      />

      {/* Left arm (stabilizing backward) */}
      <path
        d="M66 58 C59 68, 53 82, 51 96 C49 100, 53 104, 57 102 C61 100, 65 86, 71 70 Z"
        fill={color}
      />

      {/* Right arm reaching forward gripping cane */}
      <path
        d="M89 60 C97 70, 104 84, 110 98 C112 102, 108 106, 103 105 C98 103, 91 92, 85 78 Z"
        fill={color}
      />
      {/* Hand holding the cane */}
      <circle cx="108" cy="100" r="5" fill={color} />

      {/* Rear Trailing Leg */}
      <path
        d="M70 124 C65 138, 57 156, 51 172 C46 186, 42 198, 38 210 C36 215, 44 218, 48 212 C56 198, 67 174, 76 150 C78 142, 80 132, 80 124 Z"
        fill={color}
      />
      {/* Trailing Foot */}
      <path
        d="M36 210 C31 213, 26 217, 28 221 C30 224, 45 223, 48 217 Z"
        fill={color}
      />

      {/* Forward Leading Leg (bent knee taking step) */}
      <path
        d="M88 122 C95 136, 102 150, 101 163 C100 178, 92 194, 85 208 C83 212, 89 216, 94 212 C102 196, 111 178, 111 159 C111 142, 100 127, 93 120 Z"
        fill={color}
      />
      {/* Leading Foot */}
      <path
        d="M85 208 C83 212, 77 217, 81 221 C85 224, 102 222, 100 214 Z"
        fill={color}
      />

      {/* White Mobility Cane Grip */}
      <path
        d="M109 94 L105 103"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="110" cy="93" r="2.5" fill="#EF4444" />

      {/* White Mobility Cane Shaft - Long, slender diagonal */}
      <line
        x1="106"
        y1="101"
        x2="146"
        y2="222"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="105"
        y1="101"
        x2="145"
        y2="222"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Cane Marshmallow Roller Tip */}
      <ellipse cx="146" cy="222" rx="4.5" ry="3" fill="#DC2626" />
      <circle cx="146" cy="222" r="2.2" fill="#FFFFFF" />
    </svg>
  );
};
