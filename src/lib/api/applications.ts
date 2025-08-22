import { supabase } from '../supabaseClient'

export type Application = {
  id: string
  project_id: string
  developer_id: string
  cover_letter: string
  proposed_rate: number
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export type ApplicationWithDetails = Application & {
  project: {
    title: string
    description: string
    budget_range: string
    project_type: string
  }
  developer: {
    name: string
    email: string
    avatar_url?: string
    skills: string[]
  }
}

// Obtener todas las aplicaciones de un developer
export async function getDeveloperApplications(developerId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      project:projects(title, description, budget_range, project_type)
    `)
    .eq('developer_id', developerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching developer applications:', error)
    throw error
  }

  return data
}

// Obtener todas las aplicaciones de un proyecto
export async function getProjectApplications(projectId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      developer:developers(name, email, avatar_url, skills)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching project applications:', error)
    throw error
  }

  return data
}

// Obtener aplicación por ID
export async function getApplicationById(id: string) {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      project:projects(title, description, budget_range, project_type),
      developer:developers(name, email, avatar_url, skills)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching application:', error)
    throw error
  }

  return data as ApplicationWithDetails
}

// Crear nueva aplicación
export async function createApplication(applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select()
    .single()

  if (error) {
    console.error('Error creating application:', error)
    throw error
  }

  return data
}

// Actualizar estado de aplicación
export async function updateApplicationStatus(id: string, status: Application['status']) {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating application status:', error)
    throw error
  }

  return data
}

// Actualizar aplicación
export async function updateApplication(id: string, updates: Partial<Omit<Application, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating application:', error)
    throw error
  }

  return data
}

// Eliminar aplicación
export async function deleteApplication(id: string) {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting application:', error)
    throw error
  }

  return { success: true }
}

// Verificar si existe una aplicación de un developer a un proyecto
export async function checkApplicationExists(developerId: string, projectId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('developer_id', developerId)
    .eq('project_id', projectId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking application:', error)
    throw error
  }

  return data
}

// Obtener aplicaciones por estado
export async function getApplicationsByStatus(status: Application['status'], developerId?: string, projectId?: string) {
  let query = supabase
    .from('applications')
    .select(`
      *,
      project:projects(title, description, budget_range, project_type),
      developer:developers(name, email, avatar_url, skills)
    `)
    .eq('status', status)

  if (developerId) {
    query = query.eq('developer_id', developerId)
  }

  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications by status:', error)
    throw error
  }

  return data as ApplicationWithDetails[]
}

// Obtener estadísticas de aplicaciones
export async function getApplicationStats(developerId?: string, projectId?: string) {
  let query = supabase
    .from('applications')
    .select('status', { count: 'exact' })

  if (developerId) {
    query = query.eq('developer_id', developerId)
  }

  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching application stats:', error)
    throw error
  }

  const stats = {
    total: data?.length || 0,
    pending: data?.filter(app => app.status === 'pending').length || 0,
    reviewed: data?.filter(app => app.status === 'reviewed').length || 0,
    accepted: data?.filter(app => app.status === 'accepted').length || 0,
    rejected: data?.filter(app => app.status === 'rejected').length || 0
  }

  return stats
}
