"use client";
import acmeLogo from "/public/assets/logo-acme.png";
import quantamLogo from "/public/assets/logo-quantum.png";
import echoLogo from "/public/assets/logo-echo.png";
import celestialLogo from "/public/assets/logo-celestial.png";
import pulseLogo from "/public/assets/logo-pulse.png";
import apexLogo from "/public/assets/logo-apex.png";
import { motion } from "framer-motion";
import Image from "next/image";

export const LogoTicker = () => {
  return (
    <div className="py-8 md:py-12 bg-white">
      <div className="container">
        <div
          className="flex overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black, transparent)" }}
        >
          <motion.div
            className="flex gap-14 flex-none pr-14"
            animate={{
              translateX: "-50%",
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            <Image src={acmeLogo} alt="Acme logo" className="logo-ticker-image" />
            <Image src={quantamLogo} alt="quantam logo" className="logo-ticker-image" />
            <Image src={echoLogo} alt="Echo logo" className="logo-ticker-image" />
            <Image src={celestialLogo} alt="celestial logo" className="logo-ticker-image" />
            <Image src={pulseLogo} alt="Pulse logo" className="logo-ticker-image" />
            <Image src={apexLogo} alt="Apex logo" className="logo-ticker-image" />

            <Image src={acmeLogo} alt="Acme logo" className="logo-ticker-image" />
            <Image src={quantamLogo} alt="quantam logo" className="logo-ticker-image" />
            <Image src={echoLogo} alt="Echo logo" className="logo-ticker-image" />
            <Image src={celestialLogo} alt="celestial logo" className="logo-ticker-image" />
            <Image src={pulseLogo} alt="Pulse logo" className="logo-ticker-image" />
            <Image src={apexLogo} alt="Apex logo" className="logo-ticker-image" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
