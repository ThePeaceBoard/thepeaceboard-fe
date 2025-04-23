'use client';
import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import MobileNavBar from './MobileNavBar';
import DesktopNavBar from './DesktopNavBar';

interface NavBarProps {
  setProjectionType: (type: 'globe' | 'mercator') => void;
  setActiveMapType: (type: 'peace' | 'heat') => void;
  projectionType: 'globe' | 'mercator';
  activeMapType: 'peace' | 'heat';
}

const NavBar: React.FC<NavBarProps> = ({
  setProjectionType,
  setActiveMapType,
  projectionType,
  activeMapType
}) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Reset state on unmount to prevent stale references
      setIsMobile(false);
    };
  }, []);

  return isMobile ? (
    <MobileNavBar />
  ) : (
    <DesktopNavBar 
      isAuthenticated={isAuthenticated}
      loginWithRedirect={loginWithRedirect}
      setProjectionType={setProjectionType}
      setActiveMapType={setActiveMapType}
      projectionType={projectionType}
      activeMapType={activeMapType}
    />
  );
};

export default NavBar; 