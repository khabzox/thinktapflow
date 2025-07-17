import { Metadata } from "next";

// Default metadata for the app
export const defaultMetadata: Metadata = {
  title: "ThinkTapFlow | AI-Powered Content Creation",
  description:
    "ThinkTapFlow is a modern SaaS platform for automated, AI-powered content generation across multiple social media channels. Built with Next.js 14, Supabase, and Google Generative AI.",
  metadataBase: new URL("https://www.thinktapflow.com"),
  openGraph: {
    title: "ThinkTapFlow | AI-Powered Content Creation",
    description:
      "Generate high-quality content for social media using AI. ThinkTapFlow helps creators, marketers, and businesses automate their content strategy with ease.",
    url: "https://thinktapflow.com",
    siteName: "ThinkTapFlow",
    images: [
      {
        url: "/logo/readme.png",
        width: 1200,
        height: 630,
        alt: "ThinkTapFlow Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThinkTapFlow | AI-Powered Content Creation",
    description:
      "Automate your social media content with AI. Build, preview, and publish posts using Supabase, Next.js 14, and Google AI.",
    images: ["/logo/readme.png"],
    // creator: "@yourhandle",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Page metadata for all routes
export const pageMetadata: Record<string, Metadata> = {
  "terms-of-service": {
    title: "Terms of Service | ThinkTapFlow",
    description: "Read the terms and conditions for using ThinkTapFlow.",
  },
  "privacy-policy": {
    title: "Privacy Policy | ThinkTapFlow",
    description: "Understand how ThinkTapFlow collects, uses, and protects your personal data.",
  },
  dashboard: {
    title: "Dashboard | ThinkTapFlow",
    description: "Your personalized space for managing AI-generated content.",
  },
  settings: {
    title: "Settings | ThinkTapFlow",
    description: "Update your account settings, preferences, and profile details.",
  },
  library: {
    title: "Content Library | ThinkTapFlow",
    description: "Access and manage all your previously generated content.",
  },
  generations: {
    title: "Your Generations | ThinkTapFlow",
    description: "Browse and refine your AI-generated content history.",
  },
  generate: {
    title: "Generate Content | ThinkTapFlow",
    description: "Use AI to create new and engaging content for your brand.",
  },
  community: {
    title: "Community | ThinkTapFlow",
    description: "Connect with other creators and explore trending content.",
  },
  analytics: {
    title: "Analytics | ThinkTapFlow",
    description: "Track content performance and optimize your social media strategy.",
  },
  signup: {
    title: "Sign Up | ThinkTapFlow",
    description: "Create your free ThinkTapFlow account to get started.",
  },
  login: {
    title: "Login | ThinkTapFlow",
    description: "Access your ThinkTapFlow dashboard and tools.",
  },
  "verify-email": {
    title: "Verify Email | ThinkTapFlow",
    description: "Confirm your email address to activate your ThinkTapFlow account.",
  },
  auth: {
    title: "Auth | ThinkTapFlow",
    description: "Authentication flow for ThinkTapFlow users.",
  },
};

// Simple routes object
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  GENERATE: "/dashboard/generate",
  LIBRARY: "/dashboard/library",
  GENERATIONS: "/dashboard/generations",
  ANALYTICS: "/dashboard/analytics",
  SETTINGS: "/dashboard/settings",
  COMMUNITY: "/dashboard/community",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  VERIFY_EMAIL: "/auth/verify-email",
  AUTH: "/auth",
  TERMS: "/terms-of-service",
  PRIVACY: "/privacy-policy",
};

// App configuration
export const APP_CONFIG = {
  name: "ThinkTapFlow",
  description: "AI-Powered Content Creation Platform",
  url: "https://www.thinktapflow.com",
};
