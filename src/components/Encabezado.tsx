import { useTema } from '../hooks/useTema'
import { claseBotonSecundario, claseTextoSuave } from './estilos'

interface Props {
  subtitulo: string
  /** Email del usuario logueado, o null en modo local */
  email: string | null
  onSalir: (() => void) | null
  onExportar: () => void
  puedeExportar: boolean
  onCargarEjemplo: (() => void) | null
}

export function Encabezado({ subtitulo, email, onSalir, onExportar, puedeExportar, onCargarEjemplo }: Props) {
  const { oscuro, alternar } = useTema()

  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Gastos</h1>
        <p className={`text-sm first-letter:uppercase ${claseTextoSuave}`}>{subtitulo}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onCargarEjemplo && (
          <button onClick={onCargarEjemplo} className={claseBotonSecundario}>
            Cargar datos de ejemplo
          </button>
        )}
        <button onClick={onExportar} disabled={!puedeExportar} className={claseBotonSecundario}>
          Exportar CSV
        </button>
        <button
          onClick={alternar}
          className={claseBotonSecundario}
          aria-label={oscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={oscuro ? 'Modo claro' : 'Modo oscuro'}
        >
          {oscuro ? '☀︎' : '☾'}
        </button>
        {onSalir && (
          <div className="flex items-center gap-2">
            {email && <span className={`hidden text-xs sm:inline ${claseTextoSuave}`}>{email}</span>}
            <button onClick={onSalir} className={claseBotonSecundario}>
              {email ? 'Salir' : 'Iniciar sesión'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
