import React from 'react';
import { motion } from 'framer-motion';

// Generic Music Note SVG
const MusicNoteIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
    <path d="M40 70 A15 15 0 1 1 25 55 A15 15 0 0 1 40 70 V20 H75 V40 H45 V70 Z" />
  </svg>
);

// Generic Star SVG
const StarIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
    <path d="M50 15 L62 38 L88 41 L68 59 L74 85 L50 71 L26 85 L32 59 L12 41 L38 38 Z" />
  </svg>
);

// Generic Heart SVG
const HeartIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
    <path d="M50 85 C 50 85 15 60 15 35 C 15 18 28 12 40 22 C 45 26 50 32 50 32 C 50 32 55 26 60 22 C 72 12 85 18 85 35 C 85 60 50 85 50 85 Z" />
  </svg>
);

interface FloatingItem {
  id: number;
  type: 'note' | 'star' | 'heart';
  size: number;
  startX: number; // percentage (0 to 100)
  startY: number; // percentage (0 to 100)
  duration: number;
  delay: number;
  opacity: number;
}

export const BTSFloatingElements: React.FC = () => {
  // Generate a set of properties for subtle floating elements
  const elements: FloatingItem[] = React.useMemo(() => {
    const types: ('note' | 'star' | 'heart')[] = ['note', 'star', 'heart'];
    return Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      type: types[i % types.length],
      size: Math.random() * 15 + 15, // 15px to 30px
      startX: Math.random() * 80 + 10, // 10% to 90%
      startY: Math.random() * 80 + 10,
      duration: Math.random() * 25 + 40, // 40s to 65s (extremely slow and dreamy)
      delay: Math.random() * -40,
      opacity: Math.random() * 0.08 + 0.04, // very subtle 0.04 to 0.12 opacity
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {elements.map((el) => {
        let component = <HeartIcon />;
        let colorClass = 'text-purple-400/30';
        let glowClass = '';

        if (el.type === 'note') {
          component = <MusicNoteIcon />;
          colorClass = 'text-purple-300/40';
          glowClass = 'drop-shadow-[0_0_6px_rgba(216,180,254,0.2)]';
        } else if (el.type === 'star') {
          component = <StarIcon />;
          colorClass = 'text-amber-300/30';
          glowClass = 'drop-shadow-[0_0_8px_rgba(253,230,138,0.25)]';
        } else if (el.type === 'heart') {
          component = <HeartIcon />;
          colorClass = 'text-purple-400/35';
          glowClass = 'drop-shadow-[0_0_6px_rgba(216,180,254,0.25)]';
        }

        return (
          <motion.div
            key={el.id}
            className={`absolute ${colorClass} ${glowClass}`}
            style={{
              width: el.size,
              height: el.size,
              left: `${el.startX}%`,
              top: `${el.startY}%`,
              opacity: el.opacity,
            }}
            animate={{
              y: [0, -60, -120, -60, 0],
              x: [0, Math.sin(el.id) * 15, Math.cos(el.id) * 20, Math.sin(el.id) * -15, 0],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.05, 0.95, 1.02, 1],
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: "linear",
            }}
          >
            {component}
          </motion.div>
        );
      })}
    </div>
  );
};
