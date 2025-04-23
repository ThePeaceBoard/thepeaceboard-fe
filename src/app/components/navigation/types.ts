import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { SxProps, Theme } from '@mui/material';

export interface NavBarProps {}

export interface MobileNavBarProps {}

export interface DesktopNavBarProps {
  isAuthenticated: boolean;
  loginWithRedirect: (options?: any) => Promise<void>;
}

export interface ButtonRefs {
  button: React.RefObject<HTMLAnchorElement>;
  spotlight: React.RefObject<HTMLSpanElement>;
}

export interface StyleProps {
  iconButtonStyles: SxProps<Theme>;
  iconStyles: {
    color: string;
    fontSize: string;
  };
}

export interface SocialIcon {
  icon: IconDefinition;
  href: string;
} 