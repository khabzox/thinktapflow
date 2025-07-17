"use client";

import xLogo from "/public/assets/logo-x.png";
import linkedinLogo from "/public/assets/logo-linkedin.png";
import instagramLogo from "/public/assets/logo-instagram.png";
import facebookLogo from "/public/assets/logo-facebook.png";
import youtubeLogo from "/public/assets/logo-ytb.png";
import threadLogo from "/public/assets/logo-threads.png";
import { motion } from "framer-motion";
import Image from "next/image";

const logos = [
  { src: xLogo, alt: "Twitter/X" },
  { src: linkedinLogo, alt: "LinkedIn" },
  { src: instagramLogo, alt: "Instagram" },
  { src: facebookLogo, alt: "Facebook" },
  { src: youtubeLogo, alt: "YouTube" },
  { src: threadLogo, alt: "Threads" },
];

export const LogoTicker = () => {
  return (
    <div className="bg-white py-8 md:py-12">
      <div className="container">
        <div
          className="flex overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black, transparent)" }}
        >
          <motion.div
            className="flex flex-none items-center gap-14 pr-14"
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
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className="flex h-20 w-20 shrink-0 items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  className={`max-h-full max-w-full object-contain grayscale filter ${logo.alt === "Twitter/X" ? "p-5" : ""}`}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
