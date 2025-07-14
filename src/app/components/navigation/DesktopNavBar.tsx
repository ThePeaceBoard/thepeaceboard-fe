'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot, faGlobe, faEarthAmericas, faPeace, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { 
  faInstagram, 
  faFacebook, 
  faDiscord, 
  faXTwitter, 
  faLinkedin, 
  faGithub,
  faPatreon
} from '@fortawesome/free-brands-svg-icons';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import '../../globals.css';
import '../../styles/ComingSoon.css';
import '../../styles/Navbar.css';
import { cn } from "@/lib/utils";

interface DesktopNavBarProps {
  isAuthenticated: boolean;
  loginWithRedirect: () => void;
  setProjectionType: (type: 'globe' | 'mercator') => void;
  setActiveMapType: (type: 'peace' | 'heat') => void;
  projectionType: 'globe' | 'mercator';
  activeMapType: 'peace' | 'heat';
}

const DesktopNavBar: React.FC<DesktopNavBarProps> = ({ isAuthenticated, loginWithRedirect, setProjectionType, setActiveMapType, projectionType, activeMapType }) => {
  const logoRef = useRef<HTMLDivElement>(null);
  
  const handleVoteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      window.location.href = '/vote';
    } else {
      loginWithRedirect();
    }
  };

  useEffect(() => {
    const updateScrollAnimation = () => {
      if (logoRef.current) {
        const scrollY = window.scrollY;
        const opacity = Math.max(0, 1 - scrollY / 100);
        logoRef.current.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', updateScrollAnimation);

    return () => {
      window.removeEventListener('scroll', updateScrollAnimation);
    };
  }, []);

  const toggleProjection = () => {
    setProjectionType(projectionType === 'globe' ? 'mercator' : 'globe');
  };

  const toggleMapMode = () => {
    setActiveMapType(activeMapType === 'heat' ? 'peace' : 'heat');
  };

  return (
    <div className="fixed w-full top-0 left-0 right-0 z-50 font-navbar z-max">
      <header className="relative w-full">
        <nav className="flex items-center p-4 padding-header">
          {/* Left side - Logo */}
          <div className="flex justify-start items-center mr-auto">
            <div ref={logoRef} className="flex-col justify-start relative">
              <img
                src="/logo-header.svg"
                alt="The Peace Board"
                className="h-12 w-auto"
              />
            </div>
          </div>
          
          {/* Right side - Navigation Menu */}
          <div className="flex items-center space-x-6 ml-auto">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="tracking-wide grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              The Peace Board
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Civilian Driven World Peace, Now. Join the movement to promote peace globally.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/vote" title="Vote for Peace">
                        Add your voice to the global peace movement and make a difference.
                      </ListItem>
                      <ListItem href="/statistics" title="Statistics Dashboard">
                        View real-time data on peace pledges and global participation.
                      </ListItem>
                      <ListItem href="/feedback" title="Feedback">
                        We're just starting! Submit any feedback you have to help us improve.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Community Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Community</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="tracking-wide grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem 
                        href="https://instagram.com" 
                        title="Instagram"
                      >
                        <FontAwesomeIcon icon={faInstagram} className="mr-2 text-pink-500" />
                        Follow our journey and community stories on Instagram.
                      </ListItem>
                      <ListItem 
                        href="https://facebook.com" 
                        title="Facebook"
                      >
                        <FontAwesomeIcon icon={faFacebook} className="mr-2 text-blue-500" />
                        Join our Facebook community for updates and discussions.
                      </ListItem>
                      <ListItem 
                        href="https://discord.com" 
                        title="Discord"
                      >
                        <FontAwesomeIcon icon={faDiscord} className="mr-2 text-indigo-500" />
                        Chat with fellow peace advocates on our Discord server.
                      </ListItem>
                      <ListItem 
                        href="https://twitter.com" 
                        title="X"
                      >
                        <FontAwesomeIcon icon={faXTwitter} className="mr-2 text-gray-700" />
                        Follow us on X for the latest news and announcements.
                      </ListItem>
                      <ListItem 
                        href="https://linkedin.com" 
                        title="LinkedIn"
                      >
                        <FontAwesomeIcon icon={faLinkedin} className="mr-2 text-blue-700" />
                        Connect with us professionally on LinkedIn.
                      </ListItem>
                      <ListItem 
                        href="https://github.com/sync-organization" 
                        title="GitHub"
                      >
                        <FontAwesomeIcon icon={faGithub} className="mr-2 text-gray-900" />
                        Explore our open-source projects and contribute on GitHub.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* About Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="tracking-wider">About</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="tracking-wide grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem href="/about" title="About Us">
                        Learn about our mission, vision, and the team behind The Peace Board.
                      </ListItem>
                      <ListItem href="/how-it-works" title="How It Works">
                        Understand the technology and process behind our peace initiative.
                      </ListItem>
                      <ListItem href="/roadmap" title="Roadmap">
                        See our plans for the future and upcoming milestones.
                      </ListItem>
                      <ListItem 
                        href="https://www.patreon.com/thepeaceboard" 
                        title="Patreon"
                      >
                        <FontAwesomeIcon icon={faPatreon} className="mr-2 text-black" />
                        Support our ongoing development and mission on Patreon.
                      </ListItem>
                      <ListItem 
                        href="https://www.buymeacoffee.com/thepeaceboard" 
                        title="Buy Me A Coffee"
                      >
                        <FontAwesomeIcon icon={faMugHot} className="mr-2 text-yellow-500" />
                        Buy us a coffee to fuel our peace initiatives.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Coming Soon</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
                      <ListItem href="/coming-soon" title="V1 Features (Coming Soon)">
                        We're working on exciting new features for our V1 release. Stay tuned!
                      </ListItem>
                      <li className="col-span-1">
                        <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors">
                          <div className="text-sm font-medium leading-none">Upcoming Features</div>
                          <ul className="mt-2 text-sm text-muted-foreground">
                            <li className="py-1 opacity-50">Enhanced Peace Map (Disabled)</li>
                            <li className="py-1 opacity-50">Community Forums (Disabled)</li>
                            <li className="py-1 opacity-50">Peace Initiatives (Disabled)</li>
                            <li className="py-1 opacity-50">Global Events (Disabled)</li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
      </header>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: React.ReactNode }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
});
ListItem.displayName = "ListItem";

export default DesktopNavBar; 