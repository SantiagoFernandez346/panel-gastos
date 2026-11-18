import { describe, expect, it } from 'vitest'
import { formatearFecha, formatearMonto, mesesAnteriores } from './format'

describe('formatearMonto', () => {
  it('usa el formato argentino', () => {
    expect(formatearMonto(1234.5)).toMatch(/\$\s?1\.234,50/)
  })
})

describe('formatearFecha', () => {
  it('convierte de ISO a día/mes/año', () => {
    expect(formatearFecha('2026-11-07')).toBe('07/11/2026')
  })
})

describe('mesesAnteriores', () => {
  it('cruza correctamente el cambio de año', () => {
    expect(mesesAnteriores('2026-02', 4)).toEqual(['2025-11', '2025-12', '2026-01', '2026-02'])
  })
})
