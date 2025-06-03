'use client';
import avatar1 from '/public/assets/avatar-1.png';
import avatar2 from '/public/assets/avatar-2.png';
import avatar3 from '/public/assets/avatar-3.png';
import avatar4 from '/public/assets/avatar-4.png';
import avatar5 from '/public/assets/avatar-5.png';
import avatar6 from '/public/assets/avatar-6.png';
import avatar7 from '/public/assets/avatar-7.png';
import avatar8 from '/public/assets/avatar-8.png';
import avatar9 from '/public/assets/avatar-9.png';
import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const testimonials = [
  {
    text: 'ThinkTapFlow AI has revolutionized my content creation process. What used to take me hours now takes minutes, and the quality is consistently impressive.',
    imageSrc: avatar1.src,
    name: 'Sarah Chen',
    username: '@sarahcontentpro',
  },
  {
    text: 'As a marketing manager, I needed to scale our content output. ThinkTapFlow AI helped us increase our blog production by 300% while maintaining quality.',
    imageSrc: avatar2.src,
    name: 'Marcus Rodriguez',
    username: '@marcusmarketing',
  },
  {
    text: "The AI understands my brand voice perfectly. It's like having a skilled copywriter who never gets tired and always delivers on-brand content.",
    imageSrc: avatar3.src,
    name: 'Emily Watson',
    username: '@emilywrites',
  },
  {
    text: 'I was skeptical about AI writing tools, but ThinkTapFlow AI completely changed my mind. The content is creative, engaging, and surprisingly human-like.',
    imageSrc: avatar4.src,
    name: 'James Liu',
    username: '@jamescopywriter',
  },
  {
    text: 'Running a content agency, efficiency is everything. ThinkTapFlow AI allows us to serve more clients without compromising quality or burning out our team.',
    imageSrc: avatar5.src,
    name: 'Alexandra Thompson',
    username: '@alexagency',
  },
  {
    text: 'The SEO optimization features are game-changing. My blog posts now rank higher and drive more organic traffic than ever before.',
    imageSrc: avatar6.src,
    name: 'David Park',
    username: '@davidseo',
  },
  {
    text: "From social media posts to email campaigns, ThinkTapFlow AI handles all our content needs. It's like having an entire content team in one platform.",
    imageSrc: avatar7.src,
    name: 'Rachel Green',
    username: '@racheldigital',
  },
  {
    text: 'The variety of templates and customization options is incredible. I can create everything from technical documentation to creative storytelling.',
    imageSrc: avatar8.src,
    name: 'Michael Foster',
    username: '@mikefostertech',
  },
  {
    text: "ThinkTapFlow AI helped me overcome writer's block permanently. Even when I'm stuck, the AI provides inspiration and gets my creativity flowing again.",
    imageSrc: avatar9.src,
    name: 'Lisa Anderson',
    username: '@lisacreative',
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: '-50%',
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, imageSrc, name, username }) => (
                <div className="card" key={username}>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <Image
                      width={40}
                      height={40}
                      src={imageSrc}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 tracking-tight">{username}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export const Testimonials = () => {
  return (
    <section className="bg-white">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Success Stories</div>
          </div>
          <h2 className="section-title mt-5">Loved by content creators worldwide</h2>
          <p className="section-des mt-5">
            From solo entrepreneurs to enterprise teams, thousands of creators trust ThinkTapFlow AI
            to produce high-quality, engaging content that drives results.
          </p>
        </div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
