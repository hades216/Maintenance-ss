import React from 'react';

interface BrandMarkProps {
  variant?: 'light' | 'dark';
}

export const BrandMark: React.FC<BrandMarkProps> = ({ variant = 'dark' }) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#0B1E38]';
  const accentFill = variant === 'light' ? '#4B91FF' : '#1D6FF2';
  const frameStroke = variant === 'light' ? '#FFFFFF' : '#0B1E38';

  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${textColor}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M4 14.5L16 5L28 14.5V26.5C28 27.3284 27.3284 28 26.5 28H5.5C4.67157 28 4 27.3284 4 26.5V14.5Z"
          stroke={frameStroke}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 22L19.5 15M18 14.5C19.3807 14.5 20.5 15.6193 20.5 17C20.5 17.5 20.35 17.95 20.1 18.3L22 20.2L20.2 22L18.3 20.1C17.95 20.35 17.5 20.5 17 20.5C15.6193 20.5 14.5 19.3807 14.5 18"
          stroke={accentFill}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-lg font-extrabold tracking-tight">KAAM FIX</span>
    </span>
  );
};
