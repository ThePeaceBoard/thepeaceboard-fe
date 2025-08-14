'use client';
import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInstagram, 
  faLinkedin, 
  faDiscord, 
  faTiktok, 
  faXTwitter, 
  faGithub,
  faFacebook 
} from '@fortawesome/free-brands-svg-icons';
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import { IconButton } from "@mui/material";
import { MobileNavBarProps } from './types';
import { iconButtonStyles, iconStyles } from './styles';

const MobileNavBar: React.FC<MobileNavBarProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<HTMLAnchorElement[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);
  
  // Touch/swipe state
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);
  // Mouse debugging (desktop) – drag to open/close similar to touch
  const mouseStartRef = useRef<{ x: number; y: number } | null>(null);

  const toggleMenu = () => {
    // Safety check - ensure refs exist before manipulating
    if (!menuContainerRef.current || !containerRef.current) return;
    
    if (!isOpen) {
      openTlRef.current?.restart();
      // Lock page scroll while menu is open
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (typeof window !== 'undefined') {
        window.addEventListener('wheel', blockScroll, { passive: false });
        window.addEventListener('touchmove', blockScroll, { passive: false });
        window.addEventListener('keydown', blockKeys, false);
      }
    } else {
      closeTlRef.current?.restart();
      // Restore scroll
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (typeof window !== 'undefined') {
        window.removeEventListener('wheel', blockScroll as any, { capture: false } as any);
        window.removeEventListener('touchmove', blockScroll as any, { capture: false } as any);
        window.removeEventListener('keydown', blockKeys as any, false);
      }
    }
    setIsOpen(!isOpen);
  };

  const blockScroll = (e: Event) => {
    e.preventDefault();
  };
  const blockKeys = (e: KeyboardEvent) => {
    const keys = ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '];
    if (keys.includes(e.key)) {
      e.preventDefault();
    }
  };

  // Touch handlers for slide-to-right gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    touchEndRef.current = { x, y };

    // If horizontal intent is clear, prevent page scroll so the gesture is captured
    if (touchStartRef.current) {
      const dx = Math.abs(x - touchStartRef.current.x);
      const dy = Math.abs(y - touchStartRef.current.y);
      if (dx > dy && dx > 30) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const startX = touchStartRef.current.x;
    const endX = touchEndRef.current.x;
    const startY = touchStartRef.current.y;
    const endY = touchEndRef.current.y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;


    // Only allow edge-swipe from the left ~40px to open
    const fromEdge = startX <= 80 || isOpen; // allow wider edge area to open; anywhere when open to close

    // REVERSED: open on left swipe, close on right swipe
    if (fromEdge && deltaX < -30 && Math.abs(deltaY) < 140) {
      if (!isOpen) {
        toggleMenu();
      }
    }
    // Close on right swipe
    else if (deltaX > 30 && Math.abs(deltaY) < 140) {
      if (isOpen) {
        toggleMenu();
      }
    }

    // Reset touch references
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  // Mouse drag handlers for debugging on desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseStartRef.current) return;
    const dx = e.clientX - mouseStartRef.current.x;
    const dy = e.clientY - mouseStartRef.current.y;
    // Prevent text selection when clearly dragging horizontally
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
      e.preventDefault();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseStartRef.current) return;
    const startX = mouseStartRef.current.x;
    const startY = mouseStartRef.current.y;
    const endX = e.clientX;
    const endY = e.clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const fromEdge = startX <= 120 || isOpen; // allow generous edge on desktop for debugging
    // REVERSED for mouse drag
    if (fromEdge && deltaX < -40 && Math.abs(deltaY) < 160) {
      if (!isOpen) toggleMenu();
    } else if (deltaX > 40 && Math.abs(deltaY) < 160) {
      if (isOpen) toggleMenu();
    }
    mouseStartRef.current = null;
  };

  // Magic Mouse/Trackpad: horizontal wheel to open/close
  const handleWheel = (e: React.WheelEvent) => {
    // Positive deltaX usually means scrolling right
    const dx = e.deltaX;
    const dy = e.deltaY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      e.preventDefault();
      // REVERSED: open on left (negative dx), close on right
      if (dx < -20 && !isOpen) {
        toggleMenu();
      } else if (dx > 20 && isOpen) {
        toggleMenu();
      }
    }
  };

  // Document-level touch listeners to ensure gesture works across the header area
  useEffect(() => {
    const onDocTouchStart = (e: TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onDocTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      touchEndRef.current = { x, y };
      // Prevent page scroll when strong horizontal intent
      if (touchStartRef.current) {
        const dx = Math.abs(x - touchStartRef.current.x);
        const dy = Math.abs(y - touchStartRef.current.y);
        if (dx > dy && dx > 10) {
          e.preventDefault();
        }
      }
    };
    const onDocTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const endX = (e.changedTouches[0] || e.touches[0]).clientX;
      const endY = (e.changedTouches[0] || e.touches[0]).clientY;
      touchEndRef.current = { x: endX, y: endY };
      const startX = touchStartRef.current.x;
      const startY = touchStartRef.current.y;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const fromEdge = startX <= 40;
      if (fromEdge && deltaX > 45 && Math.abs(deltaY) < 120) {
        if (!isOpen) toggleMenu();
      } else if (deltaX < -45 && Math.abs(deltaY) < 120) {
        if (isOpen) toggleMenu();
      }
      touchStartRef.current = null;
      touchEndRef.current = null;
    };

    // Add with passive:false so we can preventDefault on touchmove
    const opts: AddEventListenerOptions = { passive: false };
    document.addEventListener('touchstart', onDocTouchStart, opts);
    document.addEventListener('touchmove', onDocTouchMove, opts);
    document.addEventListener('touchend', onDocTouchEnd, opts);
    return () => {
      document.removeEventListener('touchstart', onDocTouchStart, opts);
      document.removeEventListener('touchmove', onDocTouchMove, opts);
      document.removeEventListener('touchend', onDocTouchEnd, opts);
    };
  }, [isOpen]);

  useGSAP(() => {
    // Safety check - ensure refs exist before creating animations
    if (!menuContainerRef.current || !containerRef.current) return;
    
    const openTl = gsap.timeline({ paused: true });
    openTl
      .set(menuContainerRef.current, { scaleX: 0, y: 0, transformOrigin: "left top" })
      .to(menuContainerRef.current, {
        duration: 0.2,
        scaleX: 1,
        y: 0,
        ease: "power2.inOut",
      });

    const closeTl = gsap.timeline({ paused: true });
    closeTl
      .to(menuContainerRef.current, {
        duration: 0.2,
        scaleX: 0,
        y: 0,
        ease: "power2.inOut",
      });

    openTlRef.current = openTl;
    closeTlRef.current = closeTl;

    const updateScrollAnimation = () => {
      const scrollTop = window.scrollY;
  
      // Update navbar background and shadow
      gsap.to(navRef.current, {
        backgroundColor: scrollTop > 50 ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
        boxShadow: scrollTop > 50 ? '0px 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
        duration: 0.3,
      });
    };
    window.addEventListener('scroll', updateScrollAnimation);
    updateScrollAnimation();
    return () => {
      window.removeEventListener('scroll', updateScrollAnimation);
      // Kill GSAP animations to prevent DOM manipulation errors
      if (openTlRef.current) {
        openTlRef.current.kill();
      }
      if (closeTlRef.current) {
        closeTlRef.current.kill();
      }
    };
  }, { scope: containerRef });

  // Cleanup GSAP animations on unmount
  useEffect(() => {
    return () => {
      // Kill all GSAP animations to prevent DOM manipulation errors
      if (openTlRef.current) {
        openTlRef.current.kill();
        openTlRef.current = null;
      }
      if (closeTlRef.current) {
        closeTlRef.current.kill();
        closeTlRef.current = null;
      }
      // Kill any other GSAP animations that might be running
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current);
      }
      if (navRef.current) {
        gsap.killTweensOf(navRef.current);
      }
      // Kill all GSAP animations globally for this component
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen z-[9999]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      {/* Invisible edge opener to guarantee gesture capture on mobile */}
      <div
        className="block md:hidden fixed left-0 top-0 h-screen w-8 z-[10000]"
        style={{ background: 'rgba(255,255,255,0.02)' }}
        onTouchStart={(e) => {
          // Only open on touch from left edge
          const x = e.touches[0].clientX;
          if (x <= 80 && !isOpen) {
            toggleMenu();
          }
        }}
        onClick={() => { if (!isOpen) { toggleMenu(); } }}
      />
      <div ref={containerRef} className='w-full'>
        <div
          ref={menuContainerRef}
          className="menu-container"
          style={{
            transform: "scaleX(0)", // Hidden initially
            transformOrigin: "left", // Ensure the scale effect starts from the left
            overflow: "hidden",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.9)",
            zIndex: 9998,
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          <nav className="flex flex-col gap-6 p-8 font-bebas text-xl sm:text-2xl">
            {/* Community Menu */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <div className="grid grid-cols-3 gap-4">
                <a href="https://instagram.com" className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faInstagram} className="text-2xl text-pink-500 mb-2" />
                  <span className="text-sm text-white">Instagram</span>
                </a>
                <a href="https://facebook.com" className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faFacebook} className="text-2xl text-blue-500 mb-2" />
                  <span className="text-sm text-white">Facebook</span>
                </a>
                <a href="https://discord.com" className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faDiscord} className="text-2xl text-indigo-500 mb-2" />
                  <span className="text-sm text-white">Discord</span>
                </a>
                <a href="https://twitter.com" className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faXTwitter} className="text-2xl text-gray-400 mb-2" />
                  <span className="text-sm text-white">X</span>
                </a>
                <a href="https://linkedin.com" className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faLinkedin} className="text-2xl text-blue-600 mb-2" />
                  <span className="text-sm text-white">LinkedIn</span>
                </a>
                <a href="https://github.com/sync-organization" className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faGithub} className="text-2xl text-gray-300 mb-2" />
                  <span className="text-sm text-white">GitHub</span>
                </a>
              </div>
            </div>

            {/* About Menu */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-white mb-2">About</h3>
              <div className="flex flex-col gap-3">
                <a 
                  href="/#join" 
                  className="text-white hover:text-orange-400 transition-colors p-2 rounded"
                  ref={(el) => {
                    if (el) navLinksRef.current[0] = el;
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/#join';
                    toggleMenu(); // Close menu after click
                  }}
                >
                  Join The Movement
                </a>
                <a 
                  href="/#sync" 
                  className="text-white hover:text-orange-400 transition-colors p-2 rounded"
                  ref={(el) => {
                    if (el) navLinksRef.current[1] = el;
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/#sync';
                    toggleMenu(); // Close menu after click
                  }}
                >
                  We Are Sync
                </a>
                <a 
                  href="/#world-peace" 
                  className="text-white hover:text-orange-400 transition-colors p-2 rounded"
                  ref={(el) => {
                    if (el) navLinksRef.current[2] = el;
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/#world-peace';
                    toggleMenu(); // Close menu after click
                  }}
                >
                  World Peace
                </a>
                <a 
                  href="/#sync-token" 
                  className="text-white hover:text-orange-400 transition-colors p-2 rounded"
                  ref={(el) => {
                    if (el) navLinksRef.current[3] = el;
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/#sync-token';
                    toggleMenu(); // Close menu after click
                  }}
                >
                  Sync Token
                </a>
                <a 
                  href="/#launch" 
                  className="text-white hover:text-orange-400 transition-colors p-2 rounded"
                  ref={(el) => {
                    if (el) navLinksRef.current[4] = el;
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/#launch';
                    toggleMenu(); // Close menu after click
                  }}
                >
                  Launch
                </a>
              </div>
            </div>

            {/* Support Us */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
              <a 
                href="/supportus" 
                className="text-white hover:text-orange-400 transition-colors p-2 rounded"
                onClick={() => toggleMenu()} // Close menu after click
              >
                Support Us
              </a>
            </div>
          </nav>
        </div>

        <header 
          ref={navRef}
          className="w-full flex flex-row flex-wrap justify-between font-bebas"
          style={{
            backgroundColor: 'transparent',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex flex-row gap-2 content-center justify-start items-center p-4" >
            <img
              src="/logo-header.svg"
              alt="The Peace Board"
              style={{ height: "55px", width: "auto" }}
              className="transition-transform"
            />
          </div>

          <div className="flex flex-row gap-2 content-end justify-end items-center">
            <img
              src="/entry-qr.svg"
              alt="Entry QR Code"
              className="mr-2"
              style={{ 
                display: "block",
                width: 'calc(var(--sizer) * 3rem)',
                height: 'calc(var(--sizer) * 3rem)'
              }}
            />
          </div>
        </header>
      </div>
    </div>
  );
};

export default MobileNavBar; 