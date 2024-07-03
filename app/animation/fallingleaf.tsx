'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LeafProps {
  delay: number;
}

const Leaf: React.FC<LeafProps> = ({ delay }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: -20,
        left: `${Math.random() * 100}%`,
        width: 20,
        height: 20,
        backgroundColor: 'green',
        borderRadius: '50% 0 50% 50%',
        transform: 'rotate(45deg)',
      }}
      animate={{
        y: ['0vh', '100vh'],
        x: ['-10px', '10px', '-10px'],
        rotate: [0, 360],
        opacity: [1, 0.8, 0.6, 0.4, 0, 0],
      }}
      transition={{
        duration: 5 + Math.random() * 2,
        delay: delay,
        repeat: Infinity,
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