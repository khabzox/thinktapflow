'use client';
import ArrowRight from '/public/assets/arrow-right.svg';
import starImage from '/public/assets/star.png';
import springImage from '/public/assets/spring.png';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-x-clip"
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

        <div className="flex gap-2 mt-10 justify-center">
          <button className="btn btn-primary">Start Creating Free</button>
          <button className="btn btn-text gap-1">
            <span>View Demo</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Additional value props */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600">
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
