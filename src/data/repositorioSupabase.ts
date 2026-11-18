import type { SupabaseClient } from '@supabase/supabase-js'
import type { Movimiento, Presupuesto } from '../types'
import type { Repositorio } from './repositorio'

const COLUMNAS = 'id, tipo, monto, categoria, fecha, descripcion'

/** Postgres devuelve `numeric` que conviene pasar a número de JS */
function normalizar(fila: Movimiento): Movimiento {
  return { ...fila, monto: Number(fila.monto) }
}

/**
 * Guarda los datos en Supabase. Las políticas RLS de la base (ver
 * supabase/schema.sql) hacen que cada usuario vea solo sus propias filas.
 */
export function crearRepositorioSupabase(supabase: SupabaseClient): Repositorio {
  return {
    async listarMovimientos() {
      const { data, error } = await supabase
        .from('movimientos')
        .select(COLUMNAS)
        .order('fecha', { ascending: false })
      if (error) throw error
      return (data as Movimiento[]).map(normalizar)
    },

    async agregarMovimiento(datos) {
      const { data, error } = await supabase
        .from('movimientos')
        .insert(datos)
        .select(COLUMNAS)
        .single()
      if (error) throw error
      return normalizar(data as Movimiento)
    },

    async agregarVarios(lista) {
      const { data, error } = await supabase.from('movimientos').insert(lista).select(COLUMNAS)
      if (error) throw error
      return (data as Movimiento[]).map(normalizar)
    },

    async editarMovimiento(id, datos) {
      const { data, error } = await supabase
        .from('movimientos')
        .update(datos)
        .eq('id', id)
        .select(COLUMNAS)
        .single()
      if (error) throw error
      return normalizar(data as Movimiento)
    },

    async eliminarMovimiento(id) {
      const { error } = await supabase.from('movimientos').delete().eq('id', id)
      if (error) throw error
    },

    async listarPresupuestos() {
      const { data, error } = await supabase.from('presupuestos').select('categoria, monto')
      if (error) throw error
      return (data as Presupuesto[]).map((p) => ({ ...p, monto: Number(p.monto) }))
    },

    async guardarPresupuesto(presupuesto) {
      const { error } = await supabase
        .from('presupuestos')
        .upsert(presupuesto, { onConflict: 'user_id,categoria' })
      if (error) throw error
    },

    async eliminarPresupuesto(categoria) {
      const { error } = await supabase.from('presupuestos').delete().eq('categoria', categoria)
      if (error) throw error
    },
  }
}
