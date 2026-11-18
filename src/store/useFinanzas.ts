import { create } from 'zustand'
import type { Movimiento, NuevoMovimiento, Presupuesto } from '../types'
import type { Repositorio } from '../data/repositorio'
import { crearMovimientosDeEjemplo, PRESUPUESTOS_DE_EJEMPLO } from '../data/ejemplo'
import { mesActual } from '../utils/format'

interface EstadoFinanzas {
  repo: Repositorio | null
  movimientos: Movimiento[]
  presupuestos: Presupuesto[]
  cargando: boolean
  error: string | null

  /** Conecta el store con una fuente de datos (local o Supabase) y carga todo */
  iniciar: (repo: Repositorio) => Promise<void>
  agregar: (datos: NuevoMovimiento) => Promise<boolean>
  editar: (id: string, datos: NuevoMovimiento) => Promise<boolean>
  eliminar: (id: string) => Promise<boolean>
  cargarEjemplo: () => Promise<boolean>
  guardarPresupuesto: (presupuesto: Presupuesto) => Promise<boolean>
  eliminarPresupuesto: (categoria: string) => Promise<boolean>
  limpiarError: () => void
}

export const useFinanzas = create<EstadoFinanzas>()((set, get) => {
  /** Corre una acción contra el repositorio y guarda el error si falla */
  async function ejecutar(accion: (repo: Repositorio) => Promise<void>): Promise<boolean> {
    const repo = get().repo
    if (!repo) return false
    try {
      await accion(repo)
      return true
    } catch (e) {
      set({ error: mensajeDeError(e) })
      return false
    }
  }

  return {
    repo: null,
    movimientos: [],
    presupuestos: [],
    cargando: false,
    error: null,

    iniciar: async (repo) => {
      set({ repo, cargando: true, error: null, movimientos: [], presupuestos: [] })
      try {
        const [movimientos, presupuestos] = await Promise.all([
          repo.listarMovimientos(),
          repo.listarPresupuestos(),
        ])
        // Si mientras cargaba se cambió de repositorio, descartamos el resultado
        if (get().repo === repo) set({ movimientos, presupuestos })
      } catch (e) {
        set({ error: mensajeDeError(e) })
      } finally {
        if (get().repo === repo) set({ cargando: false })
      }
    },

    agregar: (datos) =>
      ejecutar(async (repo) => {
        const nuevo = await repo.agregarMovimiento(datos)
        set((s) => ({ movimientos: [...s.movimientos, nuevo] }))
      }),

    editar: (id, datos) =>
      ejecutar(async (repo) => {
        const editado = await repo.editarMovimiento(id, datos)
        set((s) => ({ movimientos: s.movimientos.map((m) => (m.id === id ? editado : m)) }))
      }),

    eliminar: (id) =>
      ejecutar(async (repo) => {
        await repo.eliminarMovimiento(id)
        set((s) => ({ movimientos: s.movimientos.filter((m) => m.id !== id) }))
      }),

    cargarEjemplo: () =>
      ejecutar(async (repo) => {
        const nuevos = await repo.agregarVarios(crearMovimientosDeEjemplo(mesActual()))
        if (get().presupuestos.length === 0) {
          await Promise.all(PRESUPUESTOS_DE_EJEMPLO.map((p) => repo.guardarPresupuesto(p)))
          set({ presupuestos: PRESUPUESTOS_DE_EJEMPLO })
        }
        set((s) => ({ movimientos: [...s.movimientos, ...nuevos] }))
      }),

    guardarPresupuesto: (presupuesto) =>
      ejecutar(async (repo) => {
        await repo.guardarPresupuesto(presupuesto)
        set((s) => ({
          presupuestos: [
            ...s.presupuestos.filter((p) => p.categoria !== presupuesto.categoria),
            presupuesto,
          ],
        }))
      }),

    eliminarPresupuesto: (categoria) =>
      ejecutar(async (repo) => {
        await repo.eliminarPresupuesto(categoria)
        set((s) => ({ presupuestos: s.presupuestos.filter((p) => p.categoria !== categoria) }))
      }),

    limpiarError: () => set({ error: null }),
  }
})

function mensajeDeError(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
    return e.message
  }
  return 'Ocurrió un error inesperado. Probá de nuevo.'
}
