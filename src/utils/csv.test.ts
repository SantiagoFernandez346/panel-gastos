import { describe, expect, it } from 'vitest'
import { movimientosACsv } from './csv'

describe('movimientosACsv', () => {
  it('genera encabezado y una fila por movimiento, con coma decimal', () => {
    const csv = movimientosACsv([
      { id: '1', tipo: 'gasto', monto: 1500.5, categoria: 'Comida', fecha: '2026-11-10', descripcion: 'Super' },
    ])
    expect(csv.split('\r\n')).toEqual([
      'Fecha;Tipo;Categoría;Descripción;Monto',
      '2026-11-10;gasto;Comida;Super;1500,50',
    ])
  })

  it('escapa los campos que tienen ; o comillas', () => {
    const csv = movimientosACsv([
      { id: '1', tipo: 'gasto', monto: 10, categoria: 'Ocio', fecha: '2026-11-10', descripcion: 'Cine; "pochoclos"' },
    ])
    expect(csv).toContain('"Cine; ""pochoclos"""')
  })
})
