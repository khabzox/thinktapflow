"use client";
import productImage from "/public/assets/product-image.png";
import pyramidImage from "/public/assets/pyramid.png";
import tubeImage from "/public/assets/tube.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="overflow-x-clip bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-[540px]">
          <div className="flex justify-center">
            <div className="tag">AI-Powered Content Generation</div>
          </div>

          <h2 className="mt-5 bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-center text-3xl font-bold tracking-tighter text-transparent md:text-[54px] md:leading-[60px]">
            Transform One Post Into Many
          </h2>
          <p className="section-des mt-5">
            Turn your best content into engaging posts for multiple social platforms in seconds.
            Save hours of work with AI-powered content adaptation and optimization.
          </p>
        </div>

        <div className="relative">
          <Image src={productImage} alt="Product image" className="mt-10" />
          <motion.img
            src={pyramidImage.src}
            alt="Pyramid image"
            height={262}
            width={262}
            className="absolute -right-36 -top-32 hidden md:block"
            style={{
              translateY: translateY,
            }}
          />
          <motion.img
            src={tubeImage.src}
            alt="Tube image"
            height={248}
            width={248}
            className="absolute -left-36 bottom-24 hidden md:block"
            style={{
              translateY: translateY,
            }}
          />
        </div>
      </div>
    </section>
  );
};
