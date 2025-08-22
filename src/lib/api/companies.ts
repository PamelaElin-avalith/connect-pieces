import { supabase } from '../supabaseClient'
import type { Company } from '../supabaseClient'

// Obtener todas las companies
export async function getCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching companies:', error)
    throw error
  }

  return data
}

// Obtener company por ID
export async function getCompanyById(id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching company:', error)
    throw error
  }

  return data
}

// Obtener company por email
export async function getCompanyByEmail(email: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error fetching company by email:', error)
    throw error
  }

  return data
}

// Crear nueva company
export async function createCompany(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('companies')
    .insert([companyData])
    .select()
    .single()

  if (error) {
    console.error('Error creating company:', error)
    throw error
  }

  return data
}

// Actualizar company
export async function updateCompany(id: string, updates: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating company:', error)
    throw error
  }

  return data
}

// Eliminar company
export async function deleteCompany(id: string) {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting company:', error)
    throw error
  }

  return { success: true }
}

// Buscar companies por sector
export async function getCompaniesBySector(sector: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('sector', sector)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching companies by sector:', error)
    throw error
  }

  return data
}

// Buscar companies por texto
export async function searchCompanies(searchTerm: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,sector.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching companies:', error)
    throw error
  }

  return data
}

// Obtener companies paginadas
export async function getCompaniesPaginated(page: number = 1, pageSize: number = 10) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('companies')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching paginated companies:', error)
    throw error
  }

  return { data, count, page, pageSize }
}

// Obtener sectores únicos
export async function getUniqueSectors() {
  const { data, error } = await supabase
    .from('companies')
    .select('sector')
    .not('sector', 'is', null)

  if (error) {
    console.error('Error fetching sectors:', error)
    throw error
  }

  // Extraer sectores únicos
  const sectors = [...new Set(data.map(item => item.sector))]
  return sectors
}
