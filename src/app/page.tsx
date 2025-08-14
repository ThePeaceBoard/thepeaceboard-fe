'use client';
import { useEffect, useRef, useState } from 'react';
import SocialBar from "./components/SocialBar";
import MinimalCountdown from "./components/MinimalCountdown";
import NewsletterSignup from "./components/NewsletterSignup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import './styles/ComingSoon.css';
import styles from './styles/ScreenEffects.module.scss';
import { useGlobalStore } from './store/useGlobalStore';
import NavBar from './components/navigation/NavBar';
import Footer from './components/Footer';
import dynamic from 'next/dynamic';
import { SonarProvider, useSonar } from './components/sonar-provider';
import { useAuth0 } from '@auth0/auth0-react';
import { ActivityIcon, PeaceIcon, ProjectionIcon, FullscreenIcon, ExitFullscreenIcon, BackIcon } from './components/icons';
import { ScreenEffect } from './components/ScreenEffect';
import QROverlay from './components/QROverlay';

gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

// Use dynamic imports for components that might cause hydration issues
const DynamicLayeredMap = dynamic(() => import('./components/LayeredMap'), { ssr: false });
const DynamicHero = dynamic(() => import('./components/Hero'), { ssr: false });
const DynamicSplashScreen = dynamic(() => import('./components/SplashScreen'), { ssr: false });

