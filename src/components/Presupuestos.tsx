import { useState, type FormEvent } from 'react'
import { CATEGORIAS } from '../types'
import { useFinanzas } from '../store/useFinanzas'
import type { EstadoPresupuesto, ProgresoPresupuesto } from '../utils/calculos'
import { formatearMonto } from '../utils/format'
import { claseCampo, claseTarjeta, claseTextoSuave } from './estilos'

interface Props {
  progreso: ProgresoPresupuesto[]
  titulo: string
}

// El estado nunca se comunica solo con color: siempre lleva ícono y texto
const ESTILO_ESTADO: Record<EstadoPresupuesto, { barra: string; texto: string; icono: string }> = {
  ok: { barra: 'bg-indigo-500', texto: claseTextoSuave, icono: '✓' },
  cerca: { barra: 'bg-amber-500', texto: 'text-amber-700 dark:text-amber-400', icono: '⚠' },
  excedido: { barra: 'bg-rose-600', texto: 'text-rose-600 dark:text-rose-400', icono: '✕' },
}

function textoEstado(p: ProgresoPresupuesto): string {
  if (p.estado === 'excedido') return `Te pasaste por ${formatearMonto(p.gastado - p.limite)}`
  if (p.estado === 'cerca') return `Cerca del límite: quedan ${formatearMonto(p.limite - p.gastado)}`
  return `Quedan ${formatearMonto(p.limite - p.gastado)}`
}

export function Presupuestos({ progreso, titulo }: Props) {
  const guardar = useFinanzas((s) => s.guardarPresupuesto)
  const eliminar = useFinanzas((s) => s.eliminarPresupuesto)

  const [categoria, setCategoria] = useState(CATEGORIAS.gasto[0])
  const [monto, setMonto] = useState('')

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const montoNumero = Number(monto.replace(',', '.'))
    if (!montoNumero || montoNumero <= 0) return
    if (await guardar({ categoria, monto: montoNumero })) setMonto('')
  }

  return (
    <section className={`space-y-4 ${claseTarjeta}`}>
      <div>
        <h2 className="text-lg font-semibold">Presupuestos</h2>
        <p className={`text-xs first-letter:uppercase ${claseTextoSuave}`}>{titulo}</p>
      </div>

      {progreso.length === 0 && (
        <p className={`text-sm ${claseTextoSuave}`}>
          Poné un límite mensual a una categoría y te avisamos cuando te acerques.
        </p>
      )}

      <ul className="space-y-4">
        {progreso.map((p) => {
          const estilo = ESTILO_ESTADO[p.estado]
          return (
            <li key={p.categoria} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{p.categoria}</span>
                <span className={`tabular-nums ${claseTextoSuave}`}>
                  {formatearMonto(p.gastado)} / {formatearMonto(p.limite)}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(Math.min(p.porcentaje, 100))}
                aria-label={`${p.categoria}: ${Math.round(p.porcentaje)}% usado`}
              >
                <div
                  className={`h-full rounded-full ${estilo.barra}`}
                  style={{ width: `${Math.min(p.porcentaje, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className={estilo.texto}>
                  <span aria-hidden>{estilo.icono}</span> {textoEstado(p)}
                </span>
                <button
                  onClick={() => eliminar(p.categoria)}
                  className={`hover:text-rose-600 ${claseTextoSuave}`}
                  aria-label={`Quitar presupuesto de ${p.categoria}`}
                >
                  Quitar
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <form onSubmit={enviar} className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={`${claseCampo} min-w-0 flex-1`}
          aria-label="Categoría del presupuesto"
        >
          {CATEGORIAS.gasto.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="1000"
          placeholder="Límite"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className={`${claseCampo} w-28`}
          aria-label="Límite mensual"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          Guardar
        </button>
      </form>
    </section>
  )
}
