import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const claveAnonima = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Cliente de Supabase. Es `null` si no hay variables de entorno configuradas:
 * en ese caso la app funciona en modo local (datos en el navegador).
 */
export const supabase: SupabaseClient | null =
  url && claveAnonima ? createClient(url, claveAnonima) : null