export default function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const heroRef = useRef<HTMLDivElement>(null);
  const peaceMapRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [activeMapType, setActiveMapType] = useState<'peace' | 'heat'>('peace');
  const [projectionType, setProjectionType] = useState<'globe' | 'mercator'>('mercator');
  const [isQROpen, setIsQROpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const activeUsers = useGlobalStore(state => state.activeUsers) || 127; // Dummy data
  const totalPledges = useGlobalStore(state => state.totalPledges) || 245683; // Dummy data
  const countriesCount = useGlobalStore(state => state.countriesCount) || 18; // Dummy data
  const setUserLocation = useGlobalStore(state => state.setUserLocation);
  const { sendPing } = useSonar()

  let animating = false;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMapMode = () => {
    setActiveMapType(activeMapType === 'heat' ? 'peace' : 'heat');
  };
  
  // Scroll the main container to the next <section> from the clicked element
  const handleScrollToNextSection = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const targetEl = e.currentTarget as HTMLElement;
    const currentSection = targetEl.closest('section');
    if (!currentSection) return;
    const sectionsList = Array.from(container.querySelectorAll('section')) as HTMLElement[];
    const currentIndex = sectionsList.indexOf(currentSection as HTMLElement);
    const nextSection = sectionsList[currentIndex + 1];
    const y = nextSection
      ? nextSection.offsetTop - container.offsetTop
      : (container.scrollHeight - container.clientHeight);
    gsap.to(container, {
      scrollTo: { y },
      duration: 0.8,
      ease: 'power1.inOut',
    });
  };

  const toggleGlobeClick = () => {
    if(projectionType === 'globe') {
      setProjectionType('mercator');
    } else {
      setProjectionType('globe');
    }
  }
  
  const toggleFullscreen = () => {
    if (!peaceMapRef.current) return;
    
    // Get direct reference to the control panels
    const controlPanels = peaceMapRef.current.querySelectorAll('.map-overlay > div');
    
    if (!isFullscreen) {
      // ENTERING FULLSCREEN
      
      // 1. Get current dimensions and position
      const rect = peaceMapRef.current.getBoundingClientRect();
      const computedScale = getComputedScale(peaceMapRef.current);
      
      // 2. Save scroll position
      if (containerRef.current) {
        containerRef.current.dataset.lastScrollPosition = containerRef.current.scrollTop.toString();
        containerRef.current.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      }
      
      // 3. First freeze in place with position:fixed
      gsap.set(peaceMapRef.current, {
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width, 
        height: rect.height,
        zIndex: 9999,
        pointerEvents: 'auto'
      });
      
      // 4. Animate control panels dramatically - guaranteed to be visible
      controlPanels.forEach((panel, i) => {
        // First move them far away and make them transparent
        gsap.set(panel, {
          opacity: 0,
          x: 100,
          scale: 0.7,
          backgroundColor: 'rgba(0,0,0,0)'
        });
      });
      
      // 5. Create a timeline for the map animation sequence
      const tl = gsap.timeline({
        onComplete: () => {
          // When map animation finishes, animate control panels back in
          controlPanels.forEach((panel, i) => {
            gsap.to(panel, {
              opacity: 1,
              x: 0,
              scale: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              delay: i * 0.1, // Stagger each panel
              duration: 0.5,
              ease: "back.out(1.7)"
            });
          });
          
          // Update React state after animation completes
          setFullscreen(true);
        }
      });
      
      // Animate directly to fullscreen with bounce
      tl.to(peaceMapRef.current, {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        scale: 1,
        borderRadius: 0,
        duration: 0.7,
        ease: "back.out(1.5)" // Bounce effect
      });
      
    } else {
      // EXITING FULLSCREEN
      
      // Get the scroll progress to determine the right scale when exiting
      const scrollTriggers = ScrollTrigger.getAll();
      const mapTrigger = scrollTriggers.find(st => st.vars.trigger === peaceMapRef.current);
      let targetScale = 1;
      
      if (mapTrigger && mapTrigger.progress > 0) {
        targetScale = gsap.utils.interpolate(1, 0.9, mapTrigger.progress); 
      }
      
      // First animate control panels out
      controlPanels.forEach((panel, i) => {
        gsap.to(panel, {
          opacity: 0,
          x: 100,
          scale: 0.7,
          backgroundColor: 'rgba(0,0,0,0)',
          duration: 0.3,
          delay: i * 0.05,
          ease: "power2.in"
        });
      });
      
      // Create exit animation timeline
      const tl = gsap.timeline();
      
      // First scale down with bounce
      tl.to(peaceMapRef.current, {
        scale: targetScale * 0.96, // Slightly smaller
        duration: 0.3,
        ease: "power2.in"
      });
      
      // Then bounce back to target scale
      tl.to(peaceMapRef.current, {
        scale: targetScale,
        duration: 0.5,
        ease: "back.out(1.2)",
        onComplete: () => {
          // Restore position
          gsap.to(peaceMapRef.current, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 'auto',
            duration: 0.2,
            clearProps: 'top,left,width,height',
            onComplete: () => {
              // Restore scrolling
              if (containerRef.current) {
                containerRef.current.style.overflow = 'auto';
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                
                // Restore scroll position
                const lastScrollPosition = containerRef.current.dataset.lastScrollPosition;
                if (lastScrollPosition) {
                  containerRef.current.scrollTop = parseInt(lastScrollPosition, 10);
                }
              }
              
              // Update React state at the end
              setFullscreen(false);
              
              // Reset styles
              gsap.set(peaceMapRef.current, {
                position: 'absolute',
                pointerEvents: 'none'
              });
              
              // Animate control panels back in based on scroll position
              const scrollTriggers = ScrollTrigger.getAll();
              const mapTrigger = scrollTriggers.find(st => st.vars.trigger === peaceMapRef.current);
              
              if (mapTrigger && mapTrigger.progress > 0.2) {
                controlPanels.forEach((panel, i) => {
                  gsap.to(panel, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    delay: i * 0.1,
                    duration: 0.4,
                    ease: "back.out(1.2)"
                  });
                });
              }
            }
          });
        }
      });
    }
  };

  const toggleQROverlay = () => {
    setIsQROpen(!isQROpen);
  };

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);
 
  // Helper function to get computed scale
  const getComputedScale = (element: HTMLElement): number => {
    const computedStyle = window.getComputedStyle(element);
    const transform = computedStyle.transform;
    
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\((.+)\)/);
      if (matrix) {
        const values = matrix[1].split(', ');
        // Scale is the first value in the matrix
        return parseFloat(values[0]);
      }
    }
    return 1; // Default if not scaled
  };

  // Add event listener for ESC key to exit fullscreen
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          toggleFullscreen();
        } else if (isQROpen) {
          toggleQROverlay();
        }
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen, isQROpen, toggleQROverlay]);

  // Handle container overflow when fullscreen state changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    if (isFullscreen) {
      // Store current scroll position for when we exit fullscreen
      const currentScrollY = containerRef.current.scrollTop;
      containerRef.current.dataset.lastScrollPosition = currentScrollY.toString();
      
      // Explicitly prevent scrolling on the container when in fullscreen
      containerRef.current.style.overflow = 'hidden';
      
      // Also prevent scrolling on the body and html
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      containerRef.current.style.overflow = 'auto';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Restore scroll position when exiting fullscreen if needed
      const lastScrollPosition = containerRef.current.dataset.lastScrollPosition;
      if (lastScrollPosition) {
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = parseInt(lastScrollPosition, 10);
          }
        }, 50);
      }
    }
    
    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.style.overflow = 'auto';
      }
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isFullscreen]);

  //scroll observer
  useEffect(() => {
    // Don't initialize GSAP until component is mounted
    if (!isMounted) return;
    
    const sections = containerRef.current?.querySelectorAll("section");
    const header = containerRef.current?.querySelector("nav");
    const footer = containerRef.current?.querySelector("footer");
    const secondMapSection = containerRef.current?.querySelector(".second-map");
    sectionsRef.current = Array.from(sections || []);
    let observer: any;
    let scrollTrigger: any;

    if (!peaceMapRef.current || !containerRef.current || !secondMapSection) {
      return;
    }
  
    ScrollTrigger.defaults({
      scroller: containerRef.current,
      markers: false,
    });

    // Force initial scale to 1 when not in fullscreen mode
    if (!isFullscreen) {
      gsap.set(peaceMapRef.current, {
        scale: 1,
        immediateRender: true,
        overwrite: "auto",
        force3D: true,
      });
    }

    // Create a scroll trigger with explicit start and end positions
    scrollTrigger = ScrollTrigger.create({
      trigger: tvRef.current,
      scroller: containerRef.current,
      start: "top top",
      endTrigger: secondMapSection,
      end: "top top",
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Scale the map from 1 to 0.9 based on scroll progress
        if (!isFullscreen && tvRef.current) {
          const scale = gsap.utils.interpolate(1, 0.9, self.progress);
          gsap.set(tvRef.current, { scale: scale, pointerEvents: "none" });
          
          // Get direct reference to the control panels
          const controlPanels = tvRef.current.querySelectorAll('.map-overlay > div');
          
          // Handle overlay visibility with the same beautiful animation as fullscreen toggle
          if (self.progress > 0.2) {
            // Show the panels with animation when scrolled down
            controlPanels.forEach((panel, i) => {
              // Check if it's already animated in
              const currentX = gsap.getProperty(panel, "x");
              if (currentX !== 0) {
                gsap.to(panel, {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  delay: i * 0.1, // Stagger each panel
                  duration: 0.5,
                  ease: "back.out(1.7)"
                });
              }
            });
          } else {
            // Hide the panels with animation when scrolled to top
            controlPanels.forEach((panel, i) => {
              // Check if it's already animated out
              const currentOpacity = gsap.getProperty(panel, "opacity");
              if (currentOpacity !== 0) {
                gsap.to(panel, {
                  opacity: 0,
                  x: 100,
                  scale: 0.7,
                  backgroundColor: 'rgba(0,0,0,0)',
                  duration: 0.3,
                  delay: i * 0.05,
                  ease: "power2.in"
                });
              }
            });
          }
        }
      }
    });

    // Define scroll section handling
    const handleScroll = (direction: "up" | "down") => {
      if (animating || isFullscreen) return;
      
      const container = containerRef.current;
      const scrollPosition = container?.scrollTop ?? 0;
      const containerTop = container?.offsetTop ?? 0;

      // Base offsets: top of each section relative to container
      const sectionOffsets = sectionsRef.current.map((section, index) => {
        const offset = section.offsetTop - containerTop;
        return index === 0 ? 0 : offset;
      });

      // Add an explicit stop at the top of the footer, and one final stop at the very end
      const footerTopOffset = (footer?.offsetTop ?? 0) - containerTop;
      // Add an explicit stop inside the "launch" section where the subscribe text sits
      const subscribeEl = containerRef.current?.querySelector('.section3-paragraph') as HTMLElement | null;
      const subscribeOffset = subscribeEl ? Math.max(0, subscribeEl.offsetTop - containerTop - 40) : null;

      // Final end-of-page stop so the last snap shows full footer & socials
      const endOffset = Math.max(
        (container?.scrollHeight ?? 0) - (container?.clientHeight ?? 0),
        (footer?.offsetTop ?? 0) - containerTop + (footer?.offsetHeight ?? 0) - (container?.clientHeight ?? 0)
      );

      // Build a sorted, unique offsets array
      const offsetsRaw = [
        ...sectionOffsets,
        subscribeOffset,
        endOffset,
      ].filter((v): v is number => typeof v === 'number' && isFinite(v));

      let adjustedOffsets = Array.from(new Set(offsetsRaw)).sort((a, b) => a - b);

      // If we have a subscribe stop, collapse any intermediate stops between subscribe and end
      if (typeof subscribeOffset === 'number') {
        const subIdx = adjustedOffsets.indexOf(subscribeOffset);
        const lastIdx = adjustedOffsets.length - 1;
        if (subIdx !== -1 && lastIdx > subIdx) {
          adjustedOffsets = adjustedOffsets.filter((_, i) => i <= subIdx || i === lastIdx);
        }
      }

      const currentIndex = adjustedOffsets.findIndex((offset, index) => {
        const nextOffset = adjustedOffsets[index + 1] || Infinity;
        return scrollPosition >= offset && scrollPosition < nextOffset;
      });
  
      if (currentIndex === -1) return;
  
      if (direction === "down" && currentIndex < adjustedOffsets.length - 1) {
        scrollToSection(currentIndex + 1, adjustedOffsets);
      } else if (direction === "up" && currentIndex > 0) {
        scrollToSection(currentIndex - 1, adjustedOffsets);
      }
    };
  
    const scrollToSection = (index: number, offsets: number[]) => {
      if (animating || isFullscreen) return;
      animating = true;
  
      const container = containerRef.current;
      gsap.to(container, {
        scrollTo: { y: offsets[index] },
        duration: 1,
        ease: "power1.inOut",
        onComplete: () => {
          animating = false;
        },
      });
    };

    observer = Observer.create({
      type: "wheel,touch,pointer",
      target: containerRef.current,
      onDown: () => {
        if (!isFullscreen) handleScroll("down");
      },
      onUp: () => {
        if (!isFullscreen) handleScroll("up");
      },
      preventDefault: !isFullscreen,
      tolerance: 10,
    });

    if (isFullscreen) {
      // DON'T disable the scrollTrigger - this breaks functionality
      // Just add fullscreen-specific logic here if needed
    } 
    else {
      // Don't need to explicitly enable since we never disable it
      ScrollTrigger.refresh();
    }
  
    return () => {
      observer?.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMounted, isFullscreen]);
  
  // Location fetcher
  useEffect(() => {
    const fetchAndUpdateLocation = async () => {
      try {
        const storedData = sessionStorage.getItem("geoData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserLocation(parsedData);
          return parsedData;
        }

        // TEMPORARY: Skip network call for performance
        return;

        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        
        const geoData = {
          country_code: data.country_code,
          latitude: data.latitude, 
          longitude: data.longitude,
          city: data.city,
          region: data.region,
          country_name: data.country_name
        };

        sessionStorage.setItem("geoData", JSON.stringify(geoData));
        setUserLocation(geoData);
        
        await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(geoData)
        });

        return geoData;
      } catch (error) {
        console.error("Error fetching location data:", error);
        return null;
      }
    };

    fetchAndUpdateLocation();
  }, [setUserLocation]);

  // Initialize control panels in the correct state on first load
  useEffect(() => {
    if (!isMounted || !peaceMapRef.current) return;
    
    // Get direct reference to the control panels
    const controlPanels = peaceMapRef.current.querySelectorAll('.map-overlay > div');
    
    // Initially hide the panels with the same styling as our animations
    controlPanels.forEach((panel) => {
      gsap.set(panel, {
        opacity: 0,
        x: 100,
        scale: 0.7,
        backgroundColor: 'rgba(0,0,0,0)'
      });
    });
    
  }, [isMounted]);

  // Add this useEffect for ScreenEffect initialization
  useEffect(() => {
    // Make sure this runs only in the client environment
    if (typeof window === 'undefined') return;
    
    // Get the actual map element instead of the screen
    const mapEl = document.querySelector<HTMLDivElement>('.map-view');
    if (!mapEl) return;

    // Create the ScreenEffect instance targeting the map
    const retro = new ScreenEffect(mapEl, {});

    // Add whichever effects you want to turn on by default:
    retro
      .add('vcr', { fps: 60, blur: 1 })
      .add('snow', { opacity: 0.2 })
      .add('scanlines')
      .add('wobblex')
      .add('wobbley')
      .add('vignette');

    return () => {
      // Cleanup when component unmounts
      retro.remove('vcr');
      retro.remove('snow');
      retro.remove('scanlines');
      retro.remove('wobblex');
      retro.remove('wobbley');
      retro.remove('vignette');
    };
  }, []);

  return (
    <SonarProvider>
      <div ref={containerRef} className="app-container will-change-auto pointer-events-auto overflow-x-hidden"> 
        <DynamicSplashScreen totalPledges={totalPledges} activeUsers={activeUsers} onAnimationComplete={() => {}} />
        
        {/* QR Overlay */}
        <QROverlay isOpen={isQROpen} onClose={() => setIsQROpen(false)} />

        <div className="animated-page will-change-auto scene flex flex-col pointer-events-auto overflow-x-hidden">
          <NavBar 
            setProjectionType={setProjectionType}
            setActiveMapType={setActiveMapType}
            projectionType={projectionType}
            activeMapType={activeMapType}
          />
          
          <div ref={tvRef} className="absolute top-0 w-dvw h-dvh">
            <div id="screen" className="absolute top-0 w-dvw h-dvh" />
            <div
              ref={peaceMapRef} 
              className="map-view absolute top-0 w-full"
              style={{
                backgroundColor: '#111827',
                pointerEvents: isFullscreen ? 'auto' : 'none',
              }}
            >
              <DynamicLayeredMap />
              
              <div className="map-overlay absolute top-14 right-10 z-[60] flex flex-col items-end gap-4 pointer-events-auto">
                <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-3 py-4 border border-white/20 w-14">
                  {isFullscreen ? (
                    <button
                      onClick={toggleFullscreen}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white/60 hover:text-white/90"
                      title="Exit Fullscreen"
                    >
                      <BackIcon className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={toggleFullscreen}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white/60 hover:text-white/90"
                      title="Enter Fullscreen"
                    >
                      <FullscreenIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-3 py-4 border border-white/20 w-14">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-orange-400`}>
                    <PeaceIcon className="w-5 h-5" />
                  </div>
                  <label className="cursor-pointer flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={activeMapType === 'heat'}
                      onChange={toggleMapMode}
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 peer-checked:text-blue-400 text-white/40 hover:text-white/60 transition-colors">
                      <ActivityIcon className="w-5 h-5" />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <section ref={firstSectionRef} id="join" className="first flip will-change-auto scene text-center max-w-full z-max">
              <DynamicHero signedCount={totalPledges} countriesCount={countriesCount} watchingCount={activeUsers} />
          </section>

          <section className="second-map w-full will-change-auto h-screen">
          </section>

          <section id="sync" className="second tracking-wider gap-8 sm:gap-12 lg:gap-14 w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start">
              <SocialBar/>
            </div>
            <h1 className="section-title flex flex-row gap-2 flex-wrap text-4xl sm:text-5xl lg:text-6xl">
              <span>We are</span>
              <span style={{ color: "#E28A4B"}}>Sync</span>
            </h1>
            <p className="section-paragraph text-base sm:text-lg lg:text-xl sm:max-w-4xl w-[80%] sm:w-auto mx-auto">
              a global democracy correction movement working on creating national narratives driven by civilians, AIMING TO FIX the lack of control, MIS-REPRESENTATION and powerlessness PEOPLE experience with their modern "democratic" governments WORLDWIDE.
            </p>
            
            {/* Buttons: same row on desktop; equal sizes on mobile with smaller gap */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 sm:mt-8 justify-start w-[90%] sm:w-auto mx-auto sm:mx-0">
              <button onClick={handleScrollToNextSection} className="bg-black text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 text-center w-full sm:w-auto sm:min-w-fit flex-1" style={{ border: '1px solid white' }}>
                <span className="tracking-wider text-base sm:text-lg uppercase">CIVILIAN DRIVEN WORLD PEACE</span>
                <span className="text-lg sm:text-xl">→</span>
              </button>
              <button 
                onClick={isMobile ? () => window.location.href = '/vote' : toggleQROverlay}
                className="bg-yellow-400 text-black py-3 sm:py-4 px-6 sm:px-8 rounded-2xl border-1 border-white hover:bg-yellow-300 hover:border-white transition-all duration-200 flex items-center justify-center text-center w-full sm:w-auto sm:min-w-fit flex-1"
              >
                PLEDGE FOR PEACE
              </button>
            </div>
            
          </section>

          <section id="world-peace" className="third tracking-wider w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row justify-around gap-8 md:gap-12 lg:gap-16 xl:gap-32">
              <div className="section-title flex flex-col text-center lg:text-right justify-center flex-1 order-1 lg:order-2">
                <h1 className="break-words text-5xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                  CIVILIAN-DRIVEN <br />
                  <span style={{ color: "#E28A4B" }}>WORLD</span> <span style={{ color: "#E28A4B" }}>PEACE</span>
                </h1>
                {/* Desktop-only buttons under the title */}
                <div className="hidden lg:flex flex-row gap-4 mt-6 justify-center lg:justify-start">
                  <button className="bg-yellow-400 text-black py-3 px-6 rounded-2xl border-1 border-white hover:bg-yellow-300 hover:border-white transition-all duration-200 flex items-center justify-center min-w-fit">
                    <span className="tracking-wider text-base uppercase">TAKE ME TO THE VOTE</span>
                  </button>
                  <button onClick={handleScrollToNextSection} className="bg-black text-white py-3 px-6 rounded-2xl hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 min-w-fit text-center" style={{ border: '1px solid white' }}>
                    <span className="tracking-wider text-base uppercase">WHAT IF GOVERNMENTS DON'T CARE</span>
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
              <div className="world-peace-paragraph flex flex-col gap-4 sm:gap-6 flex-1 max-w-3xl lg:max-w-none order-2 lg:order-1 w-[90%] mx-auto lg:w-auto">
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  WE'VE BUILT A <span className="highlight">PEACE BOARD</span> SHOWCASING
                  THE AMOUNTS OF <span className="highlight">CIVILIANS</span> INTERESTED
                  IN <span className="highlight">PEACE</span>, BY NATION.
                </p>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  BY JOINING TOGETHER, CIVILIANS FORM COLLECTIVE,
                  MAJORITY-DRIVEN NARRATIVES THAT GOVERNMENTS ARE OBLIGATED TO
                  FOLLOW - OR SIMPLY LOSE LEGITIMACY AND TURN NON DEMOCRATIC, GIVING
                  GOVERNMENTS A CLEAR LINE OF WORK AND CIVILIANS THE POWER TO INFLUENCE
                  IT.
                </p>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  WHEN A NATION REACHES MAJORITY SUPPORT FOR PEACE, IT IS DECLARED
                  PEACEFUL AND IMMEDIATELY JOINS A GLOBAL NETWORK OF SYNCHRONIZED
                  NATIONS. THIS NETWORK WORKS TOGETHER TO CHALLENGE NON-COOPERATIVE
                  GOVERNMENTS, DEMAND ALIGNMENT WITH THE PEOPLE, AND SUPPORT MOVEMENTS
                  FOR PEACE WORLDWIDE.
                </p>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  WE AIM TO CREATE WORLD PEACE BY INTRODUCING AN ULTIMATUM OF
                  LEGITIMACY AND FACILITATING A PLATFORM FOR PEOPLE TO PLEDGE THEIR
                  DEMAND FOR PEACE AND VOICE THEIR COLLECTIVE POWER.
                </p>
              </div>
              {/* Buttons after text on mobile; hidden on desktop to avoid duplication */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 lg:mt-6 justify-center lg:justify-start order-3 lg:order-2 w-[80%] mx-auto lg:w-auto lg:hidden">
                  <button className="bg-yellow-400 text-black py-3 sm:py-4 px-6 sm:px-8 rounded-2xl border-1 border-white hover:bg-yellow-300 hover:border-white transition-all duration-200 flex items-center justify-center min-w-fit">
                    <span className="tracking-wider text-base sm:text-lg uppercase">TAKE ME TO THE VOTE</span>
                  </button>
                <button onClick={handleScrollToNextSection} className="bg-black text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 min-w-fit text-center" style={{ border: '1px solid white' }}>
                    <span className="tracking-wider text-base sm:text-lg uppercase">WHAT IF GOVERNMENTS DON'T CARE</span>
                    <span className="text-lg sm:text-xl">→</span>
                  </button>
              </div>
            </div>          
            {/* Additional buttons section */}
          </section>

          <section id="sync-token" className="font-bebas sync-token-section text-white tracking-wider w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8">
                <span style={{ color: "#E28A4B" }}>SYNC TOKEN &</span>
                <br />
                <span className="text-white">ECONOMICS</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-12 w-[80%] sm:w-auto max-w-4xl mx-auto">
                THE SYNC TOKEN IS EARNED BY SIGNING A PEACE CONTRACT—A DAO-DEFINED AGREEMENT SHAPED BY THE GLOBAL COLLECTIVE—AND BY PLEDGING A SYMBOLIC AMOUNT (ONE UNIT OF LOCAL CURRENCY). IT GRANTS ACCESS TO THE SYNC APP, A PLATFORM THAT ACTIVATES CIVILIAN POWER WHEN GOVERNMENTS STALL, DEADLOCK, OR NEED GUIDANCE—THROUGH MAJORITY VOTING. IT REVIVES TRUE DEMOCRACY—LIKE IN ANCIENT GREECE—WHERE THE WILL OF THE PEOPLE LEADS THE MAJORITY TO PEACE AND PROGRESS.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-[80%] sm:w-auto mx-auto">
                <button className="bg-black text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 min-w-fit text-center" style={{ border: '1px solid white' }}>
                <span className="tracking-wider text-base sm:text-lg uppercase">I'M STILL NOT CONVINCED</span>
                <span className="text-lg sm:text-xl">→</span>
                </button>
                
                <button 
                  onClick={isMobile ? () => window.location.href = '/vote' : toggleQROverlay}
                  className="bg-yellow-400 text-black py-3 sm:py-4 px-6 sm:px-8 rounded-2xl border-1 border-white hover:bg-yellow-300 hover:border-white transition-all duration-200 flex items-center justify-center min-w-fit"
                >
                  <span className="tracking-wider text-base sm:text-lg uppercase">PLEDGE FOR PEACE</span>
                </button>
              </div>
            </div>
          </section>


          <section id="launch" className="fourth gap-12 sm:gap-16 tracking-wider font-bebas w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-10 items-center lg:items-start">
              <h1 className="section-title subscribe-title text-center lg:text-left text-3xl sm:text-4xl lg:text-5xl">
                <span>AND WE'RE LAUNCHING </span>
                <span className="highlight"> SOON</span>
              </h1>
              <div className="align-middle">
                <MinimalCountdown targetDate={new Date("2025-09-25T00:00:00")}/>
              </div>
            </div>
            <div className="flex flex-row justify-start mt-6 sm:mt-8 w-full">
              <p className="section3-paragraph text-center sm:text-left text-sm sm:text-base lg:text-lg w-[80%] sm:w-auto sm:max-w-4xl leading-relaxed mx-auto">
                SUBSCRIBE TO OUR WEEKLY NEWSLETTER
                TO RECEIVE PROGRESS UPDATES,
                PEACE STATISTICS AND AN INVITATION 
                TO SYNC YOUR DEMAND FOR PEACE ONCE WE'LL LAUNCH.
              </p>
            </div>
            <div className="flex flex-row justify-around mt-6 sm:mt-8">
              <NewsletterSignup />
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </SonarProvider>
  );
};