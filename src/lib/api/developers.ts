import { supabase } from '../supabaseClient'
import type { Developer } from '../supabaseClient'

// Obtener todos los developers
export async function getDevelopers() {
  const { data, error } = await supabase
    .from('developers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching developers:', error)
    throw error
  }

  return data
}

// Obtener developer por ID
export async function getDeveloperById(id: string) {
  const { data, error } = await supabase
    .from('developers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching developer:', error)
    throw error
  }

  return data
}

// Obtener developer por email
export async function getDeveloperByEmail(email: string) {
  const { data, error } = await supabase
    .from('developers')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error fetching developer by email:', error)
    throw error
  }

  return data
}

// Crear nuevo developer
export async function createDeveloper(developerData: Omit<Developer, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('developers')
    .insert([developerData])
    .select()
    .single()

  if (error) {
    console.error('Error creating developer:', error)
    throw error
  }

  return data
}

// Actualizar developer
export async function updateDeveloper(id: string, updates: Partial<Omit<Developer, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('developers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating developer:', error)
    throw error
  }

  return data
}

// Eliminar developer
export async function deleteDeveloper(id: string) {
  const { error } = await supabase
    .from('developers')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting developer:', error)
    throw error
  }

  return { success: true }
}

// Buscar developers por skills
export async function searchDevelopersBySkills(skills: string[]) {
  const { data, error } = await supabase
    .from('developers')
    .select('*')
    .overlaps('skills', skills)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching developers by skills:', error)
    throw error
  }

  return data
}

// Buscar developers por texto
export async function searchDevelopers(searchTerm: string) {
  const { data, error } = await supabase
    .from('developers')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching developers:', error)
    throw error
  }

  return data
}

// Obtener developers paginados
export async function getDevelopersPaginated(page: number = 1, pageSize: number = 10) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('developers')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching paginated developers:', error)
    throw error
  }

  return { data, count, page, pageSize }
}
