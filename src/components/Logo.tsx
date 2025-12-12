import React from 'react';
import techverseLogo from '@/assets/techverse-logo.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3">
      <img 
        src={techverseLogo} 
        alt="Techverse Infotech" 
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <div>
          <h1 className={`font-display font-bold text-primary ${textSizes[size]}`}>
            Techverse Infotech
          </h1>
          <p className="text-muted-foreground text-sm">Billing Software</p>
        </div>
      )}
    </div>
  );
}
