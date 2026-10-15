import React from 'react';

interface MarjonLogoProps {
  className?: string;
  size?: number;
}

export const MarjonLogo: React.FC<MarjonLogoProps> = ({ className = 'w-8 h-8', size }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        <linearGradient id="marjonLogoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="30%" stopColor="#0091FF" />
          <stop offset="70%" stopColor="#9D00FF" />
          <stop offset="100%" stopColor="#FF007A" />
        </linearGradient>
        <linearGradient id="marjonLogoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer shadow glow */}
      <path
        d="M15 85V15L50 55L85 15V85H70V42L50 65L30 42V85H15Z"
        fill="url(#marjonLogoGrad)"
        filter="url(#neonGlow)"
        opacity="0.6"
      />

      {/* Main geometric M glyph */}
      <path
        d="M15 85V15L50 55L85 15V85H70V42L50 65L30 42V85H15Z"
        fill="url(#marjonLogoGrad)"
      />

      {/* Inner highlight facets for 3D cyberpunk sheen */}
      <path
        d="M15 15L30 32V85H22V26L15 15Z"
        fill="#FFFFFF"
        opacity="0.3"
      />
      <path
        d="M50 55L70 32V42L50 65L30 42V32L50 55Z"
        fill="url(#marjonLogoGrad2)"
        opacity="0.8"
      />
    </svg>
  );
};
