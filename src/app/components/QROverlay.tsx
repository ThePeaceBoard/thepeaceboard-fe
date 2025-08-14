'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QROverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const QROverlay: React.FC<QROverlayProps> = ({ isOpen, onClose }) => {
  // Add ESC key functionality
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Auto-close after 4 seconds when opened
  useEffect(() => {
    if (!isOpen) return;
    const timerId = window.setTimeout(() => {
      onClose();
    }, 4000);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999]"
            onClick={onClose}
          />
          
          {/* QR Code Container */}
          <motion.div
            initial={{ opacity: 0, scale: 1, x: 0 }}
            animate={{ opacity: 1, scale: 1.2, x: -100 }}
            exit={{ opacity: 0, scale: 1, x: 0 }}
            transition={{ 
              duration: 0.35, 
              ease: "easeOut",
              type: "spring",
              stiffness: 260,
              damping: 26
            }}
            className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none"
          >
            <div className="relative pointer-events-auto" onClick={(e) => { e.stopPropagation(); onClose(); }}>
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200 flex items-center justify-center z-10"
                aria-label="Close QR overlay"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* QR Code */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/50">
                <img
                  src="/entry-qr.svg"
                  alt="Entry QR Code"
                  className="w-80 h-80 md:w-96 md:h-96"
                  style={{
                    width: 'calc(var(--sizer, 1) * 20rem)',
                    height: 'calc(var(--sizer, 1) * 20rem)',
                    maxWidth: 'calc(var(--sizer, 1) * 24rem)',
                    maxHeight: 'calc(var(--sizer, 1) * 24rem)'
                  }}
                />
                
                {/* Caption */}
                <div className="mt-6 text-center">
                  <h3 
                    className="font-bold text-gray-800 mb-2"
                    style={{ fontSize: 'calc(var(--sizer) * 1.25rem)' }}
                  >
                    Scan to Pledge for Peace
                  </h3>
                  <p 
                    className="text-gray-600 max-w-xs"
                    style={{ fontSize: 'calc(var(--sizer) * 0.875rem)' }}
                  >
                    Join the global movement for civilian-driven world peace
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QROverlay;
