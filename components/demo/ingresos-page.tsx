'use client'

import type { ChartConfiguration, Plugin } from 'chart.js'
import { useMemo } from 'react'
import { coordenadasCiudad, mexicoContorno, tiendas } from '@/lib/cocotai/data'
import {
  calcularMetricas,
  filtrarLineas,
  fmtCompact,
  fmtMoney,
  fmtPercent,
  porCiudad,
  porRegion,
  porTienda,
  type FiltrosIngresos,
  type SeleccionIngresos,
} from '@/lib/cocotai/metrics'
import { ChartCanvas } from './chart-canvas'
import { colores, conAlfa, cursorPointer, type ActiveElement } from './chart-setup'
import { EmptyState, KpiGrid, VisualCard } from './visual-card'

type Props = {
  filtros: FiltrosIngresos
  seleccion: SeleccionIngresos
  onSeleccion: (next: SeleccionIngresos) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConfig = ChartConfiguration<any, any, any>

/** Color estable por sucursal (no cambia al filtrar). */
const colorTienda = new Map(tiendas.map((t, i) => [t.nombre, colores.serie[i % colores.serie.length]]))

const textoCentral: Plugin = {
  id: 'centerText',
  afterDraw(chart, _args, opciones) {
    const { titulo, valor } = opciones as { titulo?: string; valor?: string }
    if (!valor) return
    const { ctx, chartArea } = chart
    const x = (chartArea.left + chartArea.right) / 2
    const y = (chartArea.top + chartArea.bottom) / 2
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#7d8a9c'
    ctx.font = '600 11px Arial, Helvetica, sans-serif'
    ctx.fillText(titulo ?? '', x, y - 14)
    ctx.fillStyle = '#f4f7fb'
    ctx.font = '700 22px Arial, Helvetica, sans-serif'
    ctx.fillText(valor, x, y + 8)
    ctx.restore()
  },
}
const pluginsDona = [textoCentral]

function mezclar(a: [number, number, number], b: [number, number, number], t: number) {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return `rgb(${c[0]} ${c[1]} ${c[2]})`
}

export function IngresosPage({ filtros, seleccion, onSeleccion }: Props) {
  /* ---- Datos: cada visual se filtra por todo, salvo por su propia dimensión (que se resalta) ---- */
  const lineasKpi = useMemo(() => filtrarLineas(filtros, seleccion), [filtros, seleccion])
  const lineasTienda = useMemo(() => filtrarLineas(filtros, seleccion, 'tienda'), [filtros, seleccion])
  const lineasRegion = useMemo(() => filtrarLineas(filtros, seleccion, 'region'), [filtros, seleccion])

  const kpi = useMemo(() => calcularMetricas(lineasKpi), [lineasKpi])
  const tiendasFilas = useMemo(() => porTienda(lineasTienda), [lineasTienda])
  const regionesFilas = useMemo(() => porRegion(lineasRegion), [lineasRegion])
  const ciudadesFilas = useMemo(() => porCiudad(lineasRegion), [lineasRegion])

  const tiendaSel = seleccion?.tipo === 'tienda' ? seleccion.valor : null
  const regionSel = seleccion?.tipo === 'region' ? seleccion.valor : null

  const alternarTienda = (valor: string) =>
    onSeleccion(tiendaSel === valor ? null : { tipo: 'tienda', valor })
  const alternarRegion = (valor: string) =>
    onSeleccion(regionSel === valor ? null : { tipo: 'region', valor })

  /* ---- Barras horizontales: ingresos / costo / utilidad por sucursal ---- */
  const barras = useMemo<AnyConfig>(() => {
    const etiquetas = tiendasFilas.map((f) => f.tienda)
    const tono = (base: string) =>
      etiquetas.map((e) => (!tiendaSel || e === tiendaSel ? base : conAlfa(base, 0.28)))
    return {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [
          { label: 'Ingresos Total', data: tiendasFilas.map((f) => f.ingresos), backgroundColor: tono(colores.ingresos), borderRadius: 4 },
          { label: 'Costo Total', data: tiendasFilas.map((f) => f.costo), backgroundColor: tono(colores.costo), borderRadius: 4 },
          { label: 'Utilidad', data: tiendasFilas.map((f) => f.utilidad), backgroundColor: tono(colores.utilidad), borderRadius: 4 },
        ],
      },
      options: {
        indexAxis: 'y',
        interaction: { mode: 'index', axis: 'y', intersect: false },
        onClick: (_e: unknown, elementos: ActiveElement[]) => {
          if (elementos.length) alternarTienda(etiquetas[elementos[0].index])
          else onSeleccion(null)
        },
        onHover: cursorPointer,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (c: { dataset: { label?: string }; parsed: { x: number } }) =>
                ` ${c.dataset.label}: ${fmtMoney(c.parsed.x)}`,
              afterBody: (items: { dataIndex: number }[]) =>
                items.length ? [`Margen: ${fmtPercent(tiendasFilas[items[0].dataIndex].margen)}`] : [],
            },
          },
        },
        scales: {
          x: { ticks: { maxRotation: 0, maxTicksLimit: 6, callback: (v: number | string) => fmtCompact(Number(v)) }, grid: { color: 'rgb(255 255 255 / 6%)' } },
          y: { grid: { display: false }, ticks: { callback: function (this: { getLabelForValue: (v: number) => string }, v: number | string) {
            return this.getLabelForValue(Number(v)).replace('Sucursal ', '')
          } } },
        },
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasFilas, tiendaSel])

  /* ---- Dona: ingresos por sucursal (tooltip con utilidad y margen) ---- */
  const dona = useMemo<AnyConfig>(() => {
    const etiquetas = tiendasFilas.map((f) => f.tienda)
    const total = tiendasFilas.reduce((a, f) => a + f.ingresos, 0)
    return {
      type: 'doughnut',
      data: {
        labels: etiquetas,
        datasets: [
          {
            data: tiendasFilas.map((f) => f.ingresos),
            backgroundColor: etiquetas.map((e) => {
              const base = colorTienda.get(e) ?? '#118DFF'
              return !tiendaSel || e === tiendaSel ? base : conAlfa(base, 0.28)
            }),
            borderColor: '#0c1624',
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: '62%',
        onClick: (_e: unknown, elementos: ActiveElement[]) => {
          if (elementos.length) alternarTienda(etiquetas[elementos[0].index])
          else onSeleccion(null)
        },
        onHover: cursorPointer,
        plugins: {
          centerText: { titulo: 'INGRESOS', valor: fmtMoney(total) },
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (c: { dataIndex: number; parsed: number }) => {
                const f = tiendasFilas[c.dataIndex]
                const pct = total ? ((c.parsed / total) * 100).toFixed(1) : '0'
                return [` Ingresos: ${fmtMoney(f.ingresos)} (${pct}%)`, ` Utilidad: ${fmtMoney(f.utilidad)}`, ` Margen: ${fmtPercent(f.margen)}`]
              },
            },
          },
        },
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasFilas, tiendaSel])

  /* ---- Columnas por región ---- */
  const columnas = useMemo<AnyConfig>(() => {
    const etiquetas = regionesFilas.map((f) => f.region)
    const tono = (base: string) =>
      etiquetas.map((e) => (!regionSel || e === regionSel ? base : conAlfa(base, 0.28)))
    return {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [
          { label: 'Ingresos Total', data: regionesFilas.map((f) => f.ingresos), backgroundColor: tono(colores.ingresos), borderRadius: 4 },
          { label: 'Costo Total', data: regionesFilas.map((f) => f.costo), backgroundColor: tono(colores.costo), borderRadius: 4 },
          { label: 'Utilidad', data: regionesFilas.map((f) => f.utilidad), backgroundColor: tono(colores.utilidad), borderRadius: 4 },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        onClick: (_e: unknown, elementos: ActiveElement[]) => {
          if (elementos.length) alternarRegion(etiquetas[elementos[0].index])
          else onSeleccion(null)
        },
        onHover: cursorPointer,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (c: { dataset: { label?: string }; parsed: { y: number } }) =>
                ` ${c.dataset.label}: ${fmtMoney(c.parsed.y)}`,
              afterBody: (items: { dataIndex: number }[]) =>
                items.length ? [`Margen: ${fmtPercent(regionesFilas[items[0].dataIndex].margen)}`] : [],
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: { ticks: { callback: (v: number | string) => fmtCompact(Number(v)) }, grid: { color: 'rgb(255 255 255 / 6%)' } },
        },
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionesFilas, regionSel])

  /* ---- Mapa: burbujas por ciudad (tamaño = utilidad, color = región) ---- */
  const mapa = useMemo<AnyConfig>(() => {
    const maxUtilidad = Math.max(1, ...ciudadesFilas.map((c) => c.utilidad))
    const regiones = [...new Set(ciudadesFilas.map((c) => c.region))]
    const contorno = (puntos: [number, number][], etiqueta: string) => ({
      type: 'line' as const,
      label: etiqueta,
      data: puntos.map(([x, y]) => ({ x, y })),
      borderColor: 'rgb(120 160 210 / 50%)',
      backgroundColor: 'rgb(20 42 68 / 45%)',
      borderWidth: 1.2,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0,
      order: 10,
    })
    return {
      type: 'bubble',
      data: {
        datasets: [
          contorno(mexicoContorno.continente, 'Contorno México'),
          contorno(mexicoContorno.baja, 'Contorno Baja California'),
          ...regiones.map((region) => {
            const base = colores.region[region] ?? '#118DFF'
            const atenuado = regionSel && regionSel !== region
            return {
              type: 'bubble' as const,
              label: region,
              data: ciudadesFilas
                .filter((c) => c.region === region)
                .map((c) => {
                  const coord = coordenadasCiudad[c.ciudad]
                  return {
                    x: coord.lon,
                    y: coord.lat,
                    r: 7 + 24 * Math.sqrt(Math.max(c.utilidad, 0) / maxUtilidad),
                    fila: c,
                  }
                }),
              backgroundColor: conAlfa(base, atenuado ? 0.12 : 0.6),
              borderColor: atenuado ? conAlfa(base, 0.3) : base,
              borderWidth: 1.5,
              hoverBorderWidth: 2.5,
            }
          }),
        ],
      },
      options: {
        interaction: { mode: 'nearest', intersect: true },
        layout: { padding: 8 },
        onClick: (_e: unknown, elementos: ActiveElement[], chart: { data: { datasets: { label?: string }[] } }) => {
          const el = elementos[0]
          if (!el) return onSeleccion(null)
          alternarRegion(chart.data.datasets[el.datasetIndex].label as string)
        },
        onHover: cursorPointer,
        scales: {
          x: { type: 'linear', min: -118.5, max: -86, display: false },
          y: { type: 'linear', min: 14, max: 33.5, display: false },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { filter: (item: { text: string }) => !item.text.startsWith('Contorno') },
          },
          tooltip: {
            filter: (item: { dataset: { label?: string } }) => !String(item.dataset.label).startsWith('Contorno'),
            callbacks: {
              title: (items: { raw: { fila?: { ciudad: string } } }[]) => items[0]?.raw?.fila?.ciudad ?? '',
              label: (c: { raw: { fila: { tiendas: string[]; region: string; utilidad: number; margen: number } } }) => {
                const f = c.raw.fila
                return [
                  ` Región: ${f.region}`,
                  ` Utilidad: ${fmtMoney(f.utilidad)}`,
                  ` Margen: ${fmtPercent(f.margen)}`,
                  ` Sucursales: ${f.tiendas.length}`,
                ]
              },
            },
          },
        },
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ciudadesFilas, regionSel])

  /* ---- Tabla con formato condicional en Margen ---- */
  const margenes = tiendasFilas.map((f) => f.margen)
  const mMin = Math.min(...margenes)
  const mMax = Math.max(...margenes)
  const colorMargen = (m: number) =>
    mMax === mMin ? '#5FFFA7' : mezclar([230, 143, 150], [95, 255, 167], (m - mMin) / (mMax - mMin))
  const totalTabla = calcularMetricas(lineasTienda)

  const sinDatos = tiendasFilas.length === 0

  return (
    <div className="demo-grid demo-grid--ingresos">
      <VisualCard className="demo-area-kpi" title="Resumen financiero">
        <KpiGrid
          items={[
            { label: 'Ingresos Total', value: fmtMoney(kpi.ingresos), accent: colores.ingresos },
            { label: 'Costo Total', value: fmtMoney(kpi.costo), accent: colores.costo },
            { label: 'Utilidad', value: fmtMoney(kpi.utilidad), accent: colores.utilidad },
            { label: 'Margen', value: fmtPercent(kpi.margen), accent: '#B5A1FF' },
          ]}
        />
      </VisualCard>

      <VisualCard title="Total utilidad por sucursal">
        {sinDatos ? <EmptyState /> : <ChartCanvas ariaLabel="Ingresos, costo y utilidad por sucursal" config={barras} />}
      </VisualCard>

      <VisualCard title="Total beneficio por sucursal">
        {sinDatos ? <EmptyState /> : <ChartCanvas ariaLabel="Participación de ingresos por sucursal" config={dona} plugins={pluginsDona} />}
      </VisualCard>

      <VisualCard title="Ingreso/Costo/utilidad">
        {sinDatos ? (
          <EmptyState />
        ) : (
          <div className="demo-table-wrap">
            <table className="demo-table">
              <thead>
                <tr>
                  <th>Sucursal</th>
                  <th>Ingresos</th>
                  <th>Costo</th>
                  <th>Utilidad</th>
                  <th>Margen</th>
                </tr>
              </thead>
              <tbody>
                {tiendasFilas.map((f) => (
                  <tr
                    aria-selected={tiendaSel === f.tienda}
                    className={`is-clickable${tiendaSel === f.tienda ? ' is-selected' : ''}`}
                    key={f.tienda}
                    onClick={() => alternarTienda(f.tienda)}
                  >
                    <td>{f.tienda}</td>
                    <td>{fmtMoney(f.ingresos)}</td>
                    <td>{fmtMoney(f.costo)}</td>
                    <td>{fmtMoney(f.utilidad)}</td>
                    <td className="demo-margin" style={{ color: colorMargen(f.margen) }}>
                      {fmtPercent(f.margen)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td>{fmtMoney(totalTabla.ingresos)}</td>
                  <td>{fmtMoney(totalTabla.costo)}</td>
                  <td>{fmtMoney(totalTabla.utilidad)}</td>
                  <td>{fmtPercent(totalTabla.margen)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </VisualCard>

      <VisualCard title="Métricas por región y ciudad">
        {sinDatos ? <EmptyState /> : <ChartCanvas ariaLabel="Mapa de México con utilidad por ciudad" config={mapa} />}
      </VisualCard>

      <VisualCard title="Total utilidad por región">
        {sinDatos ? <EmptyState /> : <ChartCanvas ariaLabel="Ingresos, costo y utilidad por región" config={columnas} />}
      </VisualCard>
    </div>
  )
}
