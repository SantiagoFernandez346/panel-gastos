import type { NuevoMovimiento, Presupuesto } from '../types'
import { mesesAnteriores } from '../utils/format'

/** Seis meses de datos inventados, para que el panel y los gráficos se vean completos */
export function crearMovimientosDeEjemplo(mesFinal: string): NuevoMovimiento[] {
  const meses = mesesAnteriores(mesFinal, 6)
  const datos: NuevoMovimiento[] = []

  meses.forEach((mes, i) => {
    const fecha = (dia: number) => `${mes}-${String(dia).padStart(2, '0')}`
    const ajuste = 1 + i * 0.03 // simula una suba de precios mes a mes
    const monto = (base: number) => Math.round(base * ajuste)

    datos.push(
      { tipo: 'ingreso', monto: monto(850000), categoria: 'Sueldo', fecha: fecha(1), descripcion: 'Sueldo del mes' },
      { tipo: 'gasto', monto: monto(320000), categoria: 'Alquiler', fecha: fecha(2), descripcion: 'Alquiler del depto' },
      { tipo: 'gasto', monto: monto(45800 + (i % 3) * 4000), categoria: 'Servicios', fecha: fecha(5), descripcion: 'Luz, gas e internet' },
      { tipo: 'gasto', monto: monto(98500 + (i % 2) * 22000), categoria: 'Comida', fecha: fecha(6), descripcion: 'Supermercado' },
      { tipo: 'gasto', monto: monto(28000), categoria: 'Transporte', fecha: fecha(8), descripcion: 'Carga SUBE' },
      { tipo: 'gasto', monto: monto(15990), categoria: 'Ocio', fecha: fecha(12), descripcion: 'Suscripción de streaming' },
    )

    if (i % 2 === 1) {
      datos.push({ tipo: 'ingreso', monto: monto(120000 + i * 15000), categoria: 'Freelance', fecha: fecha(10), descripcion: 'Proyecto freelance' })
    }
    if (i % 3 === 0) {
      datos.push({ tipo: 'gasto', monto: monto(62000), categoria: 'Ropa', fecha: fecha(15), descripcion: 'Zapatillas' })
    }
    if (i === meses.length - 1) {
      datos.push(
        { tipo: 'gasto', monto: 36000, categoria: 'Educación', fecha: fecha(14), descripcion: 'Curso online' },
        { tipo: 'gasto', monto: 41000, categoria: 'Comida', fecha: fecha(16), descripcion: 'Salida a comer' },
        { tipo: 'gasto', monto: 18500, categoria: 'Ocio', fecha: fecha(13), descripcion: 'Entradas de cine' },
      )
    }
  })

  return datos
}

export const PRESUPUESTOS_DE_EJEMPLO: Presupuesto[] = [
  // Montos elegidos para que se vean los tres estados: ok, cerca y excedido
  { categoria: 'Comida', monto: 250000 },
  { categoria: 'Transporte', monto: 35000 },
  { categoria: 'Ocio', monto: 30000 },
]
