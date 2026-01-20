'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const sizeMap = {
  sm: { width: 32, height: 32, text: 'text-sm' },
  md: { width: 48, height: 48, text: 'text-lg' },
  lg: { width: 64, height: 64, text: 'text-2xl' },
};

export function Logo({ size = 'md', className = '', showText = true }: LogoProps) {
  const { width, height, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt="HM Management Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
      {showText && (
        <span className={`font-bold text-gray-800 ${text}`}>
          HM Management
        </span>
      )}
    </div>
  );
}
