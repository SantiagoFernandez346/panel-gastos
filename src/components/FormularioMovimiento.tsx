import { useState, type FormEvent } from 'react'
import { CATEGORIAS, type Movimiento, type TipoMovimiento } from '../types'
import { useFinanzas } from '../store/useFinanzas'
import { hoyIso } from '../utils/format'
import { claseBotonPrimario, claseBotonSecundario, claseCampo, claseTarjeta } from './estilos'

interface Props {
  /** Si viene un movimiento, el formulario lo edita; si no, crea uno nuevo */
  editando: Movimiento | null
  onTerminar: () => void
}

const claseEtiqueta = 'text-sm font-medium text-slate-600 dark:text-slate-300'

export function FormularioMovimiento({ editando, onTerminar }: Props) {
  const agregar = useFinanzas((s) => s.agregar)
  const editar = useFinanzas((s) => s.editar)

  const [tipo, setTipo] = useState<TipoMovimiento>(editando?.tipo ?? 'gasto')
  const [monto, setMonto] = useState(editando ? String(editando.monto) : '')
  const [categoria, setCategoria] = useState(editando?.categoria ?? CATEGORIAS.gasto[0])
  const [fecha, setFecha] = useState(editando?.fecha ?? hoyIso())
  const [descripcion, setDescripcion] = useState(editando?.descripcion ?? '')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function cambiarTipo(nuevoTipo: TipoMovimiento) {
    setTipo(nuevoTipo)
    setCategoria(CATEGORIAS[nuevoTipo][0])
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const montoNumero = Number(monto.replace(',', '.'))

    if (!montoNumero || montoNumero <= 0) {
      setError('Ingresá un monto mayor a 0.')
      return
    }
    if (!fecha) {
      setError('Elegí una fecha.')
      return
    }

    const datos = { tipo, monto: montoNumero, categoria, fecha, descripcion: descripcion.trim() }

    setGuardando(true)
    const ok = editando ? await editar(editando.id, datos) : await agregar(datos)
    setGuardando(false)
    if (!ok) return // El error se muestra arriba, en el aviso general

    // Deja el formulario listo para cargar otro movimiento
    setMonto('')
    setDescripcion('')
    setError('')
    onTerminar()
  }

  return (
    <form onSubmit={enviar} className={`space-y-4 ${claseTarjeta}`}>
      <h2 className="text-lg font-semibold">
        {editando ? 'Editar movimiento' : 'Nuevo movimiento'}
      </h2>

      <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {(['gasto', 'ingreso'] as const).map((opcion) => (
          <button
            key={opcion}
            type="button"
            onClick={() => cambiarTipo(opcion)}
            className={`rounded-md py-2 text-sm font-medium capitalize transition ${
              tipo === opcion
                ? opcion === 'gasto'
                  ? 'bg-rose-500 text-white shadow'
                  : 'bg-emerald-500 text-white shadow'
                : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {opcion}
          </button>
        ))}
      </div>

      <label className="block space-y-1">
        <span className={claseEtiqueta}>Monto</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className={`${claseCampo} w-full`}
        />
      </label>

      <label className="block space-y-1">
        <span className={claseEtiqueta}>Categoría</span>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={`${claseCampo} w-full`}
        >
          {CATEGORIAS[tipo].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className={claseEtiqueta}>Fecha</span>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className={`${claseCampo} w-full`}
        />
      </label>

      <label className="block space-y-1">
        <span className={claseEtiqueta}>Descripción (opcional)</span>
        <input
          type="text"
          placeholder="Ej: supermercado"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={`${claseCampo} w-full`}
        />
      </label>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={guardando} className={`${claseBotonPrimario} flex-1`}>
          {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Agregar'}
        </button>
        {editando && (
          <button type="button" onClick={onTerminar} className={claseBotonSecundario}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
