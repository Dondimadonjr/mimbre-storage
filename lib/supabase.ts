import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Cliente para usar en el navegador (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para usar SOLO en el servidor (service role key)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Helper para obtener sesión del usuario actual
export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser()
    return data?.user ?? null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper para verificar si usuario está autenticado
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}
