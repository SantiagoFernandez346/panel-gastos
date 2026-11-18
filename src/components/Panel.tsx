import { useEffect, useMemo, useState } from 'react'
import type { Filtros, Movimiento } from '../types'
import type { Repositorio } from '../data/repositorio'
import { useFinanzas } from '../store/useFinanzas'
import {
  calcularResumen,
  filtrarMovimientos,
  gastosPorCategoria,
  movimientosDelMes,
  progresoPresupuestos,
  totalesPorMes,
} from '../utils/calculos'
import { descargarCsv, movimientosACsv } from '../utils/csv'
import { mesActual, nombreMes } from '../utils/format'
import { Encabezado } from './Encabezado'
import { ResumenCards } from './ResumenCards'
import { FormularioMovimiento } from './FormularioMovimiento'
import { Presupuestos } from './Presupuestos'
import { GraficoCategorias, GraficoMensual } from './Graficos'
import { BarraFiltros } from './BarraFiltros'
import { ListaMovimientos } from './ListaMovimientos'
import { claseTextoSuave } from './estilos'

interface Props {
  repo: Repositorio
  email: string | null
  onSalir: (() => void) | null
}

export function Panel({ repo, email, onSalir }: Props) {
  const { movimientos, presupuestos, cargando, error, iniciar, cargarEjemplo, limpiarError } =
    useFinanzas()

  useEffect(() => {
    iniciar(repo)
  }, [repo, iniciar])

  const [filtros, setFiltros] = useState<Filtros>({
    mes: mesActual(),
    tipo: 'todos',
    categoria: '',
    busqueda: '',
  })
  const [editando, setEditando] = useState<Movimiento | null>(null)

  // Resumen, gráfico de categorías y presupuestos dependen solo del mes elegido
  const delMes = useMemo(() => movimientosDelMes(movimientos, filtros.mes), [movimientos, filtros.mes])
  const filtrados = useMemo(() => filtrarMovimientos(movimientos, filtros), [movimientos, filtros])
  const resumen = useMemo(() => calcularResumen(delMes), [delMes])
  const porCategoria = useMemo(() => gastosPorCategoria(delMes), [delMes])
  const porMes = useMemo(
    () => totalesPorMes(movimientos, filtros.mes || mesActual()),
    [movimientos, filtros.mes],
  )

  // Los presupuestos son mensuales: si se ven "todos los meses", usamos el actual
  const mesPresupuesto = filtros.mes || mesActual()
  const progreso = useMemo(
    () => progresoPresupuestos(movimientosDelMes(movimientos, mesPresupuesto), presupuestos),
    [movimientos, presupuestos, mesPresupuesto],
  )

  const titulo = filtros.mes ? nombreMes(filtros.mes) : 'Todos los meses'

  function exportar() {
    const sufijo = filtros.mes || 'todos'
    descargarCsv(movimientosACsv(filtrados), `movimientos-${sufijo}.csv`)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <Encabezado
        subtitulo={titulo}
        email={email}
        onSalir={onSalir}
        onExportar={exportar}
        puedeExportar={filtrados.length > 0}
        onCargarEjemplo={!cargando && movimientos.length === 0 ? cargarEjemplo : null}
      />

      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300"
        >
          <span>
            <strong>No se pudo completar la acción.</strong> {error}
          </span>
          <button onClick={limpiarError} aria-label="Cerrar aviso" className="font-bold">
            ×
          </button>
        </div>
      )}

      {cargando ? (
        <p className={`py-20 text-center ${claseTextoSuave}`}>Cargando tus datos...</p>
      ) : (
        <>
          <ResumenCards resumen={resumen} />

          <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
            <aside className="space-y-6">
              <FormularioMovimiento
                // La key reinicia el formulario cada vez que cambia lo que se edita
                key={editando?.id ?? 'nuevo'}
                editando={editando}
                onTerminar={() => setEditando(null)}
              />
              <Presupuestos progreso={progreso} titulo={nombreMes(mesPresupuesto)} />
            </aside>

            <div className="min-w-0 space-y-6">
              <div className="grid gap-6 xl:grid-cols-2">
                <GraficoMensual datos={porMes} />
                <GraficoCategorias datos={porCategoria} titulo={titulo} />
              </div>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold">Movimientos</h2>
                <BarraFiltros filtros={filtros} onCambiar={setFiltros} />
                <p className={`text-xs ${claseTextoSuave}`}>
                  {filtrados.length} {filtrados.length === 1 ? 'movimiento' : 'movimientos'}
                </p>
                <ListaMovimientos movimientos={filtrados} onEditar={setEditando} />
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
