'use client'

import type { ChartConfiguration } from 'chart.js'
import { useMemo } from 'react'
import {
  filtrarCxC,
  fmtFecha,
  fmtMoney,
  porClienteAnio,
  porClienteCxC,
  type FilaClienteAnio,
  type FiltrosCxC,
  type SeleccionCxC,
} from '@/lib/cocotai/metrics'
import { filasCxC } from '@/lib/cocotai/metrics'
import { ChartCanvas } from './chart-canvas'
import { colores, conAlfa, cursorPointer, type ActiveElement } from './chart-setup'
import { EmptyState, VisualCard } from './visual-card'

type Props = {
  filtros: FiltrosCxC
  seleccion: SeleccionCxC
  onSeleccion: (next: SeleccionCxC) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConfig = ChartConfiguration<any, any, any>

/** Color estable por cliente (no cambia al filtrar). */
const colorCliente = new Map(
  [...new Set(filasCxC.map((f) => f.cliente))].map((c, i) => [c, colores.serie[i % colores.serie.length]]),
)

export function CxCPage({ filtros, seleccion, onSeleccion }: Props) {
  // En esta página todos los visuales tienen al cliente como dimensión: la selección resalta, no filtra.
  const filas = useMemo(() => filtrarCxC(filtros, seleccion, true), [filtros, seleccion])
  const porCliente = useMemo(() => porClienteCxC(filas), [filas])
  const porClienteYAnio = useMemo(() => porClienteAnio(filas), [filas])
  const sel = seleccion?.cliente ?? null

  const alternar = (cliente: string) => onSeleccion(sel === cliente ? null : { cliente })
  const tono = (cliente: string, alfa = 0.3) => {
    const base = colorCliente.get(cliente) ?? '#118DFF'
    return !sel || sel === cliente ? base : conAlfa(base, alfa)
  }

  /* ---- Pastel: crédito total por cliente y año ---- */
  const pastel = useMemo<AnyConfig>(
    () => ({
      type: 'pie',
      data: {
        labels: porClienteYAnio.map((f) => `${f.cliente} (${f.anio})`),
        datasets: [
          {
            data: porClienteYAnio.map((f) => f.montoTotal),
            backgroundColor: porClienteYAnio.map((f) => tono(f.cliente)),
            borderColor: '#0c1624',
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        onClick: (_e: unknown, elementos: ActiveElement[]) => {
          if (elementos.length) alternar(porClienteYAnio[elementos[0].index].cliente)
          else onSeleccion(null)
        },
        onHover: cursorPointer,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (c: { dataIndex: number }) => {
                const f = porClienteYAnio[c.dataIndex]
                const total = porClienteYAnio.reduce((a, x) => a + x.montoTotal, 0)
                return [
                  ` Crédito Total: ${fmtMoney(f.montoTotal)} (${((f.montoTotal / total) * 100).toFixed(1)}%)`,
                  ` Crédito pendiente: ${fmtMoney(f.saldoPendiente)}`,
                ]
              },
            },
          },
        },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [porClienteYAnio, sel],
  )

  /* ---- Columnas: solicitantes principales ---- */
  const columnas = useMemo<AnyConfig>(() => {
    const etiquetas = porCliente.map((f) => f.cliente)
    return {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: 'Crédito solicitado',
            data: porCliente.map((f) => f.montoTotal),
            backgroundColor: etiquetas.map((c) => (!sel || sel === c ? colores.ingresos : conAlfa(colores.ingresos, 0.3))),
            borderRadius: 5,
          },
          {
            label: 'Crédito pendiente',
            data: porCliente.map((f) => f.saldoPendiente),
            backgroundColor: etiquetas.map((c) => (!sel || sel === c ? colores.estado.Vencido : conAlfa(colores.estado.Vencido, 0.3))),
            borderRadius: 5,
          },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        onClick: (_e: unknown, elementos: ActiveElement[]) => {
          if (elementos.length) alternar(etiquetas[elementos[0].index])
          else onSeleccion(null)
        },
        onHover: cursorPointer,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
                            generateLabels: () => [
                { text: 'Crédito solicitado', fillStyle: colores.ingresos, strokeStyle: colores.ingresos, pointStyle: 'rectRounded', hidden: false, datasetIndex: 0, fontColor: '#a9b5c5' },
                { text: 'Crédito pendiente', fillStyle: colores.estado.Vencido, strokeStyle: colores.estado.Vencido, pointStyle: 'rectRounded', hidden: false, datasetIndex: 1, fontColor: '#a9b5c5' },
              ],
            },
            onClick: () => undefined,
          },
          tooltip: {
            callbacks: {
              label: (c: { dataset: { label?: string }; parsed: { y: number } }) =>
                ` ${c.dataset.label}: ${fmtMoney(c.parsed.y)}`,
              afterBody: (items: { dataIndex: number }[]) => {
                if (!items.length) return []
                const f = porCliente[items[0].dataIndex]
                return [`Fecha límite de pago: ${fmtFecha(f.fechaLimite)}`, `Estado: ${f.estado}`]
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              callback: function (this: { getLabelForValue: (v: number) => string }, v: number | string) {
                const label = this.getLabelForValue(Number(v))
                return label.length > 18 ? `${label.slice(0, 17)}…` : label
              },
            },
          },
          y: { ticks: { callback: (v: number | string) => fmtMoney(Number(v)) }, grid: { color: 'rgb(255 255 255 / 6%)' } },
        },
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [porCliente, sel])

  /* ---- Treemap: crédito total por cliente → año ---- */
  const treemap = useMemo<AnyConfig>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const origen = (ctx: any): FilaClienteAnio | undefined => ctx.raw?._data?.children?.[0]
    return {
      type: 'treemap',
      data: {
        datasets: [
          {
            label: 'Crédito Total',
            tree: porClienteYAnio,
            key: 'montoTotal',
            groups: ['cliente', 'anio'],
            spacing: 1,
            borderWidth: 1,
            borderColor: '#0c1624',
            borderRadius: 4,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            backgroundColor: (ctx: any) => {
              const f = origen(ctx)
              if (!f) return 'transparent'
              const base = colorCliente.get(f.cliente) ?? '#118DFF'
              const atenuado = sel && sel !== f.cliente
              // Nivel 0 = contenedor del cliente, nivel 1 = año
              if (ctx.raw.l === 0) return conAlfa(base, atenuado ? 0.1 : 0.35)
              return conAlfa(base, atenuado ? 0.25 : 0.85)
            },
            captions: { display: true, color: '#f4f7fb', font: { size: 12, weight: 'bold' }, padding: 5 },
            labels: {
              display: true,
              color: '#ffffff',
              font: [{ size: 12, weight: 'bold' }, { size: 11 }],
              position: 'middle',
              overflow: 'fit',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter: (ctx: any) => {
                const f = origen(ctx)
                return f ? [`${f.anio}`, fmtMoney(ctx.raw.v)] : ''
              },
            },
          },
        ],
      },
      options: {
        onClick: (_e: unknown, elementos: ActiveElement[], chart: { data: { datasets: { data: { _data?: { children?: FilaClienteAnio[] } }[] }[] } }) => {
          const el = elementos[0]
          if (!el) return onSeleccion(null)
          const f = chart.data.datasets[0].data[el.index]?._data?.children?.[0]
          if (f) alternar(f.cliente)
        },
        onHover: cursorPointer,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              title: (items: any[]) => {
                const f = items[0] && origen({ raw: items[0].raw })
                return f ? (items[0].raw.l === 0 ? f.cliente : `${f.cliente} · ${f.anio}`) : ''
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label: (c: any) => {
                const hijos: FilaClienteAnio[] = c.raw?._data?.children ?? []
                if (!hijos.length) return ''
                const total = hijos.reduce((a, h) => a + h.montoTotal, 0)
                const pend = hijos.reduce((a, h) => a + h.saldoPendiente, 0)
                const fecha = hijos.map((h) => h.fechaLimite).sort()[0]
                const estado = hijos.map((h) => h.estado).sort()[0]
                return [
                  ` Crédito Total: ${fmtMoney(total)}`,
                  ` Crédito pendiente: ${fmtMoney(pend)}`,
                  ` Fecha límite de pago: ${fmtFecha(fecha)}`,
                  ` Estado: ${estado}`,
                ]
              },
            },
          },
        },
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [porClienteYAnio, sel])

  /* ---- Tabla ---- */
  const totales = {
    monto: porClienteYAnio.reduce((a, f) => a + f.montoTotal, 0),
    pendiente: porClienteYAnio.reduce((a, f) => a + f.saldoPendiente, 0),
  }
  const sinDatos = porClienteYAnio.length === 0

  return (
    <div className="demo-grid demo-grid--cxc">
      <VisualCard title="Crédito total a clientes">
        {sinDatos ? <EmptyState /> : <ChartCanvas ariaLabel="Crédito total por cliente y año" config={pastel} />}
      </VisualCard>

      <VisualCard title="Solicitantes principales">
        {sinDatos ? <EmptyState /> : <ChartCanvas ariaLabel="Crédito solicitado y pendiente por cliente" config={columnas} />}
      </VisualCard>

      <VisualCard title="Crédito total a clientes">
        {sinDatos ? (
          <EmptyState />
        ) : (
          <div className="demo-table-wrap">
            <table className="demo-table">
              <thead>
                <tr>
                  <th>Clientes</th>
                  <th>Año</th>
                  <th>Crédito Total</th>
                  <th>Crédito pendiente</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {porClienteYAnio.map((f) => (
                  <tr
                    aria-selected={sel === f.cliente}
                    className={`is-clickable${sel === f.cliente ? ' is-selected' : ''}`}
                    key={`${f.cliente}-${f.anio}`}
                    onClick={() => alternar(f.cliente)}
                  >
                    <td>{f.cliente}</td>
                    <td>{f.anio}</td>
                    <td>{fmtMoney(f.montoTotal)}</td>
                    <td>{fmtMoney(f.saldoPendiente)}</td>
                    <td>
                      <span className="demo-pill" style={{ ['--pill' as string]: colores.estado[f.estado] ?? '#8d9aac' }}>
                        {f.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td />
                  <td>{fmtMoney(totales.monto)}</td>
                  <td>{fmtMoney(totales.pendiente)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </VisualCard>

      <VisualCard title="Crédito total a clientes (detallado)">
        {sinDatos ? <EmptyState /> : <ChartCanvas ariaLabel="Mapa de árbol de crédito por cliente y año" config={treemap} />}
      </VisualCard>
    </div>
  )
}
