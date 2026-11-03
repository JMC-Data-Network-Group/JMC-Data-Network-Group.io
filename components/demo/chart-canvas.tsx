'use client'

import { Chart, type ChartConfiguration, type Plugin } from 'chart.js'
import { useEffect, useRef } from 'react'
import { setupChartJs } from './chart-setup'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConfig = ChartConfiguration<any, any, any>

type ChartCanvasProps = {
  config: AnyConfig
  /** Descripción accesible del gráfico */
  ariaLabel: string
  /** Plugins locales (por ejemplo, texto central de la dona) */
  plugins?: Plugin[]
}

/**
 * Monta un gráfico de Chart.js en un <canvas> y lo actualiza (sin recrearlo)
 * cuando cambian los datos o las opciones, de modo que los filtros animan en lugar de parpadear.
 */
export function ChartCanvas({ config, ariaLabel, plugins }: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const typeRef = useRef<string | null>(null)

  useEffect(() => {
    setupChartJs()
    const canvas = canvasRef.current
    if (!canvas) return

    // Si cambia el tipo de gráfico (no ocurre en esta demo) se recrea; si no, se actualiza.
    if (chartRef.current && typeRef.current !== String(config.type)) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    if (!chartRef.current) {
      chartRef.current = new Chart(canvas, {
        ...config,
        plugins: plugins ?? [],
        options: { responsive: true, maintainAspectRatio: false, ...config.options },
      })
      typeRef.current = String(config.type)
    } else {
      const chart = chartRef.current
      chart.data = config.data
      chart.options = { responsive: true, maintainAspectRatio: false, ...config.options }
      chart.update()
    }
  }, [config, plugins])

  useEffect(() => {
    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [])

  return (
    <div className="demo-chart">
      <canvas aria-label={ariaLabel} ref={canvasRef} role="img" />
    </div>
  )
}
