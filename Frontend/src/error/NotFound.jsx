import React, { useEffect } from 'react';
import Lottie from "lottie-react";
import lottieAnim from '../assets/robo.json';

const NotFound = () => {
    useEffect(() => {
        // Save original styles
        const originalStyle = window.getComputedStyle(document.body).overflow;
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
    
        // Cleanup function to restore scrolling when component unmounts
        return () => {
          document.body.style.overflow = originalStyle;
        };
      }, []);
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gray-300">
      <Lottie 
        animationData={lottieAnim}
        loop={true}
        autoplay={true}
        className="w-full h-full object-contain"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default NotFound;