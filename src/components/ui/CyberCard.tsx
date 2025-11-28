import React from 'react';
import { motion } from 'framer-motion';

export interface CyberCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  glowBorder?: boolean;
  cornerAccents?: boolean;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  title,
  subtitle,
  children,
  glowBorder = false,
  cornerAccents = true,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const borderClasses = glowBorder 
    ? 'border border-neon-green/30 shadow-neon' 
    : 'border border-lab-border';

  const hoverClasses = hoverable || onClick 
    ? 'hover:border-neon-green/50 hover:bg-lab-panel/50 cursor-pointer transition-all duration-300' 
    : '';

  return (
    <motion.div
      // @ts-ignore - Framer Motion types issue
      className={`
        relative bg-lab-dark/80 backdrop-blur-sm ${borderClasses} ${hoverClasses}
        angular-frame p-6 lab-grid
        ${cornerAccents ? 'corner-accents' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        willChange: hoverable || onClick ? 'transform, box-shadow' : 'auto',
      }}
      whileHover={hoverable || onClick ? { 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.25, ease: 'easeOut' }
      } : {}}
      whileTap={onClick ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      transition={{ duration: 0.2 }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-neon-green font-cyber text-xl font-bold uppercase tracking-wider">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-gray-400 text-sm mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
