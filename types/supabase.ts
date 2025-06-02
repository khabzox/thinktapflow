export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      generations: {
        Row: {
          id: string
          user_id: string
          input_content: string
          generated_posts: Json
          platforms: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          input_content: string
          generated_posts: Json
          platforms: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          input_content?: string
          generated_posts?: Json
          platforms?: string[]
          created_at?: string
        }
      }
      monthly_usage: {
        Row: {
          user_id: string
          month_year: string
          generation_count: number
        }
        Insert: {
          user_id: string
          month_year: string
          generation_count: number
        }
        Update: {
          user_id?: string
          month_year?: string
          generation_count?: number
        }
      }
      subscriptions: {
        Row: {
          user_id: string
          paddle_subscription_id: string
          plan_name: string
          status: string
          current_period_end: string
        }
        Insert: {
          user_id: string
          paddle_subscription_id: string
          plan_name: string
          status: string
          current_period_end: string
        }
        Update: {
          user_id?: string
          paddle_subscription_id?: string
          plan_name?: string
          status?: string
          current_period_end?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 