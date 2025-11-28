import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  glowColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  glowColor = '#00FFAA',
  className = '',
}) => {
  const trendColors = {
    up: 'text-neon-green',
    down: 'text-error-red',
    neutral: 'text-gray-400',
  };

  const trendSymbols = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <motion.div
      // @ts-ignore - Framer Motion types issue
      role="region"
      aria-label={`${label} statistic`}
      className={`
        relative bg-black border-2 border-deep-teal
        angular-frame p-6
        hover:border-neon-green hover:shadow-neon
        transition-all duration-300
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
            {label}
          </p>
          <motion.div
            // @ts-ignore - Framer Motion types issue
            className="text-3xl font-cyber font-bold text-neon-green"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            aria-live="polite"
          >
            {value}
          </motion.div>
          {trend && (
            <div className={`text-sm mt-2 ${trendColors[trend]}`}>
              <span className="mr-1">{trendSymbols[trend]}</span>
              <span className="uppercase tracking-wide">{trend}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div 
            className="p-3 rounded-lg bg-neon-green/10 pulse-glow"
            style={{
              boxShadow: `0 0 20px ${glowColor}40`,
            }}
          >
            <Icon 
              className="w-8 h-8 text-neon-green" 
              strokeWidth={2}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
