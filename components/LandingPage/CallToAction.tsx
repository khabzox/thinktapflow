"use client";
import ArrowRight from "/public/assets/arrow-right.svg";
import starImage from "/public/assets/star.png";
import springImage from "/public/assets/spring.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PrimaryBtn, SecondaryBtn } from "../common/btn";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="overflow-x-clip bg-gradient-to-b from-white to-[#D2DCFF] py-24"
    >
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title">Start creating amazing content today</h2>
          <p className="section-des mt-5">
            Join thousands of content creators, marketers, and businesses who trust ContentGen AI to
            produce high-quality content in minutes, not hours. No credit card required.
          </p>

          <motion.img
            src={starImage.src}
            alt="star image"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
            style={{
              translateY,
            }}
          />
          <motion.img
            src={springImage.src}
            alt="spring image"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{
              translateY,
            }}
          />
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <PrimaryBtn href={"/dashboard"} textContent={"Start Creating Free"} />
          <SecondaryBtn
            href={"/dashboard"}
            textContent={"View Demo"}
            icon={<ArrowRight className="h-5 w-5" />}
          />
        </div>

        {/* Additional value props */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>5,000 free words monthly</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Setup in under 2 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};
