'use client';
import cogImage from '/public/assets/cog.png';
import cylinderImage from '/public/assets/cylinder.png';
import noodleImage from '/public/assets/noodle.png';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { PrimaryBtn, SecondaryBtn } from '@/components/common/btn';
import { ArrowRight, Play } from 'lucide-react';

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start'],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const router = useRouter();

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-20 md:pt-5 md:pb-10 overflow-x-clip bg-gradient-to-br from-primary via-primary-light to-secondary"
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="text-sm inline-flex border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full tracking-tight text-white shadow-lg">
              ✨ Transform Your Content Strategy
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white via-white to-white/80 text-transparent bg-clip-text mt-6 drop-shadow-lg">
              Pathway to productivity
            </h1>
            <p className="text-xl text-white/90 tracking-tight mt-6 drop-shadow-md">
              Turn one piece of content into engaging posts for all your social platforms. Save
              time, reach more people, and grow your audience with AI-powered content
              transformation.
            </p>
            <div className="flex gap-4 items-center mt-8">
              <PrimaryBtn 
                href={"/dashboard"} 
                textContent={"Start Creating"} 
                icon={<ArrowRight size={18} />}
                className="bg-white text-primary hover:bg-white/90 shadow-xl"
              />
              <SecondaryBtn 
                href={"/dashboard"} 
                textContent={"Watch Demo"} 
                icon={<Play size={18} />}
                className="border-white/30 text-white hover:bg-white/10"
              />
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <motion.img
              src={cogImage.src}
              alt="Cog"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 3,
                ease: 'easeInOut',
              }}
            />
            <motion.img
              src={cylinderImage.src}
              width={220}
              height={220}
              alt="Cylinder image"
              className="hidden md:block -top-8 -left-32 md:absolute"
              style={{
                translateY: translateY,
              }}
            />
            <motion.img
              src={noodleImage.src}
              width={220}
              alt="Noodle image"
              className="hidden lg:block top-[524px] left-[448px] absolute rotate-[30deg]"
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
