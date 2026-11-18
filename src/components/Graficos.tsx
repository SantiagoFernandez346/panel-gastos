import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TotalCategoria, TotalMes } from '../utils/calculos'
import { formatearMonto, formatearMontoCorto } from '../utils/format'
import { claseTarjeta, claseTextoSuave } from './estilos'

const estiloEje = { fill: 'var(--grafico-eje)', fontSize: 12 }

const estiloTooltip = {
  contentStyle: {
    background: 'var(--tooltip-fondo)',
    border: '1px solid var(--tooltip-borde)',
    borderRadius: 8,
    fontSize: 13,
  },
  labelStyle: { color: 'var(--tooltip-texto)', fontWeight: 600 },
  cursor: { fill: 'var(--grafico-cursor)' },
}

function formatearTooltip(valor: unknown) {
  return formatearMonto(Number(valor))
}

interface PropsCategorias {
  datos: TotalCategoria[]
  titulo: string
}

/** Barras horizontales: con muchas categorías se leen mejor que un gráfico de torta */
export function GraficoCategorias({ datos, titulo }: PropsCategorias) {
  const alto = Math.max(160, datos.length * 34 + 16)

  return (
    <article className={claseTarjeta}>
      <h2 className="font-semibold">Gastos por categoría</h2>
      <p className={`mb-3 text-xs ${claseTextoSuave}`}>{titulo}</p>

      {datos.length === 0 ? (
        <SinDatos />
      ) : (
        <ResponsiveContainer width="100%" height={alto}>
          <BarChart data={datos} layout="vertical" margin={{ left: 0, right: 12 }} barCategoryGap={6}>
            <CartesianGrid horizontal={false} stroke="var(--grafico-grilla)" />
            <XAxis
              type="number"
              tickFormatter={formatearMontoCorto}
              tick={estiloEje}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="categoria"
              width={84}
              tick={estiloEje}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip {...estiloTooltip} formatter={formatearTooltip} />
            <Bar dataKey="total" name="Gastado" fill="var(--serie-gastos)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </article>
  )
}

interface PropsMensual {
  datos: TotalMes[]
}

export function GraficoMensual({ datos }: PropsMensual) {
  const hayDatos = datos.some((d) => d.ingresos > 0 || d.gastos > 0)

  return (
    <article className={claseTarjeta}>
      <h2 className="font-semibold">Ingresos vs. gastos</h2>
      <p className={`mb-3 text-xs ${claseTextoSuave}`}>Últimos 6 meses</p>

      {!hayDatos ? (
        <SinDatos />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={datos} margin={{ left: 0, right: 8 }} barGap={2}>
            <CartesianGrid vertical={false} stroke="var(--grafico-grilla)" />
            <XAxis dataKey="etiqueta" interval={0} tick={estiloEje} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={formatearMontoCorto}
              tick={estiloEje}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip {...estiloTooltip} formatter={formatearTooltip} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="ingresos" name="Ingresos" fill="var(--serie-ingresos)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos" name="Gastos" fill="var(--serie-gastos)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </article>
  )
}

function SinDatos() {
  return (
    <p className={`grid h-40 place-items-center text-sm ${claseTextoSuave}`}>
      Todavía no hay datos para graficar.
    </p>
  )
}
