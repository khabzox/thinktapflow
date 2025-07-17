export const CONTENT_TEMPLATES = [
  {
    id: "template_1",
    title: "Product Launch",
    description: "Announce your new product or feature across platforms",
    platforms: ["twitter", "linkedin", "facebook"] as string[],
    category: "marketing",
    isFavorite: true,
  },
  {
    id: "template_2",
    title: "Weekly Newsletter",
    description: "Curate content for your weekly newsletter",
    platforms: ["email"] as string[],
    category: "newsletter",
    isFavorite: false,
  },
  {
    id: "template_3",
    title: "Promotional Campaign",
    description: "Create a multi-platform promotional campaign",
    platforms: ["instagram", "facebook", "twitter"] as string[],
    category: "marketing",
    isFavorite: true,
  },
  {
    id: "template_4",
    title: "Blog Post",
    description: "Generate a blog post with SEO optimization",
    platforms: ["blog"] as string[],
    category: "content",
    isFavorite: false,
  },
  {
    id: "template_5",
    title: "Customer Testimonial",
    description: "Highlight customer testimonials for social media",
    platforms: ["instagram", "linkedin", "facebook"] as string[],
    category: "social",
    isFavorite: false,
  },
  {
    id: "template_6",
    title: "Event Promotion",
    description: "Promote your upcoming event across platforms",
    platforms: ["twitter", "linkedin", "facebook", "email"] as string[],
    category: "marketing",
    isFavorite: false,
  },
];

export const TEMPLATE_CATEGORIES = {
  MARKETING: "marketing",
  NEWSLETTER: "newsletter",
  CONTENT: "content",
  SOCIAL: "social",
} as const;

export const getTemplatesByCategory = (category: string) => {
  return CONTENT_TEMPLATES.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return CONTENT_TEMPLATES.find(template => template.id === id);
};
