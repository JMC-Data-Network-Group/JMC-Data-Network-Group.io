import type { ReactNode } from 'react'

/** Contenedor de un visual: título centrado, borde redondeado y sombra (como el contenedor de Power BI). */
export function VisualCard({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`demo-visual ${className}`}>
      <h3 className="demo-visual-title">{title}</h3>
      <div className="demo-visual-body">{children}</div>
    </section>
  )
}

export type Kpi = { label: string; value: string; accent: string; hint?: string }

/** Equivale al visual "Tarjeta" de 2×2 con Ingresos, Costo, Utilidad y Margen. */
export function KpiGrid({ items }: { items: Kpi[] }) {
  return (
    <div className="demo-kpi-grid">
      {items.map((item) => (
        <div className="demo-kpi" key={item.label} style={{ ['--accent' as string]: item.accent }}>
          <span className="demo-kpi-label">{item.label}</span>
          <strong className="demo-kpi-value">{item.value}</strong>
          {item.hint && <small className="demo-kpi-hint">{item.hint}</small>}
        </div>
      ))}
    </div>
  )
}

export function EmptyState() {
  return <div className="demo-empty">Sin datos para los filtros seleccionados</div>
}
