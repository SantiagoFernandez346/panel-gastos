const formatoMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

const formatoCompacto = new Intl.NumberFormat('es-AR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatearMonto(monto: number): string {
  return formatoMoneda.format(monto)
}

/** Monto corto para los ejes de los gráficos: 850000 → "850 mil" */
export function formatearMontoCorto(monto: number): string {
  return formatoCompacto.format(monto)
}

/** Convierte "2026-11-17" en "17/11/2026" */
export function formatearFecha(fechaIso: string): string {
  const [anio, mes, dia] = fechaIso.split('-')
  return `${dia}/${mes}/${anio}`
}

/** Fecha de hoy en formato YYYY-MM-DD, usando la hora local */
export function hoyIso(): string {
  const hoy = new Date()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${hoy.getFullYear()}-${mes}-${dia}`
}

/** Mes actual en formato YYYY-MM */
export function mesActual(): string {
  return hoyIso().slice(0, 7)
}

/** Convierte "2026-11" en "noviembre de 2026" */
export function nombreMes(mes: string): string {
  const [anio, numeroMes] = mes.split('-').map(Number)
  return new Date(anio, numeroMes - 1, 1).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  })
}

/** Convierte "2026-11" en "nov" */
export function nombreMesCorto(mes: string): string {
  const [anio, numeroMes] = mes.split('-').map(Number)
  return new Date(anio, numeroMes - 1, 1)
    .toLocaleDateString('es-AR', { month: 'short' })
    .replace('.', '')
}

/**
 * Devuelve los últimos `cantidad` meses terminando en `mesFinal`,
 * del más viejo al más nuevo. Ej: ("2026-02", 3) → ["2025-12", "2026-01", "2026-02"]
 */
export function mesesAnteriores(mesFinal: string, cantidad: number): string[] {
  const [anio, mes] = mesFinal.split('-').map(Number)
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = new Date(anio, mes - 1 - (cantidad - 1 - i), 1)
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
  })
}
