export type TipoMovimiento = 'ingreso' | 'gasto'

export interface Movimiento {
  id: string
  tipo: TipoMovimiento
  monto: number
  categoria: string
  /** Fecha en formato YYYY-MM-DD */
  fecha: string
  descripcion: string
}

export type NuevoMovimiento = Omit<Movimiento, 'id'>

/** Límite de gasto mensual para una categoría */
export interface Presupuesto {
  categoria: string
  monto: number
}

export interface Filtros {
  /** Mes en formato YYYY-MM, o '' para ver todos */
  mes: string
  tipo: TipoMovimiento | 'todos'
  categoria: string
  busqueda: string
}

export const CATEGORIAS: Record<TipoMovimiento, string[]> = {
  gasto: [
    'Comida',
    'Transporte',
    'Alquiler',
    'Servicios',
    'Salud',
    'Ocio',
    'Ropa',
    'Educación',
    'Otros',
  ],
  ingreso: ['Sueldo', 'Freelance', 'Ventas', 'Regalo', 'Otros'],
}
