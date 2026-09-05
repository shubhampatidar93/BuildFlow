import React from 'react';

interface BuildFlowLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSubtleAi?: boolean;
}

export const BuildFlowLogo: React.FC<BuildFlowLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  showSubtleAi = true,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Minimal Flow Icon: 3 Connected Ascending Nodes: Idea → Plan → Build */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(108,99,255,0.35)]"
        >
          <defs>
            <linearGradient id="bf-gradient" x1="4" y1="28" x2="30" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <linearGradient id="bf-glow" x1="6" y1="26" x2="30" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Stepped connecting flow path */}
          <path
            d="M8 26 L18 18 L28 10"
            stroke="url(#bf-gradient)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Subtle directional pulse tick */}
          <path
            d="M18 18 L28 10"
            stroke="#22D3EE"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 3"
            opacity="0.75"
          />

          {/* Node 1: Idea (Bottom Left - Violet) */}
          <circle cx="8" cy="26" r="4" fill="#080B14" stroke="#6C63FF" strokeWidth="2.5" />
          <circle cx="8" cy="26" r="1.5" fill="#6C63FF" />

          {/* Node 2: Plan (Center - Mid Transition) */}
          <circle cx="18" cy="18" r="4.5" fill="#0D1220" stroke="url(#bf-gradient)" strokeWidth="2.5" />
          <circle cx="18" cy="18" r="2" fill="#22D3EE" />

          {/* Node 3: Build & Execution (Top Right - Vibrant Cyan with outer ring) */}
          <circle cx="28" cy="10" r="5" fill="#111827" stroke="#22D3EE" strokeWidth="2.5" />
          <circle cx="28" cy="10" r="2.5" fill="#22D3EE" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-[#F8FAFC] ${textSizes[size]}`}>
            BUILD<span className="font-semibold text-[#22D3EE]">flow</span>
          </span>
          {showSubtleAi && (
            <span className="ml-1 text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border border-[#263247] text-[#22D3EE] bg-[#0D1220]/80">
              AI
            </span>
          )}
        </div>
      )}
    </div>
  );
};
