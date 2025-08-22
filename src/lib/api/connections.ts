import { supabase } from '../supabaseClient'

export type Connection = {
  id: string
  developer_id: string
  company_id: string
  status: 'pending' | 'accepted' | 'rejected'
  message: string
  created_at: string
  updated_at: string
}

export type ConnectionWithDetails = Connection & {
  developer: {
    name: string
    email: string
    avatar_url?: string
  }
  company: {
    name: string
    logo_url?: string
    sector: string
  }
}

// Obtener todas las conexiones de un usuario
export async function getUserConnections(userEmail: string) {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      developer:developers(name, email, avatar_url),
      company:companies(name, logo_url, sector)
    `)
    .or(`developer.email.eq.${userEmail},company.email.eq.${userEmail}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user connections:', error)
    throw error
  }

  return data as ConnectionWithDetails[]
}

// Obtener conexiones de un developer
export async function getDeveloperConnections(developerId: string) {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      company:companies(name, logo_url, sector)
    `)
    .eq('developer_id', developerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching developer connections:', error)
    throw error
  }

  return data
}

// Obtener conexiones de una company
export async function getCompanyConnections(companyId: string) {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      developer:developers(name, email, avatar_url)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching company connections:', error)
    throw error
  }

  return data
}

// Crear nueva conexión
export async function createConnection(connectionData: Omit<Connection, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('connections')
    .insert([connectionData])
    .select()
    .single()

  if (error) {
    console.error('Error creating connection:', error)
    throw error
  }

  return data
}

// Actualizar estado de conexión
export async function updateConnectionStatus(id: string, status: Connection['status']) {
  const { data, error } = await supabase
    .from('connections')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating connection status:', error)
    throw error
  }

  return data
}

// Eliminar conexión
export async function deleteConnection(id: string) {
  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting connection:', error)
    throw error
  }

  return { success: true }
}

// Verificar si existe una conexión entre developer y company
export async function checkConnectionExists(developerId: string, companyId: string) {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('developer_id', developerId)
    .eq('company_id', companyId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking connection:', error)
    throw error
  }

  return data
}

// Obtener conexiones por estado
export async function getConnectionsByStatus(status: Connection['status'], userEmail: string) {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      developer:developers(name, email, avatar_url),
      company:companies(name, logo_url, sector)
    `)
    .eq('status', status)
    .or(`developer.email.eq.${userEmail},company.email.eq.${userEmail}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching connections by status:', error)
    throw error
  }

  return data as ConnectionWithDetails[]
}
