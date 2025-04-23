'use client';
import React, { useRef, useEffect } from "react";
import { IconButton } from "@mui/material";
import { faInstagram, faLinkedin, faDiscord, faTiktok, faXTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/SplashScreen.css';

interface SplashScreenProps {
  totalPledges: number;
  activeUsers: number;
  onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ totalPledges, activeUsers, onAnimationComplete }) => {
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<HTMLSpanElement[]>([]);
  
  const iconButtonStyles = {
    backgroundColor: "rgba(226, 138, 75, 0.05)",
    borderRadius: "50%",
    border: "1.542px solid rgba(226, 138, 75, 0.38)",
    width: "37px",
    height: "37px",
    display: "flex",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(226, 138, 75, 0.2)",
      boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)",
      transform: "translateY(-4px)",
    },
  };
  
  const iconStyles = {
    color: "#E28A4B",
    fontSize: "14px",
  };

  useEffect(() => {
    const intro = introRef.current;
    const spans = spansRef.current;

    spans.forEach((span, idx) => {
      setTimeout(() => {
        span?.classList.add('active');
      }, (idx + 1) * 400);
    });

    setTimeout(() => {
      spans.forEach((span, idx) => {
        setTimeout(() => {
          span?.classList.remove('active');
          span?.classList.add('fade');
        }, (idx + 1) * 50);
      });
    }, 2000);

    setTimeout(() => {
      if (intro) {
        intro.style.top = '-100vh';
        setTimeout(() => {
          onAnimationComplete();
        }, 300);
      }
    }, 2300);
  }, [onAnimationComplete]);

  return (
    <div className="intro scene will-change-auto" ref={introRef}>
      <h1 className="font-logo-intro logo-header-intro" ref={logoRef}>
        <span
          className="logo slider"
          ref={(el) => {
            if (el) spansRef.current[0] = el;
          }}
          style={{ display: 'initial', color: 'white' }}
        >
          THE PEACE BOARD
        </span>
        <span
          className="logo font-sublogo-intro"
          ref={(el) => {
            if (el) spansRef.current[1] = el;
          }}
          style={{ display: 'initial', color: 'white' }}
        >
          BY <span className="brand-text-color">SYNC</span>
        </span>
      </h1>

      <div id="icons" className="social-media-icons-intro flex place-self-center space-x-2">
        <b className="slider guest n6">
          <IconButton
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener"
            sx={iconButtonStyles}
          >
            <FontAwesomeIcon icon={faInstagram} style={iconStyles} />
          </IconButton>
        </b>
        <b className="slider guest n5">
          <IconButton
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noopener"
            sx={iconButtonStyles}
          >
            <FontAwesomeIcon icon={faTiktok} style={iconStyles} />
          </IconButton>
        </b>
        <b className="slider guest n4">
          <IconButton
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener"
            sx={iconButtonStyles}
          >
            <FontAwesomeIcon icon={faLinkedin} style={iconStyles} />
          </IconButton>
        </b>
        <b className="slider guest n3">
          <IconButton
            href="https://discord.com/"
            target="_blank"
            rel="noopener"
            sx={iconButtonStyles}
          >
            <FontAwesomeIcon icon={faDiscord} style={iconStyles} />
          </IconButton>
        </b>
        <b className="slider guest n2">
          <IconButton
            href="https://twitter.com/"
            target="_blank"
            rel="noopener"
            sx={iconButtonStyles}
          >
            <FontAwesomeIcon icon={faXTwitter} style={iconStyles} />
          </IconButton>
        </b>
        <b className="slider guest n1">
          <IconButton
            href="https://github.com/"
            target="_blank"
            rel="noopener"
            sx={iconButtonStyles}
          >
            <FontAwesomeIcon icon={faGithub} style={iconStyles} />
          </IconButton>
        </b>
      </div>

      <div className="flex flex-col live-data-container -mt-8 gap-4">
        <div className="flex flex-row place-content-end">
          <span className="data-headline slider" style={{ color: "#FFE262"}}>LIVE</span>
        </div>
        <div className="flex flex-row gap-6">
          <div className="data-box slider flex flex-col items-center px-8 py-4 border border-white rounded-lg">
            <div className="flex flex-row gap-3">
              <img
                src="/PeaceIcon.svg"
                alt="Peace Icon"
                className="mb-4"
                style={{ width: "22px" }}
              />
              <span className="data-headline" style={{ color: "#FFE262"}}>PEOPLE DEMANDED PEACE</span>
            </div>
            <div className="text-white data-headline">{totalPledges.toLocaleString()}</div>
          </div>
    
          <div className="data-box slider flex flex-col items-center px-8 py-4 border border-white rounded-lg">
            <div className="flex flex-row gap-3">
              <img
                src="/EyeIcon.svg"
                alt="Watcher Icon"
                className="mb-4"
                style={{ width: "24px" }}
              />
              <span className="data-headline" style={{ color: "#FFE262"}}>PEOPLE WATCHING NOW</span>
            </div>
            <div className="text-white data-headline">{activeUsers}</div>
          </div>
        </div>
      </div>       
    </div>
  );
};

export default SplashScreen;