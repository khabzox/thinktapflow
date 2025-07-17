export const SOCIAL_PLATFORMS = {
  TWITTER: {
    id: "twitter",
    name: "Twitter",
    icon: "🐦",
    limit: 280,
    color: "#1DA1F2",
    rateLimit: {
      perHour: 300,
      perDay: 2400,
    },
  },
  LINKEDIN: {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    limit: 3000,
    color: "#0077B5",
    rateLimit: {
      perHour: 100,
      perDay: 500,
    },
  },
  FACEBOOK: {
    id: "facebook",
    name: "Facebook",
    icon: "📘",
    limit: 2000,
    color: "#4267B2",
    rateLimit: {
      perHour: 200,
      perDay: 1000,
    },
  },
  INSTAGRAM: {
    id: "instagram",
    name: "Instagram",
    icon: "📸",
    limit: 2200,
    color: "#E1306C",
    rateLimit: {
      perHour: 25,
      perDay: 200,
    },
  },
  TIKTOK: {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    limit: 150,
    color: "#000000",
    rateLimit: {
      perHour: 300,
      perDay: 1000,
    },
  },
  YOUTUBE: {
    id: "youtube",
    name: "YouTube",
    icon: "📺",
    limit: 5000,
    color: "#FF0000",
    rateLimit: {
      perHour: 50,
      perDay: 200,
    },
  },
} as const;

export const PLATFORMS_ARRAY = Object.values(SOCIAL_PLATFORMS);

export const getPlatformById = (id: string) => {
  return PLATFORMS_ARRAY.find(platform => platform.id === id);
};

export const getPlatformsByIds = (ids: string[]) => {
  return PLATFORMS_ARRAY.filter(platform => ids.includes(platform.id));
};
