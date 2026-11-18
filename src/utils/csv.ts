import type { Movimiento } from '../types'

const SEPARADOR = ';' // Excel en español usa ";" porque la coma es el decimal

function escaparCampo(valor: string): string {
  return /[";\r\n]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor
}

export function movimientosACsv(movimientos: Movimiento[]): string {
  const encabezado = ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto']
  const filas = movimientos.map((m) => [
    m.fecha,
    m.tipo,
    m.categoria,
    m.descripcion,
    m.monto.toFixed(2).replace('.', ','),
  ])

  return [encabezado, ...filas]
    .map((fila) => fila.map(escaparCampo).join(SEPARADOR))
    .join('\r\n')
}

/** Descarga un texto como archivo .csv desde el navegador */
export function descargarCsv(contenido: string, nombreArchivo: string): void {
  // El BOM (﻿) hace que Excel muestre bien los acentos
  const blob = new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(url)
}
