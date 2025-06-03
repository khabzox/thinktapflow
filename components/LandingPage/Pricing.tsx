"use client";
import CheckIcon from "/public/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    title: "Starter",
    monthlyPrice: 0,
    buttonText: "Start Creating Free",
    popular: false,
    inverse: false,
    features: [
      "5,000 AI-generated words/month",
      "10+ content templates",
      "Basic grammar & style checks",
      "Standard content export (PDF, TXT)",
      "Email support",
      "Personal use only",
    ],
  },
  {
    title: "Professional",
    monthlyPrice: 29,
    buttonText: "Upgrade to Pro",
    popular: true,
    inverse: true,
    features: [
      "50,000 AI-generated words/month",
      "50+ premium templates",
      "Advanced AI content optimization",
      "Multi-format export (PDF, DOCX, HTML)",
      "SEO content analysis",
      "Priority email support",
      "Commercial usage rights",
      "Team collaboration (up to 3 users)",
      "Content plagiarism checker",
      "Brand voice customization",
    ],
  },
  {
    title: "Enterprise",
    monthlyPrice: 99,
    buttonText: "Contact Sales",
    popular: false,
    inverse: false,
    features: [
      "Unlimited AI-generated words",
      "100+ enterprise templates",
      "Custom AI model training",
      "Advanced analytics & reporting",
      "White-label solution",
      "Dedicated account manager",
      "24/7 phone & chat support",
      "Unlimited team members",
      "Advanced integrations (API access)",
      "Custom content workflows",
      "Enterprise security & compliance",
      "Priority feature requests",
    ],
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Choose Your Content Creation Plan</h2>
          <p className="section-des mt-5">
            Start free and scale as you grow. Unlock powerful AI content generation, 
            advanced features, and premium support with our flexible pricing options.
          </p>
        </div>

        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {pricingTiers.map(({ title, monthlyPrice, buttonText, popular, features, inverse }) => (
            <div
              key={title}
              className={twMerge(
                "p-10 rounded-3xl border border-[#F1F1F1] shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full",
                inverse === true && "border-black bg-black text-white"
              )}
            >
              <div className="flex justify-between">
                <h3 className={twMerge("text-lg font-bold text-black/50", inverse && "text-white/60")}>
                  {title}
                </h3>
                {popular && (
                  <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                    <motion.span
                      animate={{
                        backgroundPositionX: "-100%",
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                      }}
                      className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-medium"
                    >
                      Most Popular
                    </motion.span>
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-[30px]">
                <span className="text-4xl font-bold tracking-tighter leading-none">${monthlyPrice}</span>
                <span className={twMerge("tracking-tight font-bold text-black/50", inverse && "text-white/50")}>
                  {monthlyPrice === 0 ? "/forever" : "/month"}
                </span>
              </div>
              <button
                className={twMerge("btn btn-primary w-full mt-[30px]", inverse && "bg-white text-black")}
              >
                {buttonText}
              </button>
              <ul className="flex flex-col gap-5 mt-8">
                {features.map((feature) => (
                  <li key={feature} className="text-sm flex items-center gap-4">
                    <CheckIcon className="h-6 w-6" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            All plans include our core AI content generation engine and regular updates.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 14-day money-back guarantee</span>
            <span>✓ Secure payment processing</span>
          </div>
        </div>
      </div>
    </section>
  );
};