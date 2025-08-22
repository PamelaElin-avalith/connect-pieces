import { supabase } from '../supabaseClient'

export type Project = {
  id: string
  title: string
  description: string
  company_id: string
  skills_required: string[]
  budget_range: string
  project_type: 'full-time' | 'part-time' | 'freelance' | 'contract'
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export type ProjectWithCompany = Project & {
  company: {
    name: string
    logo_url?: string
    sector: string
  }
}

// Obtener todos los proyectos
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(name, logo_url, sector)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    throw error
  }

  return data as ProjectWithCompany[]
}

// Obtener proyecto por ID
export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(name, logo_url, sector)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    throw error
  }

  return data as ProjectWithCompany
}

// Obtener proyectos por company
export async function getProjectsByCompany(companyId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching company projects:', error)
    throw error
  }

  return data
}

// Crear nuevo proyecto
export async function createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    throw error
  }

  return data
}

// Actualizar proyecto
export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    throw error
  }

  return data
}

// Eliminar proyecto
export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    throw error
  }

  return { success: true }
}

// Buscar proyectos por skills
export async function searchProjectsBySkills(skills: string[]) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(name, logo_url, sector)
    `)
    .overlaps('skills_required', skills)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching projects by skills:', error)
    throw error
  }

  return data as ProjectWithCompany[]
}

// Buscar proyectos por texto
export async function searchProjects(searchTerm: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(name, logo_url, sector)
    `)
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching projects:', error)
    throw error
  }

  return data as ProjectWithCompany[]
}

// Obtener proyectos por tipo
export async function getProjectsByType(projectType: Project['project_type']) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(name, logo_url, sector)
    `)
    .eq('project_type', projectType)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects by type:', error)
    throw error
  }

  return data as ProjectWithCompany[]
}

// Obtener proyectos paginados
export async function getProjectsPaginated(page: number = 1, pageSize: number = 10) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(name, logo_url, sector)
    `, { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching paginated projects:', error)
    throw error
  }

  return { 
    data: data as ProjectWithCompany[], 
    count, 
    page, 
    pageSize 
  }
}

// Obtener tipos de proyecto únicos
export async function getUniqueProjectTypes() {
  const { data, error } = await supabase
    .from('projects')
    .select('project_type')
    .not('project_type', 'is', null)

  if (error) {
    console.error('Error fetching project types:', error)
    throw error
  }

  const types = [...new Set(data.map(item => item.project_type))]
  return types
}
