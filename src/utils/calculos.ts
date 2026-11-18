import type { Filtros, Movimiento, Presupuesto } from '../types'
import { mesesAnteriores, nombreMesCorto } from './format'

export interface Resumen {
  ingresos: number
  gastos: number
  saldo: number
}

export function calcularResumen(movimientos: Movimiento[]): Resumen {
  let ingresos = 0
  let gastos = 0

  for (const movimiento of movimientos) {
    if (movimiento.tipo === 'ingreso') ingresos += movimiento.monto
    else gastos += movimiento.monto
  }

  return { ingresos, gastos, saldo: ingresos - gastos }
}

export function filtrarMovimientos(
  movimientos: Movimiento[],
  filtros: Filtros,
): Movimiento[] {
  const busqueda = filtros.busqueda.trim().toLowerCase()

  return movimientos
    .filter((m) => !filtros.mes || m.fecha.startsWith(filtros.mes))
    .filter((m) => filtros.tipo === 'todos' || m.tipo === filtros.tipo)
    .filter((m) => !filtros.categoria || m.categoria === filtros.categoria)
    .filter(
      (m) =>
        !busqueda ||
        m.descripcion.toLowerCase().includes(busqueda) ||
        m.categoria.toLowerCase().includes(busqueda),
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
}

/** Movimientos de un mes (YYYY-MM). Con '' devuelve todos. */
export function movimientosDelMes(movimientos: Movimiento[], mes: string): Movimiento[] {
  return mes ? movimientos.filter((m) => m.fecha.startsWith(mes)) : movimientos
}

export interface TotalCategoria {
  categoria: string
  total: number
}

/** Total gastado por categoría, de mayor a menor */
export function gastosPorCategoria(movimientos: Movimiento[]): TotalCategoria[] {
  const totales = new Map<string, number>()

  for (const m of movimientos) {
    if (m.tipo !== 'gasto') continue
    totales.set(m.categoria, (totales.get(m.categoria) ?? 0) + m.monto)
  }

  return [...totales]
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total)
}

export interface TotalMes {
  mes: string
  etiqueta: string
  ingresos: number
  gastos: number
}

/** Ingresos y gastos de los últimos `cantidad` meses, terminando en `mesFinal` */
export function totalesPorMes(
  movimientos: Movimiento[],
  mesFinal: string,
  cantidad = 6,
): TotalMes[] {
  return mesesAnteriores(mesFinal, cantidad).map((mes) => {
    const { ingresos, gastos } = calcularResumen(movimientosDelMes(movimientos, mes))
    return { mes, etiqueta: nombreMesCorto(mes), ingresos, gastos }
  })
}

export type EstadoPresupuesto = 'ok' | 'cerca' | 'excedido'

export interface ProgresoPresupuesto {
  categoria: string
  limite: number
  gastado: number
  /** Porcentaje usado del límite (puede pasar de 100) */
  porcentaje: number
  estado: EstadoPresupuesto
}

/** A partir de este porcentaje avisamos que el usuario está cerca del límite */
export const UMBRAL_CERCA = 80

/** Compara lo gastado en el mes contra el límite de cada categoría */
export function progresoPresupuestos(
  movimientosMes: Movimiento[],
  presupuestos: Presupuesto[],
): ProgresoPresupuesto[] {
  const gastos = new Map(
    gastosPorCategoria(movimientosMes).map((g) => [g.categoria, g.total]),
  )

  return presupuestos
    .map((p) => {
      const gastado = gastos.get(p.categoria) ?? 0
      const porcentaje = p.monto > 0 ? (gastado / p.monto) * 100 : 0
      const estado: EstadoPresupuesto =
        porcentaje > 100 ? 'excedido' : porcentaje >= UMBRAL_CERCA ? 'cerca' : 'ok'
      return { categoria: p.categoria, limite: p.monto, gastado, porcentaje, estado }
    })
    .sort((a, b) => b.porcentaje - a.porcentaje)
}
