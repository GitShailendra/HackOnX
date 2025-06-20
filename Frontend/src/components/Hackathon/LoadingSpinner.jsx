// src/components/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
        <motion.div 
          className="w-12 h-12 border-4 border-blue-600 rounded-full absolute top-0 left-0 border-t-transparent"
        ></motion.div>
      </motion.div>
    </div>
  );
};

// Variant 2: Dots Spinner
export const DotsSpinner = () => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -10, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-64">
      <motion.div 
        className="flex space-x-2"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="w-3 h-3 bg-blue-600 rounded-full"
          variants={dotVariants}
        ></motion.div>
        <motion.div 
          className="w-3 h-3 bg-blue-600 rounded-full"
          variants={dotVariants}
        ></motion.div>
        <motion.div 
          className="w-3 h-3 bg-blue-600 rounded-full"
          variants={dotVariants}
        ></motion.div>
      </motion.div>
    </div>
  );
};

// Variant 3: Pulse Spinner
export const PulseSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div 
        className="w-12 h-12 bg-blue-500 rounded-full"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
    </div>
  );
};

// Spinner with Text
export const LoadingSpinnerWithText = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <motion.div
        className="relative mb-4"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
        <motion.div 
          className="w-12 h-12 border-4 border-blue-600 rounded-full absolute top-0 left-0 border-t-transparent"
        ></motion.div>
      </motion.div>
      <motion.p 
        className="text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;