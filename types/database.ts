export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {

      // ======================
      // 1. natures テーブル
      // ======================
      natures: {
        Row: {
          id: number
          createdAt: string
          title: string
          description: string
          natureImg: string
          user_id: string
          // ALTER TABLE で追加した "tags" カラム
          tags: string[] | null
        }
        InsertTable: {
          id?: number
          createdAt?: string
          title: string
          description: string
          natureImg: string
          user_id?: string
          tags?: string[] | null
        }
        Update: {
          id?: number
          createdAt?: string
          title?: string
          description?: string
          natureImg?: string
          user_id?: string
          tags?: string[] | null
        }
        Relationships: []
      },

      // ======================
      // 2. profiles テーブル
      // ======================
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          avatar_url: string | null
          bio: string | null
          favorite_places: string[] | null
          favorite_seasons: string[] | null
          instagram_url: string | null
          twitter_url: string | null
          facebook_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          // テーブル定義上、id は NOT NULL だが、Supabase でトリガー挿入などがあり得る場合は optional
          id?: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          favorite_places?: string[] | null
          favorite_seasons?: string[] | null
          instagram_url?: string | null
          twitter_url?: string | null
          facebook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          favorite_places?: string[] | null
          favorite_seasons?: string[] | null
          instagram_url?: string | null
          twitter_url?: string | null
          facebook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      },

      // ======================
      // 3. follows テーブル
      // ======================
      follows: {
        Row: {
          follower_id: string
          followed_id: string
          created_at: string | null
        }
        Insert: {
          follower_id: string
          followed_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          followed_id?: string
          created_at?: string
        }
        Relationships: []
      }

    }, // Tables

    Views: {
      [_ in never]: never
    },
    Functions: {
      [_ in never]: never
    },
    Enums: {
      [_ in never]: never
    },
    CompositeTypes: {
      [_ in never]: never
    }
  } // public
}
