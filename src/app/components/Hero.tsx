'use client';

import React, {useState, useRef, useEffect, useMemo } from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Typography } from "@mui/material";
import StatsBar from "./StatsBar";
import RadioPlayer from "./radio-bar";
type LineContent = React.ReactElement | string;

const topLines: LineContent[] = [
  <>
  <span style={{ color: "#E28A4B" }}>We Are</span>{" "}
  <span style={{ color: "#111111", fontWeight:"800" }}>Not</span>
</>,
<>
  <span style={{ color: "#E28A4B" }}>For</span>
  <span className="gov-fontsize" style={{ color: "#111111", fontWeight:"700" }}> Governments</span>
</>,
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
      <span style={{ color: "#3B3A3C", fontWeight:"700" }}>Now.</span>
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
  

    return (
        <div className="flex first-section gap-5 flex-col space-y-10 justify-around">            
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
          <div ref={containerRef} className="flex flex-row justify-start space-x-6 font-bebas tracking-wider">
            <a ref={voteNowButtonRef} href="#how-it-works" className="content-center regular-button">
              <span ref={voteNowSpotlightRef} className="regular-button__spotlight"></span>
              <span className="regular-button__wrapper">
                <span className="regular-button__text">Sync For Peace Now</span>
              </span>
            </a>
            <a ref={decenteralizedButtonRef} href="#how-it-works" className="content-center regular-button-defi">
              <span ref={decentralizedSpotlightRef} className="regular-button-defi__spotlight"></span>
              <span className="regular-button-defi__wrapper">
                <span className="regular-button-defi__text">Decentralized Version <span className="ml-1">→</span></span>
              </span>
            </a>
          </div>
          <div className="absolute justify-end flex flex-row padding-bottom-toolbar space-x-4 w-full">
            <div className="arrow-container">
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
    );
};

const HeroMobile: React.FC<HeroProps> = ({signedCount, countriesCount, watchingCount}) => {
    const containerRef = useRef<HTMLDivElement>(null);
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
          .to({}, { duration: 4 }) // Hold for 2 seconds
          .to(".top-line", { y: 400 }) // Exit below container
          .to(".bottom-line", { y: 400 }, "<"); // Exit below container
      });
    }, []);
    return( 
      <div className="flex">
        <div ref={containerRef}>
            <Typography
                variant="h1"
                sx={{
                fontWeight: 800,
                lineHeight: "1.1",
                letterSpacing: "0%",
                fontFamily: "Stick No Bills",
                textTransform: "uppercase",
                textShadow: "0px 9px 4px rgba(0, 0, 0, 0.25)",
                color: "#e5e5e5",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                wordWrap: "break-word",
                minWidth: "100%",
              }}
            >
                <div className="bounding-box">
                    <div className="top-line w-full text-left headline-size pl-5 pr-5">
                        {topLine}
                    </div>
                </div>
                <div className="bounding-box">
                    <div className="bottom-line text-right headline-size pl-5 pr-5 pb-5">
                        {bottomLine}
                    </div>
                </div>
            </Typography>
        </div>
        <div id="bottom-row" className="block">
            <div className="arrow-contain absolute bottom-5 left-3">
                <button className="arrow">
                    <ArrowDownwardIcon />
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