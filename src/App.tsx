import { useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import { useSesion } from './hooks/useSesion'
import { repositorioLocal } from './data/repositorioLocal'
import { crearRepositorioSupabase } from './data/repositorioSupabase'
import { Login } from './components/Login'
import { Panel } from './components/Panel'
import { claseTextoSuave } from './components/estilos'

export default function App() {
  const { sesion, cargando } = useSesion()
  const [invitado, setInvitado] = useState(false)

  // Con sesión iniciada los datos van a Supabase; sin sesión, al navegador
  const repo = useMemo(
    () => (sesion && supabase ? crearRepositorioSupabase(supabase) : repositorioLocal),
    [sesion?.user.id], // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (cargando) {
    return <p className={`grid min-h-dvh place-items-center ${claseTextoSuave}`}>Cargando...</p>
  }

  if (supabase && !sesion && !invitado) {
    return <Login onInvitado={() => setInvitado(true)} />
  }

  // Sin Supabase configurado no hay login: la app funciona 100% local
  const onSalir = !supabase
    ? null
    : sesion
      ? () => supabase!.auth.signOut()
      : () => setInvitado(false)

  return <Panel repo={repo} email={sesion?.user.email ?? null} onSalir={onSalir} />
}
