export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      post_reactions: {
        Row: {
          id: number
          post_id: number
          reaction: boolean
          user_id: string
        }
        Insert: {
          id?: number
          post_id: number
          reaction: boolean
          user_id: string
        }
        Update: {
          id?: number
          post_id?: number
          reaction?: boolean
          user_id?: string
        }
      }
      posts: {
        Row: {
          approved: boolean | null
          created_at: string | null
          id: number
          image: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          id?: number
          image: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          id?: number
          image?: string
          user_id?: string | null
        }
      }
      profiles: {
        Row: {
          avatar: string
          id: string
          username: string
        }
        Insert: {
          avatar: string
          id: string
          username: string
        }
        Update: {
          avatar?: string
          id?: string
          username?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
