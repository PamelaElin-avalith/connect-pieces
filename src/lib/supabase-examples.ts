import { supabase } from './supabase'

// Ejemplos de operaciones CRUD con Supabase

// 1. INSERT - Crear un nuevo registro
export async function createUser(userData: { name: string; email: string; age?: number }) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()

  if (error) {
    console.error('Error creating user:', error)
    throw error
  }

  return data
}

// 2. SELECT - Obtener registros
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')

  if (error) {
    console.error('Error fetching users:', error)
    throw error
  }

  return data
}

// 3. SELECT con filtros
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    throw error
  }

  return data
}

// 4. UPDATE - Actualizar registros
export async function updateUser(id: string, updates: Partial<{ name: string; email: string; age: number }>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating user:', error)
    throw error
  }

  return data
}

// 5. DELETE - Eliminar registros
export async function deleteUser(id: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting user:', error)
    throw error
  }

  return { success: true }
}

// 6. Consultas más complejas con joins
export async function getUsersWithPosts() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      posts (*)
    `)

  if (error) {
    console.error('Error fetching users with posts:', error)
    throw error
  }

  return data
}

// 7. Paginación
export async function getUsersPaginated(page: number = 1, pageSize: number = 10) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .range(from, to)

  if (error) {
    console.error('Error fetching paginated users:', error)
    throw error
  }

  return { data, count, page, pageSize }
}

// 8. Búsqueda con texto
export async function searchUsers(searchTerm: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)

  if (error) {
    console.error('Error searching users:', error)
    throw error
  }

  return data
}

// 9. Subida de archivos
export async function uploadFile(file: File, bucketName: string = 'avatars') {
  const fileName = `${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file)

  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }

  return data
}

// 10. Obtener URL pública de un archivo
export function getPublicUrl(bucketName: string, fileName: string) {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName)

  return data.publicUrl
}

// 11. Real-time subscriptions
export function subscribeToUsers(callback: (payload: any) => void) {
  const subscription = supabase
    .channel('users_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'users' }, 
      callback
    )
    .subscribe()

  return subscription
}
