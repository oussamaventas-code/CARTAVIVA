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
      themes: {
        Row: {
          id: string
          restaurant_id: string | null
          name: string
          colors: Json
          typography: Json
          borders: Json
          spacing: Json
          animations: Json
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id?: string | null
          name: string
          colors?: Json
          typography?: Json
          borders?: Json
          spacing?: Json
          animations?: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['themes']['Insert']>
        Relationships: []
      }
      restaurants: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          theme_id: string | null
          default_language: string
          supported_languages: string[]
          currency: string
          timezone: string
          vat_rate: number
          whatsapp: string | null
          social_links: Json | null
          business_hours: Json | null
          custom_domain: string | null
          config: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          theme_id?: string | null
          default_language?: string
          supported_languages?: string[]
          currency?: string
          timezone?: string
          vat_rate?: number
          whatsapp?: string | null
          social_links?: Json | null
          business_hours?: Json | null
          custom_domain?: string | null
          config?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['restaurants']['Insert']>
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          role: 'admin' | 'manager' | 'employee' | 'readonly'
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          role: 'admin' | 'manager' | 'employee' | 'readonly'
          is_active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_roles']['Insert']>
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          restaurant_id: string
          slug: string
          sort_order: number
          icon: string | null
          image_url: string | null
          is_active: boolean
          translations: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          slug: string
          sort_order?: number
          icon?: string | null
          image_url?: string | null
          is_active?: boolean
          translations?: Json
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
        Relationships: []
      }
      dishes: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string
          slug: string
          price: number
          compare_price: number | null
          is_active: boolean
          is_featured: boolean
          sort_order: number
          tags: string[] | null
          translations: Json
          config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id: string
          slug: string
          price: number
          compare_price?: number | null
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number
          tags?: string[] | null
          translations?: Json
          config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['dishes']['Insert']>
        Relationships: []
      }
      allergens: {
        Row: {
          id: string
          code: string
          icon_url: string | null
          translations: Json
          sort_order: number
        }
        Insert: {
          id?: string
          code: string
          icon_url?: string | null
          translations?: Json
          sort_order?: number
        }
        Update: Partial<Database['public']['Tables']['allergens']['Insert']>
        Relationships: []
      }
      dish_allergens: {
        Row: {
          dish_id: string
          allergen_id: string
        }
        Insert: {
          dish_id: string
          allergen_id: string
        }
        Update: Partial<Database['public']['Tables']['dish_allergens']['Insert']>
        Relationships: []
      }
      images: {
        Row: {
          id: string
          restaurant_id: string
          dish_id: string | null
          url: string
          thumbnail_url: string | null
          alt_text: string | null
          width: number | null
          height: number | null
          size_bytes: number | null
          mime_type: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          dish_id?: string | null
          url: string
          thumbnail_url?: string | null
          alt_text?: string | null
          width?: number | null
          height?: number | null
          size_bytes?: number | null
          mime_type?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['images']['Insert']>
        Relationships: []
      }
      videos: {
        Row: {
          id: string
          restaurant_id: string
          dish_id: string | null
          url: string
          poster_url: string | null
          duration_seconds: number | null
          width: number | null
          height: number | null
          size_bytes: number | null
          mime_type: string | null
          is_processed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          dish_id?: string | null
          url: string
          poster_url?: string | null
          duration_seconds?: number | null
          width?: number | null
          height?: number | null
          size_bytes?: number | null
          mime_type?: string | null
          is_processed?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['videos']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'videos_dish_id_fkey'
            columns: ['dish_id']
            isOneToOne: false
            referencedRelation: 'dishes'
            referencedColumns: ['id']
          },
        ]
      }
      pairings: {
        Row: {
          id: string
          dish_id: string
          paired_dish_id: string
          pairing_type: string
          sort_order: number
          translations: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          dish_id: string
          paired_dish_id: string
          pairing_type?: string
          sort_order?: number
          translations?: Json | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['pairings']['Insert']>
        Relationships: []
      }
      tables: {
        Row: {
          id: string
          restaurant_id: string
          number: number
          label: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          number: number
          label?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['tables']['Insert']>
        Relationships: []
      }
      qr_codes: {
        Row: {
          id: string
          restaurant_id: string
          table_id: string | null
          url: string
          params: Json | null
          svg_data: string | null
          is_active: boolean
          scans_count: number
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_id?: string | null
          url: string
          params?: Json | null
          svg_data?: string | null
          is_active?: boolean
          scans_count?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['qr_codes']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'qr_codes_table_id_fkey'
            columns: ['table_id']
            isOneToOne: false
            referencedRelation: 'tables'
            referencedColumns: ['id']
          },
        ]
      }
      analytics_events: {
        Row: {
          id: string
          restaurant_id: string
          event_type: string
          dish_id: string | null
          category_id: string | null
          table_id: string | null
          session_id: string | null
          language: string | null
          device_type: string | null
          duration_ms: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          event_type: string
          dish_id?: string | null
          category_id?: string | null
          table_id?: string | null
          session_id?: string | null
          language?: string | null
          device_type?: string | null
          duration_ms?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['analytics_events']['Insert']>
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          name: string
          native_name: string
          flag_emoji: string | null
          is_rtl: boolean
        }
        Insert: {
          code: string
          name: string
          native_name: string
          flag_emoji?: string | null
          is_rtl?: boolean
        }
        Update: Partial<Database['public']['Tables']['languages']['Insert']>
        Relationships: []
      }
      orders_future: {
        Row: {
          id: string
          restaurant_id: string
          table_id: string | null
          status: string
          items: Json
          total: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_id?: string | null
          status?: string
          items?: Json
          total?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders_future']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
