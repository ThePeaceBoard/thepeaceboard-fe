'use client';

import React, {useState, useRef, useEffect, useMemo } from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Typography } from "@mui/material";
import StatsBar from "./StatsBar";
import RadioPlayer from "./radio-bar";
import { PeaceSign } from "@/components/peace-sign";
import { Flag, Eye } from "lucide-react";

type LineContent = React.ReactElement | string;

const topLines: LineContent[] = [
  <React.Fragment key="1">
  <span style={{ color: "#E28A4B" }}>We Are</span>{" "}
  <span style={{ color: "#111111", fontWeight:"800" }}>Not</span>
</React.Fragment>,
<React.Fragment key="2">
  <span style={{ color: "#E28A4B" }}>For</span>
  <span style={{ color: "#111111", fontWeight:"700" }}> Governments</span>
</React.Fragment>,
<>
  <span style={{ color: "#E28A4B" }}>to Create </span>
  <span
    style={{
      color: "#F5D5A7",
    }}
  >
    Peace
  </span>
</>,
<>
  <span style={{ color: "#E28A4B" }}>People Driven</span>
</>,
];

const bottomLines: LineContent[] = [
  <span style={{ color: "#E28A4B" }}>Waiting</span>,
  <span style={{ color: "#E28A4B" }}>Anymore</span>,
  <span style={{ color: "#E28A4B" }}>For Us</span>,
  <>
    <span
      style={{
        color: "#F5D5A7",
      }}>World Peace.</span>
      <br/>
      <span style={{ color: "#111", fontWeight:"700" }}>Now.</span>
  </>

];

interface HeroProps {
  signedCount: number;
  countriesCount: number;
  watchingCount: number;
}

