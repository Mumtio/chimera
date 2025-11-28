import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SynapseSparkProps {
  trigger: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const SynapseSpark: React.FC<SynapseSparkProps> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      // Generate 12 particles with random velocities (optimized count)
      const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120,
      }));
      
      setParticles(newParticles);

      // Clear particles after animation
      const timeout = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 1200);

      return () => clearTimeout(timeout);
    }
  }, [trigger, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 bg-neon-green rounded-full"
            style={{
              boxShadow: '0 0 6px rgba(0, 255, 170, 0.8), 0 0 12px rgba(0, 255, 170, 0.4)',
              willChange: 'transform, opacity',
            }}
            initial={{ 
              x: '50%', 
              y: '50%', 
              opacity: 1,
              scale: 1,
            }}
            animate={{ 
              x: `calc(50% + ${particle.vx}px)`,
              y: `calc(50% + ${particle.vy}px)`,
              opacity: 0,
              scale: 0.2,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
