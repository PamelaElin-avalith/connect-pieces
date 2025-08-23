import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de la base de datos
export interface Developer {
  id: string // UUID
  name: string
  email: string
  skills: string[]
  github?: string | null
  linkedin?: string | null
  avatar_url?: string | null
  created_at: string
}

export interface Company {
  id: string // UUID
  name: string
  email: string
  sector: string
  description?: string | null
  logo_url?: string | null
  created_at: string
}

export interface Project {
  id: string // UUID
  title: string
  description?: string | null
  company_id: string // UUID
  skills_required: string[]
  budget_range?: string | null
  project_type: 'full-time' | 'part-time' | 'freelance' | 'contract'
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  created_at: string
}

export interface Connection {
  id: string // UUID
  developer_id: string // UUID
  company_id: string // UUID
  status: 'pending' | 'accepted' | 'rejected'
  message?: string | null
  created_at: string
}

export interface Application {
  id: string // UUID
  project_id: string // UUID
  developer_id: string // UUID
  cover_letter?: string | null
  proposed_rate?: number | null
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at: string
}

// Tipos compuestos
export interface ProjectWithCompany extends Project {
  company: Company
}

export interface ConnectionWithDetails extends Connection {
  developer: Developer
  company: Company
}

export interface ApplicationWithDetails extends Application {
  project: Project
  developer: Developer
}

// Tipo de la base de datos completa
export interface Database {
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
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at'>>
      }
      connections: {
        Row: Connection
        Insert: Omit<Connection, 'id' | 'created_at'>
        Update: Partial<Omit<Connection, 'id' | 'created_at'>>
      }
      applications: {
        Row: Application
        Insert: Omit<Application, 'id' | 'created_at'>
        Update: Partial<Omit<Application, 'id' | 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export default supabase
