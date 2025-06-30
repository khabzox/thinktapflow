import { PLATFORMS_ARRAY, getPlatformById } from '@/constants/platforms';

export interface Post {
  id: string;
  platform: string;
  platformId: string;
  icon: string;
  content: string;
  characterCount: number;
  limit: number;
  hashtags: string[];
  createdAt: string;
}

export interface GenerationData {
  content: string;
  selectedPlatforms: string[];
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  tone?: string;
  contentType?: string;
}

export const validatePost = (post: Partial<Post>): boolean => {
  if (!post.content || !post.platform) return false;
  
  const platform = getPlatformById(post.platform);
  if (!platform) return false;
  
  const characterCount = post.content.length;
  return characterCount <= platform.limit;
};

export const createPost = (
  platform: string,
  content: string,
  hashtags: string[] = []
): Post | null => {
  const platformData = getPlatformById(platform);
  if (!platformData) return null;

  return {
    id: generateId(),
    platform: platformData.name,
    platformId: platformData.id,
    icon: platformData.icon,
    content,
    characterCount: content.length,
    limit: platformData.limit,
    hashtags,
    createdAt: new Date().toISOString()
  };
};

export const formatHashtags = (hashtags: string[]): string => {
  return hashtags
    .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    .join(' ');
};

export const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#\w+/g;
  return content.match(hashtagRegex) || [];
};

export const getCharacterCount = (content: string): number => {
  return content.length;
};

export const isWithinLimit = (content: string, platformId: string): boolean => {
  const platform = getPlatformById(platformId);
  if (!platform) return false;
  return content.length <= platform.limit;
};

export const truncateContent = (content: string, platformId: string): string => {
  const platform = getPlatformById(platformId);
  if (!platform) return content;
  
  if (content.length <= platform.limit) return content;
  
  // Leave space for "..." and potential hashtags
  const maxLength = platform.limit - 3;
  return content.substring(0, maxLength) + '...';
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
