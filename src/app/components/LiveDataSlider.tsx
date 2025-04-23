import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from 'next/image';
import { useGlobalStore } from "../store/useGlobalStore";

interface LiveDataSliderProps {
}

const LiveDataSlider: React.FC<LiveDataSliderProps> = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const activeUsers = useGlobalStore(state => state.activeUsers);
  const totalPledges = useGlobalStore(state => state.totalPledges);
  
  useEffect(() => {
    const sliderElement = sliderRef.current;

    if (sliderElement) {
      gsap.fromTo(
        sliderElement,
        { x: "-100%", opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 1.5, 
          delay: 3,
          ease: "elastic.out(1, 0.3)"
        }
      );
    }
  }, []);

  return (
    <div
      ref={sliderRef}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#111111",
        borderRadius: "25px",
        padding: "10px 20px",
        color: "white",
        fontFamily: "Bebas Neue, sans-serif",
        width: "fit-content",
      }}
    >
      <span className="pr-2" style={{ color: "#FFD700" }}>LIVE</span>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span role="img" aria-label="peace">
          <Image src="/PeaceIcon.svg" alt="Peace" width={20} height={20} />
        </span>
        <span style={{ color: "#BEBEBE" }}>{totalPledges.toLocaleString()}</span>
         
        <span role="img" aria-label="viewers">
          <Image src="/EyeIcon.svg" alt="Viewers" width={20} height={20} />
        </span>
        <span style={{ color: "#BEBEBE" }}>{activeUsers}</span>
      </div>
    </div>
  );
};

export default LiveDataSlider; 