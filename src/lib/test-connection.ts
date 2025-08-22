import { supabase } from './supabaseClient'

// Función simple para probar la conexión
export async function testConnection() {
  try {
    console.log('🔌 Probando conexión a Supabase...')
    
    // Intentar obtener developers
    const { data: developers, error: devError } = await supabase
      .from('developers')
      .select('*')
      .limit(1)
    
    if (devError) {
      console.error('❌ Error al obtener developers:', devError)
      return { success: false, error: devError }
    }
    
    console.log('✅ Conexión exitosa! Developers encontrados:', developers?.length || 0)
    
    // Intentar obtener companies
    const { data: companies, error: compError } = await supabase
      .from('companies')
      .select('*')
      .limit(1)
    
    if (compError) {
      console.error('❌ Error al obtener companies:', compError)
      return { success: false, error: compError }
    }
    
    console.log('✅ Companies encontradas:', companies?.length || 0)
    
    // Intentar obtener projects
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('*')
      .limit(1)
    
    if (projError) {
      console.error('❌ Error al obtener projects:', projError)
      return { success: false, error: projError }
    }
    
    console.log('✅ Projects encontrados:', projects?.length || 0)
    
    return { 
      success: true, 
      developers: developers?.length || 0,
      companies: companies?.length || 0,
      projects: projects?.length || 0
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
    return { success: false, error }
  }
}

// Función para insertar un developer de prueba
export async function insertTestDeveloper() {
  try {
    const { data, error } = await supabase
      .from('developers')
      .insert([
        {
          name: 'Developer de Prueba',
          email: 'test@example.com',
          skills: ['JavaScript', 'React'],
          github: 'https://github.com/testdev'
        }
      ])
      .select()
    
    if (error) {
      console.error('❌ Error al insertar developer:', error)
      return { success: false, error }
    }
    
    console.log('✅ Developer insertado:', data)
    return { success: true, data }
    
  } catch (error) {
    console.error('❌ Error general:', error)
    return { success: false, error }
  }
}

// Función para buscar developers por skills
export async function searchDevelopersBySkills(skills: string[]) {
  try {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .overlaps('skills', skills)
    
    if (error) {
      console.error('❌ Error al buscar developers:', error)
      return { success: false, error }
    }
    
    console.log(`✅ Developers con skills ${skills}:`, data?.length || 0)
    return { success: true, data }
    
  } catch (error) {
    console.error('❌ Error general:', error)
    return { success: false, error }
  }
}
