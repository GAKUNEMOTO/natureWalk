'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LeafProps {
  delay: number;
}

const Leaf: React.FC<LeafProps> = ({ delay }) => {
  const colors = ['#8fbc8f', '#90ee90', '#98fb98', '#3cb371', '#2e8b57'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: -20,
        left: `${Math.random() * 100}%`,
        width: 20,
        height: 20,
        backgroundColor: randomColor,
        borderRadius: '50% 0 50% 50%',
        transform: 'rotate(45deg)',
      }}
      animate={{
        y: ['0vh', '100vh'],
        x: ['-10px', '10px', '-10px'],
        rotate: [0, 360],
        opacity: [1, 1, 1, 0.8, 0.6, 0.4, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        repeatDelay: 1,
        ease: 'linear',
      }}
    />
  );
};

interface FallingLeavesProps {
  count?: number;
}

const FallingLeaves: React.FC<FallingLeavesProps> = ({ count = 10 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Leaf key={index} delay={Math.random() * 5} />
      ))}
    </>
  );
};

export default FallingLeaves;