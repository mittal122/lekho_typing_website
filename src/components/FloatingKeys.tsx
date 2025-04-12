
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Define a set of common keyboard keys
const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
  'Enter', 'Shift', 'Space', 'Tab', 'Esc'];

interface FloatingKey {
  key: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const FloatingKeys: React.FC = () => {
  // Generate a set of random floating keys
  const floatingKeys = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      return {
        key: keys[Math.floor(Math.random() * keys.length)],
        x: Math.random() * 100, // random position as percentage of container
        y: Math.random() * 100,
        size: Math.random() * 30 + 20, // Size between 20-50px
        duration: Math.random() * 10 + 10, // Animation duration
        delay: Math.random() * 5, // Delay before animation starts
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {floatingKeys.map((key, index) => (
        <FloatingKey key={index} keyData={key} />
      ))}
    </div>
  );
};

interface FloatingKeyProps {
  keyData: FloatingKey;
}

const FloatingKey: React.FC<FloatingKeyProps> = ({ keyData }) => {
  const { key, x, y, size, duration, delay } = keyData;

  return (
    <motion.div
      className="absolute bg-secondary/80 backdrop-blur-sm rounded-md shadow-sm flex items-center justify-center font-jetbrains"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 3}px`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0, 0.5, 0.2, 0],
        y: [20, -50, -120],
        rotate: [0, Math.random() * 40 - 20]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 5,
        ease: "easeInOut"
      }}
    >
      {key}
    </motion.div>
  );
};

export default FloatingKeys;
