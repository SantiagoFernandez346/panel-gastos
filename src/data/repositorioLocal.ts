import type { Movimiento, Presupuesto } from '../types'
import type { Repositorio } from './repositorio'

const CLAVE_MOVIMIENTOS = 'panel-gastos:movimientos'
const CLAVE_PRESUPUESTOS = 'panel-gastos:presupuestos'
/** Clave que usaba la primera versión de la app (Zustand persist) */
const CLAVE_VIEJA = 'panel-gastos'

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const texto = localStorage.getItem(clave)
    return texto ? (JSON.parse(texto) as T) : porDefecto
  } catch {
    return porDefecto
  }
}

function escribir(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // Sin espacio o localStorage bloqueado: los datos quedan solo en memoria
  }
}

function leerMovimientos(): Movimiento[] {
  const guardados = leer<Movimiento[] | null>(CLAVE_MOVIMIENTOS, null)
  if (guardados) return guardados

  // Migra los datos de la primera versión, si existen
  const viejo = leer<{ state?: { movimientos?: Movimiento[] } } | null>(CLAVE_VIEJA, null)
  return viejo?.state?.movimientos ?? []
}

/** Guarda todo en el localStorage del navegador. No necesita cuenta ni internet. */
export const repositorioLocal: Repositorio = {
  async listarMovimientos() {
    return leerMovimientos()
  },

  async agregarMovimiento(datos) {
    const nuevo = { ...datos, id: crypto.randomUUID() }
    escribir(CLAVE_MOVIMIENTOS, [...leerMovimientos(), nuevo])
    return nuevo
  },

  async agregarVarios(lista) {
    const nuevos = lista.map((datos) => ({ ...datos, id: crypto.randomUUID() }))
    escribir(CLAVE_MOVIMIENTOS, [...leerMovimientos(), ...nuevos])
    return nuevos
  },

  async editarMovimiento(id, datos) {
    const editado = { ...datos, id }
    escribir(
      CLAVE_MOVIMIENTOS,
      leerMovimientos().map((m) => (m.id === id ? editado : m)),
    )
    return editado
  },

  async eliminarMovimiento(id) {
    escribir(
      CLAVE_MOVIMIENTOS,
      leerMovimientos().filter((m) => m.id !== id),
    )
  },

  async listarPresupuestos() {
    return leer<Presupuesto[]>(CLAVE_PRESUPUESTOS, [])
  },

  async guardarPresupuesto(presupuesto) {
    const otros = leer<Presupuesto[]>(CLAVE_PRESUPUESTOS, []).filter(
      (p) => p.categoria !== presupuesto.categoria,
    )
    escribir(CLAVE_PRESUPUESTOS, [...otros, presupuesto])
  },

  async eliminarPresupuesto(categoria) {
    escribir(
      CLAVE_PRESUPUESTOS,
      leer<Presupuesto[]>(CLAVE_PRESUPUESTOS, []).filter((p) => p.categoria !== categoria),
    )
  },
}
