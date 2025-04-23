"use client"

import { Globe as LucideGlobe, Waves, Maximize2, Minimize2, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export const ActivityIcon = Waves
export const FullscreenIcon = Maximize2
export const ExitFullscreenIcon = Minimize2
export const BackIcon = ArrowLeft

export const PeaceIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2L12 22" />
    <path d="M12 12L7 17" />
    <path d="M12 12L17 17" />
  </svg>
)

export const MapIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
)

interface ProjectionIconProps {
  isGlobe?: boolean;
  className?: string;
}

export const ProjectionIcon = ({ isGlobe = true, className }: ProjectionIconProps) => (
  <div className="relative w-5 h-5">
    <div className={cn(
      "absolute inset-0 transition-all duration-300",
      isGlobe ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
    )}>
      <MapIcon className={className} />
    </div>
    <div className={cn(
      "absolute inset-0 transition-all duration-300",
      !isGlobe ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
    )}>
      <LucideGlobe className={className} />
    </div>
  </div>
) 