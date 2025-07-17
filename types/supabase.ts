export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      generations: {
        Row: {
          id: string;
          user_id: string;
          input_content: string;
          posts: Json;
          platforms: string[];
          tokens_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          input_content: string;
          posts: Json;
          platforms: string[];
          tokens_used?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          input_content?: string;
          posts?: Json;
          platforms?: string[];
          tokens_used?: number;
          created_at?: string;
        };
      };
      monthly_usage: {
        Row: {
          user_id: string;
          month_year: string;
          generation_count: number;
        };
        Insert: {
          user_id: string;
          month_year: string;
          generation_count: number;
        };
        Update: {
          user_id?: string;
          month_year?: string;
          generation_count?: number;
        };
      };
      subscriptions: {
        Row: {
          user_id: string;
          paddle_subscription_id: string;
          plan_name: string;
          status: string;
          current_period_end: string;
        };
        Insert: {
          user_id: string;
          paddle_subscription_id: string;
          plan_name: string;
          status: string;
          current_period_end: string;
        };
        Update: {
          user_id?: string;
          paddle_subscription_id?: string;
          plan_name?: string;
          status?: string;
          current_period_end?: string;
        };
      };
      ai_metrics: {
        Row: {
          id: string;
          user_id: string;
          request_time: string;
          response_time: string;
          tokens_used: number;
          character_count: number;
          platform_count: number;
          success: boolean;
          error: string | null;
          provider_type: string;
          model_name: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          request_time: string;
          response_time: string;
          tokens_used: number;
          character_count: number;
          platform_count: number;
          success: boolean;
          error?: string | null;
          provider_type: string;
          model_name: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          request_time?: string;
          response_time?: string;
          tokens_used?: number;
          character_count?: number;
          platform_count?: number;
          success?: boolean;
          error?: string | null;
          provider_type?: string;
          model_name?: string;
        };
      };
      content_parsing: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          title: string;
          content: string;
          extracted_at: string;
          word_count: number;
          reading_time: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          title: string;
          content: string;
          extracted_at: string;
          word_count: number;
          reading_time: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          title?: string;
          content?: string;
          extracted_at?: string;
          word_count?: number;
          reading_time?: number;
        };
      };
      platform_constraints: {
        Row: {
          platform: string;
          max_length: number;
          max_posts: number;
          hashtag_count: number;
          tone: string;
          format: string;
        };
        Insert: {
          platform: string;
          max_length: number;
          max_posts: number;
          hashtag_count: number;
          tone: string;
          format: string;
        };
        Update: {
          platform?: string;
          max_length?: number;
          max_posts?: number;
          hashtag_count?: number;
          tone?: string;
          format?: string;
        };
      };
      user_ai_config: {
        Row: {
          user_id: string;
          provider_type: string;
          model: string | null;
          temperature: number;
          max_tokens: number | null;
          top_p: number;
          include_emojis: boolean;
          default_target_audience: string | null;
          custom_instructions: string | null;
        };
        Insert: {
          user_id: string;
          provider_type?: string;
          model?: string | null;
          temperature?: number;
          max_tokens?: number | null;
          top_p?: number;
          include_emojis?: boolean;
          default_target_audience?: string | null;
          custom_instructions?: string | null;
        };
        Update: {
          user_id?: string;
          provider_type?: string;
          model?: string | null;
          temperature?: number;
          max_tokens?: number | null;
          top_p?: number;
          include_emojis?: boolean;
          default_target_audience?: string | null;
          custom_instructions?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
