import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

/** Sesión actual de Supabase. Si Supabase no está configurado, siempre es null. */
export function useSesion() {
  const [sesion, setSesion] = useState<Session | null>(null)
  const [cargando, setCargando] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      setCargando(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSesion(nuevaSesion)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return { sesion, cargando }
}
