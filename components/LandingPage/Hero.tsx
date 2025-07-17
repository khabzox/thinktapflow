"use client";
import cogImage from "/public/assets/cog.png";
import cylinderImage from "/public/assets/cylinder.png";
import noodleImage from "/public/assets/noodle.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { PrimaryBtn, SecondaryBtn } from "@/components/common/btn";
import { ArrowRight, Play } from "lucide-react";

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const router = useRouter();

  return (
    <section
      ref={heroRef}
      className="overflow-x-clip bg-gradient-to-br from-primary via-primary-light to-secondary pb-20 pt-8 md:pb-10 md:pt-5"
    >
      <div className="container">
        <div className="items-center md:flex">
          <div className="md:w-[478px]">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm tracking-tight text-white shadow-lg backdrop-blur-sm">
              ✨ Transform Your Content Strategy
            </div>
            <h1 className="mt-6 bg-gradient-to-b from-white via-white to-white/80 bg-clip-text text-5xl font-bold tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              Pathway to productivity
            </h1>
            <p className="mt-6 text-xl tracking-tight text-white/90 drop-shadow-md">
              Turn one piece of content into engaging posts for all your social platforms. Save
              time, reach more people, and grow your audience with AI-powered content
              transformation.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <PrimaryBtn
                href={"/dashboard"}
                textContent={"Start Creating"}
                icon={<ArrowRight size={18} />}
                className="bg-white text-primary shadow-xl hover:bg-white/90"
              />
              <SecondaryBtn
                href={"/dashboard"}
                textContent={"Watch Demo"}
                icon={<Play size={18} />}
                className="border-white/30 text-white hover:bg-white/10"
              />
            </div>
          </div>
          <div className="relative mt-20 md:mt-0 md:h-[648px] md:flex-1">
            <motion.img
              src={cogImage.src}
              alt="Cog"
              className="md:absolute md:-left-6 md:h-full md:w-auto md:max-w-none lg:left-0"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src={cylinderImage.src}
              width={220}
              height={220}
              alt="Cylinder image"
              className="-left-32 -top-8 hidden md:absolute md:block"
              style={{
                translateY: translateY,
              }}
            />
            <motion.img
              src={noodleImage.src}
              width={220}
              alt="Noodle image"
              className="absolute left-[448px] top-[524px] hidden rotate-[30deg] lg:block"
              style={{
                rotate: 30,
                translateY: translateY,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
