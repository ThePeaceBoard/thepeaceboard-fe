'use client';
import { Bebas_Neue, Open_Sans, Stick_No_Bills, Inter, Noto_Sans, Outfit  } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { Auth0Provider } from '@auth0/auth0-react';
import { SocketProvider } from './contexts/SocketContext';
import '@/app/globals.css'
import { cn } from '@/lib/utils';
import { SonarProvider } from './components/sonar-provider';

config.autoAddCss = false

const inter = Inter({ 
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const stickNoBills = Stick_No_Bills({
  variable: "--font-stick-no-bills",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "The Peace Board",
//   description: "Civilian Driven World Peace, Now.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "animated-page scene",
          bebasNeue.variable,
          openSans.variable,
          stickNoBills.variable,
          inter.variable,
          notoSans.variable,
          outfit.variable
        )}
        suppressHydrationWarning={true}
      >
        <Auth0Provider
          domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
          clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
          authorizationParams={{
            redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI!,
          }}
          onRedirectCallback={(appState) => {
            window.history.replaceState(
              {},
              document.title,
              appState?.targetUrl || window.location.pathname
            );
          }}
        >
          <SocketProvider>
            <SonarProvider>
              {children}
            </SonarProvider>
          </SocketProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
