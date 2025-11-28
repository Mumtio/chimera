import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

export interface WorkspaceTransitionProps {
  isTransitioning: boolean;
  progress: number;
  fromWorkspace?: string;
  toWorkspace?: string;
}

type TransitionPhase = 'blur' | 'loading' | 'unloading' | 'loading-new' | 'complete';

export const WorkspaceTransition: React.FC<WorkspaceTransitionProps> = ({
  isTransitioning,
  progress,
  fromWorkspace,
  toWorkspace,
}) => {
  const [phase, setPhase] = useState<TransitionPhase>('blur');

  useEffect(() => {
    if (!isTransitioning) {
      setPhase('blur');
      return;
    }

    // Optimized phase timing for smoother transitions
    if (progress < 15) {
      setPhase('blur');
    } else if (progress < 45) {
      setPhase('loading');
    } else if (progress < 65) {
      setPhase('unloading');
    } else if (progress < 85) {
      setPhase('loading-new');
    } else {
      setPhase('complete');
    }
  }, [isTransitioning, progress]);

  if (!isTransitioning) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        {/* Blur Overlay - optimized for performance */}
        <motion.div
          className="absolute inset-0 bg-black/70"
          initial={{ backdropFilter: 'blur(0px)' }}
          animate={{ 
            backdropFilter: progress < 85 ? 'blur(16px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            backdropFilter: progress < 85 ? 'blur(16px)' : 'blur(0px)',
            WebkitBackdropFilter: progress < 85 ? 'blur(16px)' : 'blur(0px)',
            willChange: 'backdrop-filter',
          }}
        />

        {/* Content Container */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {/* Brain Icon in Circular Frame */}
          <div className="relative">
            {/* Circular Frame */}
            <div className="w-32 h-32 rounded-full border-2 border-neon-green/50 flex items-center justify-center relative shadow-neon">
              {/* Rotating outer ring - optimized */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-green"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ willChange: 'transform' }}
              />
              
              {/* Brain Icon with animations */}
              <AnimatePresence mode="wait">
                {phase === 'unloading' ? (
                  <motion.div
                    key="unload"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 0.4, opacity: 0, rotate: -180 }}
                    exit={{ scale: 0.2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="text-neon-green drop-shadow-[0_0_8px_rgba(0,255,170,0.8)]"
                  >
                    <Brain className="w-16 h-16" />
                  </motion.div>
                ) : phase === 'loading-new' ? (
                  <motion.div
                    key="load"
                    initial={{ scale: 0.4, opacity: 0, rotate: 180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-neon-green drop-shadow-[0_0_8px_rgba(0,255,170,0.8)]"
                  >
                    <Brain className="w-16 h-16" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="normal"
                    animate={{ 
                      scale: [1, 1.08, 1],
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="text-neon-green drop-shadow-[0_0_8px_rgba(0,255,170,0.8)]"
                  >
                    <Brain className="w-16 h-16" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-full bg-neon-green/15 blur-2xl" />
            </div>
          </div>

          {/* Text Display */}
          <div className="text-center space-y-2">
            <motion.h3
              className="text-xl font-cyber text-neon-green tracking-wider text-glow-sm"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              Calibrating Neural Weights
            </motion.h3>
            
            {fromWorkspace && toWorkspace && (
              <motion.p
                className="text-sm text-gray-400 font-mono"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {fromWorkspace} → {toWorkspace}
              </motion.p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-80 space-y-2">
            <div className="h-2 bg-deep-teal border border-neon-green/40 angular-frame overflow-hidden relative">
              {/* Progress fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-neon-green/60 to-neon-green relative"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{ willChange: 'width' }}
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ willChange: 'transform' }}
                />
              </motion.div>
              
              {/* Enhanced glow effect */}
              <motion.div 
                className="absolute inset-0 bg-neon-green/25 blur-md"
                style={{ width: `${progress}%` }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            
            {/* Progress percentage */}
            <div className="flex justify-between text-xs text-neon-green/80 font-mono">
              <span>PROGRESS</span>
              <motion.span
                key={Math.round(progress)}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex gap-2">
            {['SYNC', 'LOAD', 'INIT'].map((status, index) => (
              <motion.div
                key={status}
                className="px-3 py-1 border border-neon-green/30 rounded text-xs font-mono"
                animate={{
                  borderColor: progress > (index + 1) * 30 ? 'rgba(0, 255, 170, 0.6)' : 'rgba(0, 255, 170, 0.3)',
                  color: progress > (index + 1) * 30 ? 'rgb(0, 255, 170)' : 'rgba(0, 255, 170, 0.5)',
                }}
              >
                {status}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
