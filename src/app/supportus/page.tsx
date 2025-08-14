"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPatreon } from "@fortawesome/free-brands-svg-icons";
import "../styles/ComingSoon.css";
import NavBar from "../components/navigation/NavBar";

const SupportUsPage: React.FC = () => {
  const [activeMapType, setActiveMapType] = useState<"peace" | "heat">("peace");
  const [projectionType, setProjectionType] = useState<"globe" | "mercator">(
    "mercator"
  );

  // Animation variants for smooth entrance
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="w-screen min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Subtle background accents and gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-500/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
      
      {/* Floating accent elements */}
      <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="hidden sm:block absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="hidden sm:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl"></div>

      {/* Header same as Coming Soon (NavBar) */}
      <NavBar
        setProjectionType={setProjectionType}
        setActiveMapType={setActiveMapType}
        projectionType={projectionType}
        activeMapType={activeMapType}
      />

      {/* Content */}
      <section className="second flex-1 w-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16 relative z-10">
        <motion.div 
          className="max-w-5xl text-center space-y-6 sm:space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="support-header font-bebas leading-9 uppercase tracking-widest text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
            variants={itemVariants}
          >
            Support The Peace Board
          </motion.h1>
          
          <motion.p 
            className="support-subheader font-outfit text-neutral-200 text-lg sm:text-xl md:text-2xl max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            I’m a solo developer expanding this project. If you believe in a civilian‑driven, people‑first future and want to help accelerate the mission, you can support me here.
          </motion.p>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-10 items-start"
            variants={itemVariants}
          >
            {/* Buy Me A Coffee */}
            <motion.div 
              className="flex flex-col items-center space-y-4"
              variants={ctaVariants}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-full max-w-xs h-14 sm:w-60 sm:h-16 mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25">
                <a
                  href="https://www.buymeacoffee.com/saharbarak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buymecoffee-button w-full h-full flex items-center justify-center rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  style={{ backgroundColor: "#FADD4B" }}
                >
                  <img
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                    alt="Buy Me A Coffee"
                    style={{ height: "44px", width: "auto" }}
                    className="sm:h-[48px]"
                  />
                </a>
              </div>
              <div className="text-center">
                <h3 className="font-bebas text-xl text-white mb-1">Quick Support</h3>
                <p className="font-outfit text-sm text-neutral-400 max-w-56 mx-auto">
                  Buy us a coffee and fuel our mission
                </p>
              </div>
            </motion.div>

            {/* Kickstarter */}
            <motion.div 
              className="flex flex-col items-center space-y-4"
              variants={ctaVariants}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-full max-w-xs h-14 sm:w-60 sm:h-16 mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/25">
                <a
                  href="https://www.kickstarter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kickstarter-button-wrapper w-full h-full flex items-center justify-center mx-auto rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <svg
                    width="160"
                    height="20"
                    viewBox="0 0 181 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Kickstarter"
                    className="transition-transform duration-300 hover:scale-110"
                  >
                    <title>Kickstarter</title>
                    <path
                      fill="#05ce78"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.9257 15.2442C16.9257 14.3321 16.6731 13.4527 16.1362 12.6709L14.1153 9.77192L16.1362 6.87291C16.6731 6.12373 16.9257 5.21169 16.9257 4.29964C16.9257 1.88924 14.9994 0.0325731 12.7258 0.0325731C11.3996 0.0325731 10.0733 0.716607 9.25228 1.88924L8.24179 3.32245C7.86286 1.40064 6.2524 0 4.19984 0C1.83151 0 0 1.95438 0 4.36479V15.2768C0 17.6872 1.86309 19.6416 4.19984 19.6416C6.22082 19.6416 7.79971 18.3386 8.21022 16.4494L9.09439 17.7523C9.91541 18.9901 11.2733 19.6416 12.5995 19.6416C14.9994 19.6741 16.9257 17.6546 16.9257 15.2442ZM18.1794 4.6984C18.1794 2.15344 20.2063 0 22.7399 0C25.2735 0 27.3004 2.15344 27.2688 4.6984V14.9435C27.2688 17.4885 25.2735 19.6419 22.7082 19.6419C20.2063 19.6419 18.1794 17.5211 18.1794 14.9435V4.6984ZM44.8219 14.2437C44.8219 12.1624 43.8247 10.699 41.8304 9.82097C43.8247 8.94294 44.8219 7.51207 44.8219 5.39828C44.8219 2.24386 42.2979 0 38.247 0C32.825 0 28.8365 4.19505 28.8365 9.82097C28.8365 15.4469 32.825 19.6419 38.247 19.6419C42.2979 19.6419 44.8219 17.3981 44.8219 14.2437ZM62.5236 12.6709C63.0614 13.4527 63.3145 14.3321 63.3145 15.2442C63.3145 17.6546 61.3846 19.6741 59.0119 19.6416C57.6831 19.6416 56.3228 18.9901 55.5002 17.7523L54.6144 16.4494C54.2031 18.3386 52.6213 19.6416 50.5965 19.6416C48.2554 19.6416 46.3888 17.6872 46.3888 15.2768V4.36479C46.3888 1.95438 48.2237 0 50.5965 0C52.6529 0 54.2664 1.40064 54.646 3.32245L55.6268 1.88924C56.4493 0.716607 57.7781 0.0325731 59.1068 0.0325731C61.3846 0.0325731 63.3145 1.88924 63.3145 4.29964C63.3145 5.21169 63.0614 6.12373 62.5236 6.87291L60.4988 9.77192L62.5236 12.6709ZM79.3001 13.5975C79.3001 11.6269 78.3578 10.2474 76.9444 8.93364L75.7822 7.84978C77.4783 7.58702 78.6091 6.40463 78.6091 4.55017C78.6091 2.19313 76.379 0 71.6676 0C67.0504 0 64.3493 2.43048 64.3493 6.27325C64.3493 8.24391 65.3229 9.59052 66.7364 10.9371L67.8671 12.021H67.8357C65.7313 12.021 64.255 13.3019 64.255 15.3054C64.255 18.1957 66.5793 19.9693 71.542 19.9693C76.4104 19.9693 79.3001 17.506 79.3001 13.5975ZM103.096 16.2274C104.166 18.5363 105.675 19.6419 107.531 19.6419C110.865 19.6419 113.224 16.4875 111.777 12.9429L107.908 3.57717C106.965 1.26827 105.55 0 103.128 0C100.738 0 99.3222 1.26827 98.3472 3.57717L94.4787 12.9429C93.0005 16.4875 95.3908 19.6419 98.6932 19.6419C100.517 19.6419 102.027 18.5363 103.096 16.2274ZM113.465 5.2049C113.465 1.99671 115.107 0.327148 118.045 0.327148H123.509C126.826 0.327148 129.416 2.94607 129.416 6.31794C129.416 8.15119 128.69 9.65707 127.489 10.6064L129.132 13.3236C130.038 14.0438 130.227 14.8295 130.227 15.6479C130.227 18.0704 128.395 19.9691 126.09 19.9691C124.668 19.9691 123.278 19.2162 122.489 17.8412L122.046 17.0228C121.509 18.7578 120.025 19.9691 118.13 19.9691C115.36 19.9691 113.465 17.9394 113.465 15.4842V5.2049ZM138.32 19.9691C140.922 19.9691 142.865 17.9722 142.865 15.5497V8.77318C144.965 8.67498 146.689 6.84173 146.689 4.55017C146.689 2.19313 144.871 0.327148 142.646 0.327148H134.12C131.895 0.327148 130.077 2.1604 130.077 4.55017C130.077 6.84173 131.801 8.64224 133.901 8.77318V15.5497C133.901 17.9722 135.875 19.9691 138.32 19.9691ZM159.934 12.5742C161.522 12.9043 162.675 14.3238 162.675 16.2054C162.675 18.3181 161.055 20.0016 159.093 19.9686H152.552C149.562 19.9686 147.943 18.3181 147.943 15.083V5.21276C147.943 2.0107 149.562 0.327148 152.552 0.327148H159.093C161.055 0.327148 162.675 2.0107 162.675 4.1234C162.675 6.03803 161.553 7.42449 159.934 7.75459C160.681 8.24976 161.086 9.07503 161.086 10.1644C161.086 11.2537 160.65 12.079 159.934 12.5742ZM168.13 19.9691C165.824 19.9691 163.929 17.9394 163.929 15.4842V5.2049C163.929 1.99671 165.54 0.327148 168.509 0.327148H173.973C177.29 0.327148 179.88 2.94607 179.88 6.31794C179.88 8.15119 179.153 9.65707 177.953 10.6064L179.596 13.3236C180.038 14.0438 180.227 14.8295 180.227 15.6479C180.227 18.0704 178.395 19.9691 176.09 19.9691C174.668 19.9691 173.278 19.2162 172.489 17.8412L172.046 17.0228C171.509 18.7578 170.025 19.9691 168.13 19.9691ZM92.0807 15.5497C92.0807 17.9722 90.1023 19.9691 87.5587 19.9691C85.1092 19.9691 83.1308 17.9722 83.1308 15.5497V8.77318C81.0268 8.64224 79.2997 6.84173 79.2997 4.55017C79.2997 2.1604 81.121 0.327148 83.3507 0.327148H91.8609C94.0905 0.327148 95.9119 2.19313 95.9119 4.55017C95.9119 6.84173 94.1847 8.67498 92.0807 8.77318V15.5497Z"
                    ></path>
                  </svg>
                </a>
              </div>
              <div className="text-center">
                <h3 className="font-bebas text-xl text-white mb-1">Crowdfunding</h3>
                <p className="font-outfit text-sm text-neutral-400 max-w-56 mx-auto">
                  Join our Kickstarter campaign for major projects
                </p>
              </div>
            </motion.div>

            {/* Patreon */}
            <motion.div 
              className="flex flex-col items-center space-y-4"
              variants={ctaVariants}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-full max-w-xs h-14 sm:w-60 sm:h-16 mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-400/25">
                <a
                  href="https://www.patreon.com/bePatron?u=111653068"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="patreon-button w-full h-full inline-flex items-center justify-center rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faPatreon} className="text-2xl text-white" />
                </a>
              </div>
              <div className="text-center">
                <h3 className="font-bebas text-xl text-white mb-1">Monthly Support</h3>
                <p className="font-outfit text-sm text-neutral-400 max-w-56 mx-auto">
                  Become a patron with recurring monthly support
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Additional call to action */}
          <motion.div 
            className="mt-14 text-center"
            variants={itemVariants}
          >
            <p className="font-outfit text-neutral-300 text-base sm:text-lg max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
              Every contribution—no matter how small—helps build a people‑first, peaceful world.
              <span className="text-blue-300 font-semibold"> Thank you for believing in the mission.</span>
            </p>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
};

export default SupportUsPage;
 