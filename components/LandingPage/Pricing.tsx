"use client";
import CheckIcon from "/public/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    title: "Free",
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
    title: "Pro",
    monthlyPrice: 19,
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
    title: "Plus",
    monthlyPrice: 79,
    buttonText: "Get in Touch",
    popular: false,
    inverse: false,
    features: [
      "Unlimited AI-generated words",
      "100+ premium templates",
      "Custom AI model tuning",
      "Advanced analytics & reporting",
      "Brand white-labeling",
      "Dedicated support manager",
      "24/7 priority support",
      "Unlimited team members",
      "API access & integrations",
      "Custom content workflows",
      "Enterprise-grade security",
      "Priority roadmap features",
    ],
  },
];

export const Pricing = () => {
  return (
    <section className="bg-white py-24">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Choose Your Content Creation Plan</h2>
          <p className="section-des mt-5">
            Start free and scale as you grow. Unlock powerful AI content generation, advanced
            features, and premium support with our flexible pricing options.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-center">
          {pricingTiers.map(({ title, monthlyPrice, buttonText, popular, features, inverse }) => (
            <div
              key={title}
              className={twMerge(
                "w-full max-w-xs rounded-3xl border border-[#F1F1F1] p-10 shadow-[0_7px_14px_#EAEAEA]",
                inverse === true && "border-black bg-black text-white",
              )}
            >
              <div className="flex justify-between">
                <h3
                  className={twMerge("text-lg font-bold text-black/50", inverse && "text-white/60")}
                >
                  {title}
                </h3>
                {popular && (
                  <div className="inline-flex rounded-xl border border-white/20 px-4 py-1.5 text-sm">
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
                      className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] bg-clip-text font-medium text-transparent [background-size:200%]"
                    >
                      Most Popular
                    </motion.span>
                  </div>
                )}
              </div>
              <div className="mt-[30px] flex items-baseline gap-1">
                <span className="text-4xl font-bold leading-none tracking-tighter">
                  ${monthlyPrice}
                </span>
                <span
                  className={twMerge(
                    "font-bold tracking-tight text-black/50",
                    inverse && "text-white/50",
                  )}
                >
                  {monthlyPrice === 0 ? "/forever" : "/month"}
                </span>
              </div>
              <button
                className={twMerge(
                  "btn btn-primary mt-[30px] w-full",
                  inverse && "bg-white text-black",
                )}
              >
                {buttonText}
              </button>
              <ul className="mt-8 flex flex-col gap-5">
                {features.map(feature => (
                  <li key={feature} className="flex items-center gap-4 text-sm">
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
          <p className="mb-6 text-gray-600">
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
