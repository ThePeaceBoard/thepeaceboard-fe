"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faFacebook,
  faDiscord,
  faXTwitter,
  faLinkedin,
  faGithub,
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

const DesktopNavBar: React.FC<DesktopNavBarProps> = ({
  isAuthenticated: _isAuthenticated,
  loginWithRedirect: _loginWithRedirect,
  setProjectionType: _setProjectionType,
  setActiveMapType: _setActiveMapType,
  projectionType: _projectionType,
  activeMapType: _activeMapType,
}) => {
  const logoRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="fixed w-full top-0 left-0 right-0 z-9999 font-navbar z-max">
      <header className="relative w-full">
        <nav className="flex items-center p-4 padding-header">
          {/* Left side - Logo */}
            <div className="flex justify-start items-center mr-auto">
              <div ref={logoRef} className="flex-col justify-start relative">
                <Link href="/">
                  <motion.img
                    src="/logo-header.svg"
                    alt="The Peace Board"
                    className="h-12 w-auto cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  />
                </Link>
              </div>
            </div>
          
          {/* Right side - Navigation Menu */}
          <div className="flex items-center space-x-6 ml-auto">
            <NavigationMenu>
              <NavigationMenuList>

                {/* Community Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Community</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="tracking-wide grid w-[300px] gap-4 p-6 md:w-[350px] md:grid-cols-3 lg:w-[400px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                        href="https://instagram.com" 
                            className="block select-none rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-center"
                          >
                            <FontAwesomeIcon icon={faInstagram} className="text-2xl text-pink-500 mb-2" />
                            <div className="text-sm font-medium leading-none">Instagram</div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                        href="https://facebook.com" 
                            className="block select-none rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-center"
                          >
                            <FontAwesomeIcon icon={faFacebook} className="text-2xl text-blue-500 mb-2" />
                            <div className="text-sm font-medium leading-none">Facebook</div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                        href="https://discord.com" 
                            className="block select-none rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-center"
                          >
                            <FontAwesomeIcon icon={faDiscord} className="text-2xl text-indigo-500 mb-2" />
                            <div className="text-sm font-medium leading-none">Discord</div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                        href="https://twitter.com" 
                            className="block select-none rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-center"
                          >
                            <FontAwesomeIcon icon={faXTwitter} className="text-2xl text-gray-700 mb-2" />
                            <div className="text-sm font-medium leading-none">X</div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                        href="https://linkedin.com" 
                            className="block select-none rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-center"
                          >
                            <FontAwesomeIcon icon={faLinkedin} className="text-2xl text-blue-700 mb-2" />
                            <div className="text-sm font-medium leading-none">LinkedIn</div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                        href="https://github.com/sync-organization" 
                            className="block select-none rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-center"
                          >
                            <FontAwesomeIcon icon={faGithub} className="text-2xl text-gray-900 mb-2" />
                            <div className="text-sm font-medium leading-none">GitHub</div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* About Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="tracking-wider">About</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="tracking-wide grid w-[300px] gap-3 p-4 md:w-[350px] md:grid-cols-1 lg:w-[400px]">
                      <li>
                        <a
                          href="/#join"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/#join';
                          }}
                        >
                          <div className="text-sm font-medium leading-none">Join Us</div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                            Join the movement and pledge for peace.
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/#sync"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/#sync';
                          }}
                        >
                          <div className="text-sm font-medium leading-none">We Are Sync</div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                            Learn about our global democracy movement.
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/#world-peace"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/#world-peace';
                          }}
                        >
                          <div className="text-sm font-medium leading-none">World Peace</div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                            Our peer-to-peer peaceboard approach.
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/#sync-token"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/#sync-token';
                          }}
                        >
                          <div className="text-sm font-medium leading-none">Sync Token</div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                            Token economics and civilian power.
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/#launch"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/#launch';
                          }}
                        >
                          <div className="text-sm font-medium leading-none">Launch</div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                            Coming soon - subscribe for updates.
                          </div>
                        </a>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Support Us Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <a
                      href="/supportus"
                      className={cn(navigationMenuTriggerStyle(), "px-4 py-2")}
                    >
                      Support Us
                    </a>
                  </NavigationMenuLink>
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
>(({ className, title, children, href, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          href={href}
          onClick={handleClick}
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