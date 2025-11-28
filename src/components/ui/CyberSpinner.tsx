import React from 'react';

export interface CyberSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ring' | 'pulse' | 'dots';
  className?: string;
}

export const CyberSpinner: React.FC<CyberSpinnerProps> = ({
  size = 'md',
  variant = 'ring',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (variant === 'ring') {
    return (
      <div className={`spinner-ring ${sizeClasses[size]} ${className}`}>
        <div className={sizeClasses[size]}></div>
        <div className={sizeClasses[size]}></div>
        <div className={sizeClasses[size]}></div>
        <div className={sizeClasses[size]}></div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`pulse-loader ${className}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }

  // Dots variant
  return (
    <div className={`flex gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-neon-green animate-pulse-glow`} style={{ animationDelay: '0s' }}></div>
      <div className={`${sizeClasses[size]} rounded-full bg-neon-green animate-pulse-glow`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`${sizeClasses[size]} rounded-full bg-neon-green animate-pulse-glow`} style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};
