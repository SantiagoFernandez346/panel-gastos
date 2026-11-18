import type { Resumen } from '../utils/calculos'
import { formatearMonto } from '../utils/format'
import { claseTextoSuave } from './estilos'

interface Props {
  resumen: Resumen
}

export function ResumenCards({ resumen }: Props) {
  const tarjetas = [
    { titulo: 'Ingresos', valor: resumen.ingresos, color: 'text-emerald-600 dark:text-emerald-400', borde: 'border-emerald-500' },
    { titulo: 'Gastos', valor: resumen.gastos, color: 'text-rose-600 dark:text-rose-400', borde: 'border-rose-500' },
    {
      titulo: 'Saldo',
      valor: resumen.saldo,
      color: resumen.saldo >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400',
      borde: 'border-indigo-500',
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {tarjetas.map((t) => (
        <article
          key={t.titulo}
          className={`rounded-xl border-l-4 ${t.borde} bg-white p-5 shadow-sm dark:bg-slate-900`}
        >
          <p className={`text-sm font-medium ${claseTextoSuave}`}>{t.titulo}</p>
          <p className={`mt-1 text-2xl font-bold ${t.color}`}>{formatearMonto(t.valor)}</p>
        </article>
      ))}
    </section>
  )
}
