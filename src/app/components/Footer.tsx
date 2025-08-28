import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPatreon, 
  faDiscord, 
  faTwitter,
  faInstagram,
  faLinkedin,
  faGithub,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col lg:grid lg:grid-cols-3 items-center lg:justify-items-center font-bebas bg-white w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 border-t border-gray-200 gap-6 lg:gap-0">
      {/* Left Section - Support */}
      <div className="flex flex-col items-center lg:items-start w-full">
        <div className="flex gap-2 flex-col sm:flex-row sm:items-end mb-3 text-center lg:text-left">
          <span className="text-black font-bold text-base sm:text-lg leading-none">
            SUPPORT US 
          </span>
          <span className="text-gray-600 text-sm sm:text-base leading-none">
            BY HELPING FUND THIS PROJECT
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
          {/* Buy Me Coffee */}
          <div className="w-full max-w-xs">
            <a 
              href="https://www.buymeacoffee.com/saharbarak" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="buymecoffee-button block w-full h-10 sm:h-11 flex items-center justify-center rounded-lg" 
              style={{backgroundColor: '#FADD4B'}}
            >
              <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{height: '32px', width: 'auto'}} className="sm:h-[36px]" />
            </a>
          </div>

          {/* BeActive */}
          <div className="w-full max-w-xs">
            <a
              href="https://beactive.co.il/project/86508"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full h-10 sm:h-11 hover:shadow-2xl transition-all cursor-pointer duration-300 flex items-center justify-center rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl px-6"
            >
              <img 
                src="/beactive-logo.svg" 
                alt="BeActive" 
                width="100%" 
                style={{userSelect: 'none', display: 'flex', maxHeight: '48px'}}
                className="w-full h-auto max-h-12"
              />
            </a>
          </div>

          {/* Patreon */}
          <div className="w-full max-w-xs">
            <a
              href="https://www.patreon.com/bePatron?u=111653068"
              target="_blank"
              rel="noopener noreferrer"
              className="patreon-button w-full h-10 sm:h-11 inline-flex items-center justify-center rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <FontAwesomeIcon icon={faPatreon} className="text-2xl text-white" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Center Section - Logo */}
      <div className="text-center relative lg:order-none order-first lg:order-none lg:w-1/3 flex flex-col items-center justify-center">
        <img
          src="/logo-footer.svg"
          alt="The Peace Board"
          className="h-10 sm:h-12 w-auto mx-auto"
        />
        {/* Attribution */}
        <p className="text-gray-500 text-xs mt-2 opacity-70 font-light font-outfit">
          Designed and developed by{' '}
          <a 
            href="https://www.saharbarak.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 font-light font-outfit"
          >
            Sahar Barak
          </a>
        </p>
      </div> 

      {/* Right Section - Social & Journey */}
      <div className="flex flex-col items-center lg:items-end w-full">
        <div className="flex gap-2 flex-col sm:flex-row sm:items-end mb-3 text-center lg:text-right">
          <span className="text-black font-bold text-base sm:text-lg order-1 leading-none">
            JOIN US ON THE JOURNEY
          </span>
          <span className="text-gray-600 text-sm sm:text-base order-2 leading-none">
            A PEOPLE-FIRST FREE WORLD
          </span>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center lg:justify-end">
          <a
            href="https://discord.gg/peace"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon discord-icon w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faDiscord} className="text-sm sm:text-base"/>
          </a>

          <a
            href="https://twitter.com/thepeaceboard"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon twitter-icon w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faTwitter} className="text-sm sm:text-base"/>
          </a>

          <a
            href="https://instagram.com/thepeaceboard"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon instagram-icon w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-sm sm:text-base"/>
          </a>

          <a
            href="https://linkedin.com/company/thepeaceboard"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon linkedin-icon w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faLinkedin} className="text-sm sm:text-base"/>
          </a>

          <a
            href="https://github.com/thepeaceboard"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon github-icon w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faGithub} className="text-sm sm:text-base"/>
          </a>

          <a
            href="https://tiktok.com/@thepeaceboard"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon tiktok-icon w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faTiktok} className="text-sm sm:text-base"/>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 