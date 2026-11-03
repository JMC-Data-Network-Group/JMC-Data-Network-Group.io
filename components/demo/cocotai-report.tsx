'use client'

import { ArrowLeft, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import {
  filtrosCxCIniciales,
  filtrosIngresosIniciales,
  opcionesAnio,
  opcionesCliente,
  opcionesEstado,
  opcionesProducto,
  opcionesRegion,
  type FiltrosCxC,
  type FiltrosIngresos,
  type SeleccionCxC,
  type SeleccionIngresos,
} from '@/lib/cocotai/metrics'
import { BrandLockup } from '../brand-lockup'
import { CxCPage } from './cxc-page'
import { IngresosPage } from './ingresos-page'
import { Slicer } from './slicer'

type PaginaId = 'ingresos' | 'cxc'

const paginas: { id: PaginaId; etiqueta: string; titulo: string }[] = [
  { id: 'ingresos', etiqueta: 'Ingresos', titulo: 'Reporte de ingresos 2025-2026' },
  { id: 'cxc', etiqueta: 'Cuentas por cobrar', titulo: 'Cuentas por cobrar 2025-2026' },
]

const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }))

export function CocotaiReport() {
  const [pagina, setPagina] = useState<PaginaId>('ingresos')

  // El estado vive aquí (no en cada página) para conservar filtros al cambiar de pestaña, como en Power BI.
  const [filtrosIngresos, setFiltrosIngresos] = useState<FiltrosIngresos>(filtrosIngresosIniciales)
  const [seleccionIngresos, setSeleccionIngresos] = useState<SeleccionIngresos>(null)
  const [filtrosCxC, setFiltrosCxC] = useState<FiltrosCxC>(filtrosCxCIniciales)
  const [seleccionCxC, setSeleccionCxC] = useState<SeleccionCxC>(null)

  const actual = paginas.find((p) => p.id === pagina)!

  const hayFiltros =
    pagina === 'ingresos'
      ? filtrosIngresos.regiones.length + filtrosIngresos.productos.length > 0 || seleccionIngresos !== null
      : filtrosCxC.clientes.length + filtrosCxC.anios.length + filtrosCxC.estados.length > 0 || seleccionCxC !== null

  // Botón "Reset": equivale al marcador (bookmark) por defecto de cada página.
  function reset() {
    if (pagina === 'ingresos') {
      setFiltrosIngresos(filtrosIngresosIniciales)
      setSeleccionIngresos(null)
    } else {
      setFiltrosCxC(filtrosCxCIniciales)
      setSeleccionCxC(null)
    }
  }

  return (
    <section aria-labelledby="demo-title" className="demo-section" id="demo">
      <div className="demo-page">
      <main className="site-shell demo-main">
        <div className="demo-intro">
          <p className="hero-eyebrow">
            <span aria-hidden="true" className="hero-eyebrow-dot" />
            DEMO · REPORTE INTERACTIVO
          </p>
          <p className="demo-intro-copy">
            Simulación de un reporte Power BI. Usa los segmentadores o haz clic en cualquier barra,
            sector, burbuja o fila para filtrar los demás visuales.
          </p>
        </div>

        <div aria-label="Páginas del reporte" className="demo-tabs" role="tablist">
          {paginas.map((p) => (
            <button
              aria-selected={pagina === p.id}
              className={`demo-tab${pagina === p.id ? ' is-active' : ''}`}
              id={`tab-${p.id}`}
              key={p.id}
              onClick={() => setPagina(p.id)}
              role="tab"
              type="button"
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        <div
          aria-labelledby={`tab-${pagina}`}
          className="demo-report"
          id={`panel-${pagina}`}
          role="tabpanel"
        >
          <div className="demo-report-header">
            <Image
              alt="Logotipo COCOTAI"
              className="demo-logo"
              height={64}
              src="/demo/cocotai-logo.png"
              unoptimized
              width={64}
            />
            <h1 className="demo-report-title">{actual.titulo}</h1>

            <div className="demo-slicers">
              {pagina === 'ingresos' ? (
                <>
                  <Slicer
                    label="Región"
                    onChange={(regiones) => setFiltrosIngresos((f) => ({ ...f, regiones }))}
                    options={toOptions(opcionesRegion)}
                    selected={filtrosIngresos.regiones}
                  />
                  <Slicer
                    label="Producto"
                    onChange={(productos) => setFiltrosIngresos((f) => ({ ...f, productos }))}
                    options={toOptions(opcionesProducto)}
                    selected={filtrosIngresos.productos}
                  />
                </>
              ) : (
                <>
                  <Slicer
                    label="Cliente"
                    onChange={(clientes) => setFiltrosCxC((f) => ({ ...f, clientes }))}
                    options={opcionesCliente}
                    selected={filtrosCxC.clientes}
                  />
                  <Slicer
                    label="Fecha de emisión"
                    onChange={(anios) => setFiltrosCxC((f) => ({ ...f, anios }))}
                    options={toOptions(opcionesAnio)}
                    selected={filtrosCxC.anios}
                  />
                  <Slicer
                    label="Estado"
                    onChange={(estados) => setFiltrosCxC((f) => ({ ...f, estados }))}
                    options={toOptions(opcionesEstado)}
                    selected={filtrosCxC.estados}
                  />
                </>
              )}
              <button className="demo-reset" disabled={!hayFiltros} onClick={reset} type="button">
                <RotateCcw aria-hidden="true" size={15} /> Reset
              </button>
            </div>
          </div>

          {pagina === 'ingresos' ? (
            <IngresosPage filtros={filtrosIngresos} onSeleccion={setSeleccionIngresos} seleccion={seleccionIngresos} />
          ) : (
            <CxCPage filtros={filtrosCxC} onSeleccion={setSeleccionCxC} seleccion={seleccionCxC} />
          )}
        </div>

        {/*<p className="demo-footnote">*/}
        {/*  Datos del modelo <code>DEMO_2.pbix</code> (tablas ventas, detalle_ventas, tiendas, productos, clientes y*/}
        {/*  cuentas_por_cobrar). Medidas: Ingresos = Σ cantidad × precio unitario · Utilidad = Ingresos − Costo ·*/}
        {/*  Margen = Utilidad ÷ Ingresos.*/}
        {/*</p>*/}
      </main>
    </div>
    </section>
  )
}
