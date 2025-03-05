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
        natures: {
          Row: {
            createdAt: string
            description: string
            id: number
            natureImg: string
            tags: string[] | null
            title: string
            user_id: string
            likes: number
          }
          Insert: {
            createdAt?: string
            description: string
            id?: number
            natureImg: string
            tags?: string[] | null
            title: string
            user_id?: string
            likes: number
          }
          Update: {
            createdAt?: string
            description?: string
            id?: number
            natureImg?: string
            tags?: string[] | null
            title?: string
            user_id?: string
            likes: number
          }
          Relationships: [
            {
              foreignKeyName: "natures_user_id_fkey"
              columns: ["user_id"]
              referencedRelation: "profiles"
              referencedColumns: ["id"]
            }
          ]
        },
        
        // Add the new likes table
        likes: {
          Row: {
            id: string
            user_id: string
            nature_id: number
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            nature_id: number
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            nature_id?: number
            created_at?: string
          }
          Relationships: [
            {
              foreignKeyName: "likes_user_id_fkey"
              columns: ["user_id"]
              referencedRelation: "profiles"
              referencedColumns: ["id"]
            },
            {
              foreignKeyName: "likes_nature_id_fkey"
              columns: ["nature_id"]
              referencedRelation: "natures"
              referencedColumns: ["id"]
            }
          ]
        },
  
        // Existing profiles table
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
  
        // Existing follows table
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

