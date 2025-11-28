import React from 'react';
import { motion } from 'framer-motion';

export interface CyberButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  pulse?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
  title?: string;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = false,
  pulse = false,
  onClick,
  children,
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel,
  title,
}) => {
  const baseClasses = 'font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantClasses = {
    primary: 'bg-neon-green/5 border-2 border-neon-green/50 text-neon-green hover:bg-neon-green/10 hover:border-neon-green backdrop-blur-sm',
    secondary: 'bg-lab-panel border-2 border-lab-border text-gray-300 hover:border-neon-green/50 hover:text-neon-green backdrop-blur-sm',
    danger: 'bg-error-red/5 border-2 border-error-red/50 text-error-red hover:bg-error-red/10 hover:border-error-red backdrop-blur-sm',
    ghost: 'bg-transparent border-0 text-neon-green hover:text-white hover:bg-neon-green/5',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-neon-green';
  const glowClasses = glow ? 'shadow-neon' : '';
  const pulseClasses = pulse ? 'animate-pulse-glow' : '';

  const clipPathStyle = variant !== 'ghost' ? {
    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
  } : {};

  return (
    <motion.button
      // @ts-ignore - Framer Motion types issue with button props
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      aria-disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? disabledClasses : ''}
        ${glowClasses}
        ${pulseClasses}
        ${className}
      `}
      style={{
        ...clipPathStyle,
        willChange: 'transform, box-shadow',
      }}
      whileHover={!disabled ? { 
        scale: 1.03,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.97,
        transition: { duration: 0.1 }
      } : {}}
    >
      {children}
    </motion.button>
  );
};
