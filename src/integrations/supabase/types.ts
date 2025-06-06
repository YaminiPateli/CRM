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
      app_role: {
        Row: {
          app_role: string
          created_at: string
          id: number
        }
        Insert: {
          app_role: string
          created_at?: string
          id?: number
        }
        Update: {
          app_role?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      contact: {
        Row: {
          created_at: string
          email: string | null
          id: number
          location: string | null
          name: string | null
          phone: string | null
          status: Database["public"]["Enums"]["lead"] | null
          type: Database["public"]["Enums"]["type"]
          user_id: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          location?: string | null
          name?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["lead"] | null
          type: Database["public"]["Enums"]["type"]
          user_id?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          location?: string | null
          name?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["lead"] | null
          type?: Database["public"]["Enums"]["type"]
          user_id?: number | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          assigned_agent: string | null
          budget: string | null
          campaign_source: string | null
          communication_preference: string | null
          created_at: string | null
          current_scenario: string | null
          email: string | null
          id: string
          last_contact: string | null
          lead_score: number | null
          lead_source: string | null
          lead_source_details: string | null
          location: string | null
          name: string
          notes: string | null
          phone: string | null
          properties: number | null
          referral_source: string | null
          requirements: string | null
          social_media: string | null
          status: string | null
          timeline: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          assigned_agent?: string | null
          budget?: string | null
          campaign_source?: string | null
          communication_preference?: string | null
          created_at?: string | null
          current_scenario?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_source_details?: string | null
          location?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          properties?: number | null
          referral_source?: string | null
          requirements?: string | null
          social_media?: string | null
          status?: string | null
          timeline?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          assigned_agent?: string | null
          budget?: string | null
          campaign_source?: string | null
          communication_preference?: string | null
          created_at?: string | null
          current_scenario?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_source_details?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          properties?: number | null
          referral_source?: string | null
          requirements?: string | null
          social_media?: string | null
          status?: string | null
          timeline?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      follow_ups: {
        Row: {
          contact: string
          created_at: string | null
          description: string | null
          due_date: string
          due_time: string | null
          id: string
          priority: string | null
          property: string | null
          status: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          contact: string
          created_at?: string | null
          description?: string | null
          due_date: string
          due_time?: string | null
          id?: string
          priority?: string | null
          property?: string | null
          status?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          contact?: string
          created_at?: string | null
          description?: string | null
          due_date?: string
          due_time?: string | null
          id?: string
          priority?: string | null
          property?: string | null
          status?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          agent: string | null
          baths: number | null
          beds: number | null
          city: string
          created_at: string | null
          description: string | null
          id: string
          listing_date: string | null
          price: number | null
          sqft: number | null
          state: string
          status: string | null
          type: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address: string
          agent?: string | null
          baths?: number | null
          beds?: number | null
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          listing_date?: string | null
          price?: number | null
          sqft?: number | null
          state: string
          status?: string | null
          type?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string
          agent?: string | null
          baths?: number | null
          beds?: number | null
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          listing_date?: string | null
          price?: number | null
          sqft?: number | null
          state?: string
          status?: string | null
          type?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          UUID: number
        }
        Insert: {
          created_at?: string
          role?: string
          UUID?: number
        }
        Update: {
          created_at?: string
          role?: string
          UUID?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      lead: "Active" | "Inactive"
      type: "Buyer" | "Seller" | "Investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      lead: ["Active", "Inactive"],
      type: ["Buyer", "Seller", "Investor"],
    },
  },
} as const
