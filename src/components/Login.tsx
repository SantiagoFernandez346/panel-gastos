import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { claseBotonPrimario, claseBotonSecundario, claseCampo, claseTarjeta, claseTextoSuave } from './estilos'

interface Props {
  /** Entrar sin cuenta: los datos quedan solo en este navegador */
  onInvitado: () => void
}

type Modo = 'ingresar' | 'registrarse'

const TRADUCCIONES: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos.',
  'User already registered': 'Ya existe una cuenta con ese email.',
  'Email not confirmed': 'Todavía no confirmaste tu email. Revisá tu casilla.',
  'Password should be at least 6 characters.': 'La contraseña tiene que tener al menos 6 caracteres.',
}

export function Login({ onInvitado }: Props) {
  const [modo, setModo] = useState<Modo>('ingresar')
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'info'; texto: string } | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setEnviando(true)
    setMensaje(null)

    const credenciales = { email: email.trim(), password: contrasena }
    const { data, error } =
      modo === 'ingresar'
        ? await supabase.auth.signInWithPassword(credenciales)
        : await supabase.auth.signUp(credenciales)

    setEnviando(false)

    if (error) {
      setMensaje({ tipo: 'error', texto: TRADUCCIONES[error.message] ?? error.message })
    } else if (modo === 'registrarse' && !data.session) {
      setMensaje({ tipo: 'info', texto: 'Te enviamos un email para confirmar la cuenta. Después volvé e ingresá.' })
    }
    // Si hay sesión, useSesion se entera solo y la app muestra el panel
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Gastos</h1>
          <p className={`mt-1 text-sm ${claseTextoSuave}`}>
            Tus ingresos, gastos y presupuestos en un solo lugar.
          </p>
        </header>

        <form onSubmit={enviar} className={`space-y-4 ${claseTarjeta}`}>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['ingresar', 'registrarse'] as const).map((opcion) => (
              <button
                key={opcion}
                type="button"
                onClick={() => {
                  setModo(opcion)
                  setMensaje(null)
                }}
                className={`rounded-md py-2 text-sm font-medium capitalize ${
                  modo === opcion
                    ? 'bg-white shadow dark:bg-slate-700'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {opcion}
              </button>
            ))}
          </div>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${claseCampo} w-full`}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Contraseña</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={modo === 'ingresar' ? 'current-password' : 'new-password'}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className={`${claseCampo} w-full`}
            />
          </label>

          {mensaje && (
            <p
              className={`text-sm ${
                mensaje.tipo === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {mensaje.texto}
            </p>
          )}

          <button type="submit" disabled={enviando} className={`${claseBotonPrimario} w-full`}>
            {enviando ? 'Un momento...' : modo === 'ingresar' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <div className="text-center">
          <button onClick={onInvitado} className={claseBotonSecundario}>
            Probar sin cuenta
          </button>
          <p className={`mt-2 text-xs ${claseTextoSuave}`}>
            Sin cuenta, los datos se guardan solo en este navegador.
          </p>
        </div>
      </div>
    </main>
  )
}
