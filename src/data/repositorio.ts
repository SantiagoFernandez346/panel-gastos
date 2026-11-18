import type { Movimiento, NuevoMovimiento, Presupuesto } from '../types'

/**
 * Contrato de acceso a datos. La app no sabe si los datos están en el
 * navegador o en Supabase: solo habla con esta interfaz.
 */
export interface Repositorio {
  listarMovimientos(): Promise<Movimiento[]>
  agregarMovimiento(datos: NuevoMovimiento): Promise<Movimiento>
  agregarVarios(lista: NuevoMovimiento[]): Promise<Movimiento[]>
  editarMovimiento(id: string, datos: NuevoMovimiento): Promise<Movimiento>
  eliminarMovimiento(id: string): Promise<void>

  listarPresupuestos(): Promise<Presupuesto[]>
  guardarPresupuesto(presupuesto: Presupuesto): Promise<void>
  eliminarPresupuesto(categoria: string): Promise<void>
}
