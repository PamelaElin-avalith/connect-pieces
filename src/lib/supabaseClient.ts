import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para las tablas de developers y companies
export type Developer = {
  id: number
  name: string
  email: string
  skills: string[]
  github?: string
  linkedin?: string
  avatar_url?: string
  created_at: string
}

export type Company = {
  id: number
  name: string
  email: string
  sector: string
  description: string
  logo_url?: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      developers: {
        Row: Developer
        Insert: Omit<Developer, 'id' | 'created_at'>
        Update: Partial<Omit<Developer, 'id' | 'created_at'>>
      }
      companies: {
        Row: Company
        Insert: Omit<Company, 'id' | 'created_at'>
        Update: Partial<Omit<Company, 'id' | 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Cliente tipado
export const supabaseTyped = createClient<Database>(supabaseUrl, supabaseAnonKey)
