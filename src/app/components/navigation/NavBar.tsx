'use client';
import React from 'react';
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

  // Render both; Tailwind controls visibility. This avoids DOM tree swaps during resize.
  return (
    <>
      <div className="md:hidden">
        <MobileNavBar />
      </div>
      <div className="hidden md:block">
        <DesktopNavBar
          isAuthenticated={isAuthenticated}
          loginWithRedirect={loginWithRedirect}
          setProjectionType={setProjectionType}
          setActiveMapType={setActiveMapType}
          projectionType={projectionType}
          activeMapType={activeMapType}
        />
      </div>
    </>
  );
};

export default NavBar; 