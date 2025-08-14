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
    <footer className="flex flex-col lg:flex-row items-center lg:justify-between font-bebas bg-white w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 border-t border-gray-200 gap-6 lg:gap-0">
      {/* Left Section - Support */}
      <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
        <div className="flex gap-2 flex-col sm:flex-row sm:items-end mb-3 text-center lg:text-left">
          <span className="text-black font-bold text-base sm:text-lg leading-none">
            SUPPORT US 
          </span>
          <span className="text-gray-600 text-sm sm:text-base leading-none">
            BY HELPING FUND THIS PROJECT
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
          {/* Buy Me Coffee */}
          <div className="w-40 sm:w-48 max-w-full">
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

          {/* Kickstarter */}
          <div className="kickstarter-button-wrapper w-40 sm:w-48 h-10 sm:h-11 flex items-center justify-center cursor-pointer max-w-full">
            <svg width="120" height="14" viewBox="0 0 181 20" xmlns="http://www.w3.org/2000/svg" aria-label="Kickstarter" className="sm:w-[140px] sm:h-4">
              <title>Kickstarter</title>
              <path fill="#05ce78" fillRule="evenodd" clipRule="evenodd" d="M16.9257 15.2442C16.9257 14.3321 16.6731 13.4527 16.1362 12.6709L14.1153 9.77192L16.1362 6.87291C16.6731 6.12373 16.9257 5.21169 16.9257 4.29964C16.9257 1.88924 14.9994 0.0325731 12.7258 0.0325731C11.3996 0.0325731 10.0733 0.716607 9.25228 1.88924L8.24179 3.32245C7.86286 1.40064 6.2524 0 4.19984 0C1.83151 0 0 1.95438 0 4.36479V15.2768C0 17.6872 1.86309 19.6416 4.19984 19.6416C6.22082 19.6416 7.79971 18.3386 8.21022 16.4494L9.09439 17.7523C9.91541 18.9901 11.2733 19.6416 12.5995 19.6416C14.9994 19.6741 16.9257 17.6546 16.9257 15.2442ZM18.1794 4.6984C18.1794 2.15344 20.2063 0 22.7399 0C25.2735 0 27.3004 2.15344 27.2688 4.6984V14.9435C27.2688 17.4885 25.2735 19.6419 22.7082 19.6419C20.2063 19.6419 18.1794 17.5211 18.1794 14.9435V4.6984ZM44.8219 14.2437C44.8219 12.1624 43.8247 10.699 41.8304 9.82097C43.8247 8.94294 44.8219 7.51207 44.8219 5.39828C44.8219 2.24386 42.2979 0 38.247 0C32.825 0 28.8365 4.19505 28.8365 9.82097C28.8365 15.4469 32.825 19.6419 38.247 19.6419C42.2979 19.6419 44.8219 17.3981 44.8219 14.2437ZM62.5236 12.6709C63.0614 13.4527 63.3145 14.3321 63.3145 15.2442C63.3145 17.6546 61.3846 19.6741 59.0119 19.6416C57.6831 19.6416 56.3228 18.9901 55.5002 17.7523L54.6144 16.4494C54.2031 18.3386 52.6213 19.6416 50.5965 19.6416C48.2554 19.6416 46.3888 17.6872 46.3888 15.2768V4.36479C46.3888 1.95438 48.2237 0 50.5965 0C52.6529 0 54.2664 1.40064 54.646 3.32245L55.6268 1.88924C56.4493 0.716607 57.7781 0.0325731 59.1068 0.0325731C61.3846 0.0325731 63.3145 1.88924 63.3145 4.29964C63.3145 5.21169 63.0614 6.12373 62.5236 6.87291L60.4988 9.77192L62.5236 12.6709ZM79.3001 13.5975C79.3001 11.6269 78.3578 10.2474 76.9444 8.93364L75.7822 7.84978C77.4783 7.58702 78.6091 6.40463 78.6091 4.55017C78.6091 2.19313 76.379 0 71.6676 0C67.0504 0 64.3493 2.43048 64.3493 6.27325C64.3493 8.24391 65.3229 9.59052 66.7364 10.9371L67.8671 12.021H67.8357C65.7313 12.021 64.255 13.3019 64.255 15.3054C64.255 18.1957 66.5793 19.9693 71.542 19.9693C76.4104 19.9693 79.3001 17.506 79.3001 13.5975ZM103.096 16.2274C104.166 18.5363 105.675 19.6419 107.531 19.6419C110.865 19.6419 113.224 16.4875 111.777 12.9429L107.908 3.57717C106.965 1.26827 105.55 0 103.128 0C100.738 0 99.3222 1.26827 98.3472 3.57717L94.4787 12.9429C93.0005 16.4875 95.3908 19.6419 98.6932 19.6419C100.517 19.6419 102.027 18.5363 103.096 16.2274ZM113.465 5.2049C113.465 1.99671 115.107 0.327148 118.045 0.327148H123.509C126.826 0.327148 129.416 2.94607 129.416 6.31794C129.416 8.15119 128.69 9.65707 127.489 10.6064L129.132 13.3236C130.038 14.0438 130.227 14.8295 130.227 15.6479C130.227 18.0704 128.395 19.9691 126.09 19.9691C124.668 19.9691 123.278 19.2162 122.489 17.8412L122.046 17.0228C121.509 18.7578 120.025 19.9691 118.13 19.9691C115.36 19.9691 113.465 17.9394 113.465 15.4842V5.2049ZM138.32 19.9691C140.922 19.9691 142.865 17.9722 142.865 15.5497V8.77318C144.965 8.67498 146.689 6.84173 146.689 4.55017C146.689 2.19313 144.871 0.327148 142.646 0.327148H134.12C131.895 0.327148 130.077 2.1604 130.077 4.55017C130.077 6.84173 131.801 8.64224 133.901 8.77318V15.5497C133.901 17.9722 135.875 19.9691 138.32 19.9691ZM159.934 12.5742C161.522 12.9043 162.675 14.3238 162.675 16.2054C162.675 18.3181 161.055 20.0016 159.093 19.9686H152.552C149.562 19.9686 147.943 18.3181 147.943 15.083V5.21276C147.943 2.0107 149.562 0.327148 152.552 0.327148H159.093C161.055 0.327148 162.675 2.0107 162.675 4.1234C162.675 6.03803 161.553 7.42449 159.934 7.75459C160.681 8.24976 161.086 9.07503 161.086 10.1644C161.086 11.2537 160.65 12.079 159.934 12.5742ZM168.13 19.9691C165.824 19.9691 163.929 17.9394 163.929 15.4842V5.2049C163.929 1.99671 165.54 0.327148 168.509 0.327148H173.973C177.29 0.327148 179.88 2.94607 179.88 6.31794C179.88 8.15119 179.153 9.65707 177.953 10.6064L179.596 13.3236C180.038 14.0438 180.227 14.8295 180.227 15.6479C180.227 18.0704 178.395 19.9691 176.09 19.9691C174.668 19.9691 173.278 19.2162 172.489 17.8412L172.046 17.0228C171.509 18.7578 170.025 19.9691 168.13 19.9691ZM92.0807 15.5497C92.0807 17.9722 90.1023 19.9691 87.5587 19.9691C85.1092 19.9691 83.1308 17.9722 83.1308 15.5497V8.77318C81.0268 8.64224 79.2997 6.84173 79.2997 4.55017C79.2997 2.1604 81.121 0.327148 83.3507 0.327148H91.8609C94.0905 0.327148 95.9119 2.19313 95.9119 4.55017C95.9119 6.84173 94.1847 8.67498 92.0807 8.77318V15.5497Z"></path>
            </svg>
          </div>

          {/* Patreon */}
          <div className="w-40 sm:w-48 max-w-full">
            <a
              href="https://www.patreon.com/bePatron?u=111653068"
              target="_blank"
              rel="noopener noreferrer"
              className="patreon-button w-full h-10 sm:h-11 inline-flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPatreon} className="text-white text-lg sm:text-xl"/>
            </a>
          </div>
        </div>
      </div>
      
      {/* Center Section - Logo */}
      <div className="text-center relative lg:order-none order-first lg:order-none">
        <img
          src="/logo-footer.svg"
          alt="The Peace Board"
          className="h-10 sm:h-12 w-auto mx-auto"
        />
      </div> 

      {/* Right Section - Social & Journey */}
      <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
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