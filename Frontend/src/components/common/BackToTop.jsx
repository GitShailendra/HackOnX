import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { FaArrowUp } from 'react-icons/fa';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const buttonAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 300, friction: 10 },
  });

  const arrowAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-5px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
  });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <animated.button
      style={{
        ...buttonAnimation,
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '3.5rem',
        height: '3.5rem',
        fontSize: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
      }}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <animated.div style={arrowAnimation}>
        <FaArrowUp />
      </animated.div>
    </animated.button>
  );
};

export default BackToTopButton;