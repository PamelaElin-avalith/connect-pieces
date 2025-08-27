export interface Project {
  id: number;
  title: string;
  description: string;
  skills: string[];
  budget?: string;
  duration?: string;
  location?: string;
  team_size?: string;
  type: 'freelance' | 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  created_by: string;
  company_id?: string;
  developer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithCompany extends Project {
  company?: {
    id: string;
    name: string;
    sector: string;
    logo_url?: string;
  };
}

export interface ProjectWithDeveloper extends Project {
  developer?: {
    id: string;
    name: string;
    skills: string[];
    avatar_url?: string;
  };
}

export interface CreateProjectData {
  title: string;
  description: string;
  skills: string;
  budget?: string;
  duration?: string;
  location?: string;
  team_size?: string;
  type: 'freelance' | 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
}

export interface ProjectFilters {
  search?: string;
  type?: string;
  status?: string;
  skills?: string[];
  location?: string;
  budget_min?: number;
  budget_max?: number;
}
