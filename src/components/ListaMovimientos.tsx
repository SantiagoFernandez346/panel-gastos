import type { Movimiento } from '../types'
import { useFinanzas } from '../store/useFinanzas'
import { formatearFecha, formatearMonto } from '../utils/format'
import { claseTextoSuave } from './estilos'

interface Props {
  movimientos: Movimiento[]
  onEditar: (movimiento: Movimiento) => void
}

export function ListaMovimientos({ movimientos, onEditar }: Props) {
  const eliminar = useFinanzas((s) => s.eliminar)

  if (movimientos.length === 0) {
    return (
      <p
        className={`rounded-xl border-2 border-dashed border-slate-300 p-8 text-center text-sm dark:border-slate-700 ${claseTextoSuave}`}
      >
        No hay movimientos para mostrar con estos filtros.
      </p>
    )
  }

  function confirmarEliminar(movimiento: Movimiento) {
    const nombre = movimiento.descripcion || movimiento.categoria
    if (window.confirm(`¿Eliminar "${nombre}"?`)) eliminar(movimiento.id)
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60 dark:divide-slate-800 dark:bg-slate-900 dark:ring-slate-800">
      {movimientos.map((m) => {
        const esGasto = m.tipo === 'gasto'
        return (
          <li
            key={m.id}
            className="flex flex-wrap items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full text-lg font-bold ${
                esGasto
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                  : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
              }`}
              aria-hidden
            >
              {esGasto ? '−' : '+'}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{m.descripcion || m.categoria}</p>
              <p className={`text-xs ${claseTextoSuave}`}>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">{m.categoria}</span>
                <span className="ml-2">{formatearFecha(m.fecha)}</span>
              </p>
            </div>

            <p
              className={`font-semibold tabular-nums ${
                esGasto ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {esGasto ? '−' : '+'} {formatearMonto(m.monto)}
            </p>

            <div className="flex gap-1">
              <button
                onClick={() => onEditar(m)}
                className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-800"
              >
                Editar
              </button>
              <button
                onClick={() => confirmarEliminar(m)}
                className="rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-slate-800"
              >
                Eliminar
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
