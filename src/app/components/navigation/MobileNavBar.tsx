'use client';
import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { 
  faInstagram, 
  faLinkedin, 
  faDiscord, 
  faTiktok, 
  faXTwitter, 
  faGithub 
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
  const [isOpen, setIsOpen] = useState(false);
  const [menuIcon, setMenuIcon] = useState(faBars);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);

  const toggleMenu = () => {
    if (!isOpen) {
      setMenuIcon(faTimes);
      openTlRef.current?.restart();
    } else {
      setMenuIcon(faBars);
      closeTlRef.current?.restart();
    }
    setIsOpen(!isOpen);
  };

  useGSAP(() => {
    const openTl = gsap.timeline({ paused: true });
    openTl
      .set(menuContainerRef.current, { scaleX: 0, transformOrigin: "left top" })
      .to(menuContainerRef.current, {
        duration: 0.2,
        scaleX: 1,
        y: "100%",
        ease: "power2.inOut",
      })
      .from(
        menuContainerRef.current?.querySelectorAll("nav > a") || [],
        {
          duration: 0.3,
          autoAlpha: 0,
          x: 80,
          stagger: 0.6,
          ease: "power4.inOut",
        },
        "-=0.1"
      );

    const closeTl = gsap.timeline({ paused: true });
    closeTl
      .to(menuContainerRef.current?.querySelectorAll("nav > a") || [], {
        duration: 0.1,
        autoAlpha: 0,
        x: 0,
        stagger: 0.2,
        ease: "power4.inOut",
      })
      .to(menuContainerRef.current, {
        duration: 0.2,
        scaleX: 0,
        y: "100%",
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
    };
  }, { scope: containerRef });

  return (
    <div className="fixed top-0 left-0 w-screen z-[9999]">
      <div ref={containerRef} className='w-full'>
        <div
          ref={menuContainerRef}
          className="menu-container"
          style={{
            transform: "scaleX(0)", // Hidden initially
            transformOrigin: "left", // Ensure the scale effect starts from the left
            overflow: "hidden",
          }}
        >
          <nav>
            <a href="#" className="menu-item">How It Works</a>
            <a href="#" className="menu-item">About Us</a>
            <a href="#" className="menu-item">Support Us</a>
            <a href="#" className="menu-item adaptive-radius min-w-64 p-10 border border-white text-center self-center">Statistics</a>
            <a id="icons" className="flex place-self-center space-x-4">
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
            </a>
          </nav>
        </div>

        <header 
          ref={navRef}
          className="w-full flex flex-row flex-wrap justify-between font-navbar"
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <div className="flex flex-row gap-2 content-center justify-start items-center p-4" >
            <i className="menu-btn" id="trigger-overlay">
              <FontAwesomeIcon
              className="menu-btn" 
              onClick={toggleMenu} // <-- attach the function here 
              icon={menuIcon} 
              style={{ color: "#3B3A3C", height:'24px', width:'24px' }} 
              />
            </i>
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
              className="w-8 h-8 mr-2"
              style={{ display: "block" }}
            />
            <a href="#sync" className="content-center">
              <span className="bg-transparent">
                <span className="button-font-size dark-text">Log In</span>
              </span>
            </a>
          </div>
        </header>
      </div>
    </div>
  );
};

export default MobileNavBar; 