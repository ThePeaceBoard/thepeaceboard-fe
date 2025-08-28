'use client';

import React, { useState, useEffect } from 'react';

const DisclaimerBar: React.FC = () => {
  const [opacity, setOpacity] = useState(0.6);

  const handleClose = () => {
    setOpacity(0);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Try multiple scroll containers
      const appContainer = document.querySelector('.app-container') as HTMLElement;
      const animatedPage = document.querySelector('.animated-page') as HTMLElement;
      
      let scrollY = 0;
      if (appContainer) {
        scrollY = appContainer.scrollTop;
      } else if (animatedPage) {
        scrollY = animatedPage.scrollTop;
      } else {
        scrollY = window.scrollY;
      }
      
      if (scrollY > 50) {
        // Start fading out after 50px scroll
        const fadeProgress = Math.min(1, (scrollY - 50) / 100);
        const newOpacity = 0.6 - (fadeProgress * 0.6);
        setOpacity(newOpacity);
      } else {
        // Reset to base opacity when at top
        setOpacity(0.6);
      }
    };

    // Try to find the scroll container
    const appContainer = document.querySelector('.app-container');
    const animatedPage = document.querySelector('.animated-page');
    
    // Listen to all possible scroll containers
    if (appContainer) {
      appContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    if (animatedPage) {
      animatedPage.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (appContainer) {
        appContainer.removeEventListener('scroll', handleScroll);
      }
      if (animatedPage) {
        animatedPage.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  return (
    <div 
      className="fixed left-0 right-0 w-full bg-orange-500/95 backdrop-blur-md text-white text-center py-4 px-6 z-50 shadow-xl border-t border-orange-400/30 transition-all duration-500 ease-out"
      style={{ 
        opacity,
        transform: `translateY(${opacity === 0 ? '100%' : '0'})`,
        bottom: 0,
        pointerEvents: opacity === 0 ? 'none' : 'auto'
      }}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-4 w-6 h-6 flex items-center justify-center text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
        aria-label="Close disclaimer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <p className="text-sm font-medium leading-relaxed max-w-4xl mx-auto">
        <span className="font-bold">DEMO NOTICE:</span> This is a demonstration website. All data, statistics, and content shown are fictional and created for presentation purposes only. This site does not represent actual peace pledges or real-world data.
      </p>
    </div>
  );
};

export default DisclaimerBar;
