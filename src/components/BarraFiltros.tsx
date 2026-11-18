import { CATEGORIAS, type Filtros } from '../types'
import { mesActual } from '../utils/format'
import { claseCampo } from './estilos'

interface Props {
  filtros: Filtros
  onCambiar: (filtros: Filtros) => void
}

// Todas las categorías sin repetir ("Otros" está en ingresos y gastos)
const todasLasCategorias = [...new Set([...CATEGORIAS.gasto, ...CATEGORIAS.ingreso])]

export function BarraFiltros({ filtros, onCambiar }: Props) {
  const cambiar = (cambios: Partial<Filtros>) => onCambiar({ ...filtros, ...cambios })

  const categoriasDisponibles =
    filtros.tipo === 'todos' ? todasLasCategorias : CATEGORIAS[filtros.tipo]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="search"
        placeholder="Buscar..."
        value={filtros.busqueda}
        onChange={(e) => cambiar({ busqueda: e.target.value })}
        className={`${claseCampo} min-w-0 flex-1 basis-40`}
        aria-label="Buscar movimientos"
      />

      <input
        type="month"
        value={filtros.mes}
        onChange={(e) => cambiar({ mes: e.target.value })}
        className={claseCampo}
        aria-label="Mes"
      />

      <select
        value={filtros.tipo}
        onChange={(e) => cambiar({ tipo: e.target.value as Filtros['tipo'], categoria: '' })}
        className={claseCampo}
        aria-label="Tipo"
      >
        <option value="todos">Todos</option>
        <option value="gasto">Gastos</option>
        <option value="ingreso">Ingresos</option>
      </select>

      <select
        value={filtros.categoria}
        onChange={(e) => cambiar({ categoria: e.target.value })}
        className={claseCampo}
        aria-label="Categoría"
      >
        <option value="">Todas las categorías</option>
        {categoriasDisponibles.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={() =>
          onCambiar({ mes: filtros.mes ? '' : mesActual(), tipo: 'todos', categoria: '', busqueda: '' })
        }
        className="rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-800"
      >
        {filtros.mes ? 'Ver todos los meses' : 'Volver al mes actual'}
      </button>
    </div>
  )
}
