export interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  profiles: {
    full_name: string | null;
    avatar_url?: string;
    username: string | null;
  };
}

export interface OnlineUser {
  id: string;
  full_name: string;
  avatar_url?: string;
  username: string;
  last_seen: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url?: string;
}

export interface ProfileForm {
  full_name: string;
  username: string;
}