const HeroDesktop: React.FC<HeroProps> = ({signedCount, countriesCount, watchingCount}) => {
    const [speechVisible, setSpeechVisible] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const voteNowButtonRef = useRef<HTMLAnchorElement>(null);
    const voteNowSpotlightRef = useRef<HTMLSpanElement>(null);
    const decenteralizedButtonRef = useRef<HTMLAnchorElement>(null);
    const decentralizedSpotlightRef = useRef<HTMLSpanElement>(null);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [isQROpen, setIsQROpen] = useState(false);
    const qrRef = useRef<HTMLImageElement>(null);

    const launchDate = useMemo(() => {
      const date = new Date();
      date.setDate(date.getDate() + 35);
      return date;
    }, []);

    useGSAP(() => {
      const addHoverAnimation = (buttonRef: React.RefObject<HTMLElement>, spotlightRef: React.RefObject<HTMLElement>) => {
        if (!buttonRef.current || !spotlightRef.current) return;
  
        const onMouseMove = (evt: MouseEvent) => {
          const rect = buttonRef.current!.getBoundingClientRect();
          const movX = evt.clientX - rect.x;
          gsap.to(spotlightRef.current, { x: movX, scale: 15, duration: 0.3 });
        };
  
        const onMouseLeave = () => {
          gsap.to(spotlightRef.current, { scale: 0, duration: 0.3 });
        };
  
        buttonRef.current.addEventListener('mousemove', onMouseMove);
        buttonRef.current.addEventListener('mouseleave', onMouseLeave);
  
        return () => {
          buttonRef.current?.removeEventListener('mousemove', onMouseMove);
          buttonRef.current?.removeEventListener('mouseleave', onMouseLeave);
        };
      };

      return () => {
        addHoverAnimation(voteNowButtonRef as React.RefObject<HTMLAnchorElement>, voteNowSpotlightRef as React.RefObject<HTMLSpanElement>);
        addHoverAnimation(decenteralizedButtonRef as React.RefObject<HTMLAnchorElement>, decentralizedSpotlightRef as React.RefObject<HTMLSpanElement>);
      }
    }, { scope: containerRef });
  

    const toggleQROverlay = () => {
      if (!qrRef.current) return;
      
      if (!isQROpen) {
        // Open QR overlay
        setIsQROpen(true);
        
        // Get original position and dimensions
        const rect = qrRef.current.getBoundingClientRect();
        const viewportCenter = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        };
        
        // Calculate the transform needed to move from current position to center
        const deltaX = viewportCenter.x - (rect.left + rect.width / 2);
        const deltaY = viewportCenter.y - (rect.top + rect.height / 2);
        
        // Store original transform for return animation
        qrRef.current.dataset.originalTransform = qrRef.current.style.transform || '';
        
        // Animate QR code to center using transform (no backdrop)
        gsap.to(qrRef.current, {
          zIndex: 10001, // High z-index to stay on top
          scale: 1.8,
          x: deltaX,
          y: deltaY,
          opacity: 0.9, // Slightly reduced opacity for more prominence
          duration: 0.6,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = `
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            `;
            closeBtn.className = 'absolute -top-8 -right-8 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200 flex items-center justify-center z-[10002] cursor-pointer';
            closeBtn.onclick = toggleQROverlay;
            document.body.appendChild(closeBtn);
            
            // Add click-around-the-screen functionality
            const handleClickOutside = (e: MouseEvent) => {
              if (e.target !== closeBtn && e.target !== qrRef.current) {
                toggleQROverlay();
              }
            };
            
            // Add scroll functionality
            const handleScroll = () => {
              toggleQROverlay();
            };
            
            // Store event listeners for cleanup
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('scroll', handleScroll);
            document.addEventListener('wheel', handleScroll);
            
            // Store cleanup function
            if (qrRef.current) {
              qrRef.current.dataset.cleanup = JSON.stringify({
                clickOutside: handleClickOutside,
                scroll: handleScroll,
                wheel: handleScroll
              });
            }
          }
        });
        
      } else {
        // Close QR overlay
        setIsQROpen(false);
        
        // Remove close button
        const closeBtn = document.querySelector('button[onclick="toggleQROverlay"]');
        if (closeBtn) closeBtn.remove();
        
        // Clean up event listeners
        if (qrRef.current && qrRef.current.dataset.cleanup) {
          try {
            const cleanup = JSON.parse(qrRef.current.dataset.cleanup);
            document.removeEventListener('click', cleanup.clickOutside);
            document.removeEventListener('scroll', cleanup.scroll);
            document.removeEventListener('wheel', cleanup.wheel);
            delete qrRef.current.dataset.cleanup;
          } catch (e) {
            // Fallback cleanup
            document.removeEventListener('click', () => {});
            document.removeEventListener('scroll', () => {});
            document.removeEventListener('wheel', () => {});
          }
        }
        
        // Animate QR code back to original position
        gsap.to(qrRef.current, {
          zIndex: 'auto',
          scale: 1,
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Reset to original transform
            if (qrRef.current && qrRef.current.dataset.originalTransform) {
              qrRef.current.style.transform = qrRef.current.dataset.originalTransform;
            }
          }
        });
      }
    };

    // Add ESC key functionality for QR overlay
    useEffect(() => {
      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isQROpen) {
          toggleQROverlay();
        }
      };

      if (isQROpen) {
        window.addEventListener('keydown', handleEscKey);
      }

      return () => {
        window.removeEventListener('keydown', handleEscKey);
      };
    }, [isQROpen]);

    return (
        <div className="flex flex-col xl:flex-row first-section w-full h-full gap-8 xl:gap-0">
          {/* Main content section */}
          <div className="flex flex-col gap-5 space-y-6 sm:space-y-8 lg:space-y-10 justify-around flex-1 order-2 xl:order-1">            
            {/* <RadioPlayer /> */}
            <div id="SpeechSection" className={`speech-section ${speechVisible ? "visible" : "hidden"} flex flex-wrap flex-col justify-between headline-text-style`} style={{display: 'flex', justifyContent: 'center'}}>
              <div className="flex animation top-animation headline-size justify-center">
                <div className="slides top-slides">
                    {topLines.map((content, idx) => (
                      <div className="line" key={`top-${idx}`}>
                        {content}
                    </div>
                    ))}
                </div>
              </div>
              <div className="flex animation bottom-animation headline-size">
                <div className="slides bottom-slides">
                    {bottomLines.map((content, idx) => (
                    <div className="line" key={`bottom-${idx}`}>
                        {content}
                    </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* Buttons - responsive stacking */}
            <div ref={containerRef} className="flex flex-col sm:flex-row justify-start sm:justify-center xl:justify-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 font-bebas tracking-wider px-4 sm:px-0">
              <button className="bg-transparent border border-white text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-white hover:text-black transition-all duration-200 flex items-center justify-center min-w-fit text-center" style={{ borderColor: 'white', borderWidth: '1px', borderStyle: 'solid' }}>
                <span className="tracking-wider text-base sm:text-lg font-bold uppercase">INFLUENCE POLICY ON THE SYNC APP</span>
              </button>
              
              <button
                onClick={toggleQROverlay}
                className="bg-yellow-400 text-black font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-yellow-300 transition-all duration-200 flex items-center justify-center min-w-fit"
              >
                <span className="tracking-wider text-base sm:text-lg font-bold uppercase">PLEDGE FOR PEACE</span>
              </button>
            </div>
            
            {/* Stats bar - positioned properly on mobile */}
            <div className="absolute bottom-4 sm:bottom-8 justify-end flex flex-row w-full px-4 sm:px-0">
              <div className="arrow-container mr-4">
                <button className="arrow">
                    <ArrowDownwardIcon />
                </button>
              </div>
              <div className="flex flex-row flex-wrap justify-end">
                <StatsBar
                  signedCount={signedCount}
                  countriesCount={countriesCount}
                  watchingCount={watchingCount}
                />
              </div>
            </div>
          </div>
          
          {/* QR Code section - responsive sizing and positioning */}
          <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:pr-8 xl:pl-8 order-1 xl:order-2">
            <div className="flex items-center justify-center">
              <img
                ref={qrRef}
                src="/entry-qr.svg"
                alt="Entry QR Code"
                className="opacity-70 transition-all duration-300 cursor-pointer"
                style={{ 
                  display: "block", 
                  filter: "none", 
                  boxShadow: "none",
                  width: 'calc(var(--sizer) * 12rem)',
                  height: 'calc(var(--sizer) * 12rem)',
                  minWidth: 'calc(var(--sizer) * 12rem)',
                  minHeight: 'calc(var(--sizer) * 12rem)',
                  maxWidth: 'calc(var(--sizer) * 24rem)',
                  maxHeight: 'calc(var(--sizer) * 24rem)'
                }}
              />
            </div>
          </div>
        </div>
    );
};

const HeroMobile: React.FC<HeroProps> = ({signedCount, countriesCount, watchingCount}) => {
    const [topLine, setTopLine] = useState<LineContent>(topLines[0]);
    const [bottomLine, setBottomLine] = useState<LineContent>(bottomLines[0]);
    
    useGSAP(() => {
      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: "expo.inOut" },
        repeat: -1,
      });
      topLines.forEach((_, i) => {
        tl.call(() => setTopLine(topLines[i]), [], "+=0") // Update top line
        .call(() => setBottomLine(bottomLines[i]), [], "<") // Update bottom line simultaneously
          .fromTo(
            ".top-line",
            { y: -54 }, // Start above container
            { y: 0 } // Enter container
          )
          .fromTo(
            ".bottom-line",
            { y: -54 }, // Start above container
            { y: 0 },
            "<"
          )
          .to({}, { duration: 4 }) // Hold for 4 seconds
          .to(".top-line", { y: 400 }) // Exit below container
          .to(".bottom-line", { y: 400 }, "<"); // Exit below container
      });
    }, []);

    return( 
      <div className="flex flex-col h-[88vh] font-bebas relative justify-between">
        {/* Sentences at the absolute top */}
        <div className="w-full">
          <div className="mb-2">
            <div className="w-full overflow-hidden">
              <div className="top-line w-full text-left text-7xl sm:text-8xl font-bold leading-tight mb-2">
                {topLine}
              </div>
            </div>
            <div className="w-full overflow-hidden">
              <div className="bottom-line w-full text-left text-7xl sm:text-8xl font-bold leading-tight">
                {bottomLine}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with stats and buttons */}
        <div className="px-4 pb-8">
          {/* Stats section */}
          <div className="flex flex-col gap-4 sm:gap-6 mb-6">
            {/* First row: people signed and countries */}
            <div className="flex gap-4 sm:gap-6 justify-between items-center">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-amber-300 flex items-end pb-1 flex-shrink-0">
                  <PeaceSign className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-lg blur-[1px]" />
                </span>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-5xl sm:text-6xl font-bold text-white">{signedCount.toLocaleString()}</div>
                  <div className="text-lg text-gray-100 uppercase tracking-wider">people signed for peace</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-1">
                <span className="text-amber-300 flex items-end pb-1 flex-shrink-0">
                  <Flag className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-lg blur-[1px]" />
                </span>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-5xl sm:text-6xl font-bold text-white">{countriesCount}</div>
                  <div className="text-lg text-gray-100 uppercase tracking-wider">countries</div>
                </div>
              </div>
            </div>
            
            {/* Second row: actively watching */}
            <div className="flex items-center gap-2">
              <span className="text-amber-300 flex items-end pb-1 flex-shrink-0">
                <Eye className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-lg blur-[1px]" />
              </span>
              <div className="text-left">
                <div className="text-5xl sm:text-6xl font-bold text-white">{watchingCount}</div>
                <div className="text-lg text-gray-100 uppercase tracking-wider">actively watching</div>
              </div>
            </div>
          </div>

          {/* Buttons section */}
          <div className="flex flex-row gap-3 sm:gap-4 w-full">
            <button className="text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-white hover:text-black transition-all duration-200 flex items-center justify-center gap-2 flex-[0.65] text-center border-[1px] border-solid border-white bg-transparent">
              <span className="tracking-wider text-base sm:text-lg uppercase">CIVILIAN POLICY ON SYNC APP</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/vote'}
              className="bg-amber-300 text-[#1e2649] font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-amber-200 transition-all duration-200 flex items-center justify-center flex-[0.35]"
            >
              <span className="tracking-wider text-base sm:text-lg uppercase">PLEDGE FOR PEACE</span>
            </button>
          </div>
        </div>
      </div>
    );
};

const Hero: React.FC<HeroProps> = ({signedCount, countriesCount, watchingCount}) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);    
    
    useEffect(() => {
      // Check window width on mount
      setIsMobile(window.innerWidth <= 768);
      
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <HeroMobile signedCount={signedCount} countriesCount={countriesCount} watchingCount={watchingCount} /> 
    : <HeroDesktop signedCount={signedCount} countriesCount={countriesCount} watchingCount={watchingCount} />;
};

export default Hero; 