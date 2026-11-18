import { describe, expect, it } from 'vitest'
import type { Filtros, Movimiento } from '../types'
import {
  calcularResumen,
  filtrarMovimientos,
  gastosPorCategoria,
  progresoPresupuestos,
  totalesPorMes,
} from './calculos'

let siguienteId = 0
function mov(datos: Partial<Movimiento>): Movimiento {
  return {
    id: String(++siguienteId),
    tipo: 'gasto',
    monto: 100,
    categoria: 'Comida',
    fecha: '2026-11-10',
    descripcion: '',
    ...datos,
  }
}

const sinFiltros: Filtros = { mes: '', tipo: 'todos', categoria: '', busqueda: '' }

describe('calcularResumen', () => {
  it('suma ingresos y gastos y calcula el saldo', () => {
    const resumen = calcularResumen([
      mov({ tipo: 'ingreso', monto: 1000 }),
      mov({ tipo: 'gasto', monto: 300 }),
      mov({ tipo: 'gasto', monto: 200 }),
    ])
    expect(resumen).toEqual({ ingresos: 1000, gastos: 500, saldo: 500 })
  })

  it('devuelve ceros si no hay movimientos', () => {
    expect(calcularResumen([])).toEqual({ ingresos: 0, gastos: 0, saldo: 0 })
  })

  it('puede dar saldo negativo', () => {
    expect(calcularResumen([mov({ tipo: 'gasto', monto: 50 })]).saldo).toBe(-50)
  })
})

describe('filtrarMovimientos', () => {
  const lista = [
    mov({ fecha: '2026-10-05', categoria: 'Ocio', descripcion: 'Cine' }),
    mov({ fecha: '2026-11-20', categoria: 'Comida', descripcion: 'Supermercado' }),
    mov({ fecha: '2026-11-02', tipo: 'ingreso', categoria: 'Sueldo', descripcion: 'Sueldo' }),
  ]

  it('filtra por mes', () => {
    const resultado = filtrarMovimientos(lista, { ...sinFiltros, mes: '2026-11' })
    expect(resultado).toHaveLength(2)
  })

  it('filtra por tipo y categoría', () => {
    expect(filtrarMovimientos(lista, { ...sinFiltros, tipo: 'ingreso' })).toHaveLength(1)
    expect(filtrarMovimientos(lista, { ...sinFiltros, categoria: 'Ocio' })).toHaveLength(1)
  })

  it('busca sin importar mayúsculas, en descripción y categoría', () => {
    expect(filtrarMovimientos(lista, { ...sinFiltros, busqueda: 'SUPER' })[0].descripcion).toBe('Supermercado')
    expect(filtrarMovimientos(lista, { ...sinFiltros, busqueda: 'ocio' })).toHaveLength(1)
  })

  it('ordena del más nuevo al más viejo', () => {
    const fechas = filtrarMovimientos(lista, sinFiltros).map((m) => m.fecha)
    expect(fechas).toEqual(['2026-11-20', '2026-11-02', '2026-10-05'])
  })
})

describe('gastosPorCategoria', () => {
  it('agrupa solo gastos y ordena de mayor a menor', () => {
    const resultado = gastosPorCategoria([
      mov({ categoria: 'Comida', monto: 100 }),
      mov({ categoria: 'Ocio', monto: 500 }),
      mov({ categoria: 'Comida', monto: 150 }),
      mov({ tipo: 'ingreso', categoria: 'Sueldo', monto: 9999 }),
    ])
    expect(resultado).toEqual([
      { categoria: 'Ocio', total: 500 },
      { categoria: 'Comida', total: 250 },
    ])
  })
})

describe('totalesPorMes', () => {
  it('devuelve los últimos N meses, incluso los que no tienen datos', () => {
    const resultado = totalesPorMes(
      [mov({ fecha: '2026-01-15', monto: 300 }), mov({ fecha: '2025-12-01', tipo: 'ingreso', monto: 800 })],
      '2026-02',
      3,
    )
    expect(resultado.map((r) => r.mes)).toEqual(['2025-12', '2026-01', '2026-02'])
    expect(resultado.map((r) => [r.ingresos, r.gastos])).toEqual([
      [800, 0],
      [0, 300],
      [0, 0],
    ])
  })
})

describe('progresoPresupuestos', () => {
  const gastos = [
    mov({ categoria: 'Comida', monto: 50 }),
    mov({ categoria: 'Ocio', monto: 85 }),
    mov({ categoria: 'Transporte', monto: 120 }),
  ]

  it('marca el estado según el porcentaje usado', () => {
    const resultado = progresoPresupuestos(gastos, [
      { categoria: 'Comida', monto: 100 },
      { categoria: 'Ocio', monto: 100 },
      { categoria: 'Transporte', monto: 100 },
    ])
    const estados = Object.fromEntries(resultado.map((p) => [p.categoria, p.estado]))
    expect(estados).toEqual({ Comida: 'ok', Ocio: 'cerca', Transporte: 'excedido' })
  })

  it('ordena por porcentaje usado, de mayor a menor', () => {
    const resultado = progresoPresupuestos(gastos, [
      { categoria: 'Comida', monto: 100 },
      { categoria: 'Transporte', monto: 100 },
    ])
    expect(resultado[0].categoria).toBe('Transporte')
  })

  it('una categoría sin gastos queda en 0%', () => {
    const [salud] = progresoPresupuestos(gastos, [{ categoria: 'Salud', monto: 100 }])
    expect(salud).toMatchObject({ gastado: 0, porcentaje: 0, estado: 'ok' })
  })
})
