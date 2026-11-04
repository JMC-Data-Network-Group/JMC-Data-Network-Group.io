import {
  clientes,
  cuentasPorCobrar,
  detalleVentas,
  productos,
  tiendas,
  ventas,
} from './data'

/* ------------------------------------------------------------------ */
/*  Formato                                                            */
/* ------------------------------------------------------------------ */

export function fmtMoney(value: number, decimals = 0): string {
  return (
    '$' +
    value.toLocaleString('es-MX', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )
}

export function fmtCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)} M`
  if (abs >= 1_000) return `$${+(value / 1_000).toFixed(1)} mil`
  return `$${value}`
}

export function fmtPercent(value: number, decimals = 1): string {
  return (value * 100).toLocaleString('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + '%'
}

/* ------------------------------------------------------------------ */
/*  Página 1 · Ingresos                                                */
/* ------------------------------------------------------------------ */

/** Línea de venta ya unida con venta → tienda y producto (equivale al modelo relacional de Power BI). */
export type LineaVenta = {
  tiendaId: number
  tienda: string
  ciudad: string
  region: string
  producto: string
  ingresos: number
  costo: number
}

const productoPorId = new Map(productos.map((p) => [p.id, p]))
const ventaPorId = new Map(ventas.map((v) => [v.id, v]))
const tiendaPorId = new Map(tiendas.map((t) => [t.id, t]))

export const lineasVenta: LineaVenta[] = detalleVentas.map((d) => {
  const venta = ventaPorId.get(d.ventaId)!
  const tienda = tiendaPorId.get(venta.tiendaId)!
  const producto = productoPorId.get(d.productoId)!
  return {
    tiendaId: tienda.id,
    tienda: tienda.nombre,
    ciudad: tienda.ciudad,
    region: tienda.region,
    producto: producto.nombre,
    // Ingresos Total = SUMX(detalle_ventas, cantidad * precio_unitario)
    ingresos: d.cantidad * d.precioUnitario,
    // Costo Total = SUM(detalle_ventas[Costo])
    costo: d.costo,
  }
})

export type Metricas = {
  ingresos: number
  costo: number
  utilidad: number
  margen: number
}

/** Ingresos Total, Costo Total, Utilidad = Ingresos − Costo, Margen = DIVIDE(Utilidad, Ingresos, 0) */
export function calcularMetricas(lineas: LineaVenta[]): Metricas {
  const ingresos = lineas.reduce((a, l) => a + l.ingresos, 0)
  const costo = lineas.reduce((a, l) => a + l.costo, 0)
  const utilidad = ingresos - costo
  return { ingresos, costo, utilidad, margen: ingresos === 0 ? 0 : utilidad / ingresos }
}

export type FiltrosIngresos = {
  regiones: string[]
  productos: string[]
}

/** Selección por clic en un visual (filtrado cruzado, como en Power BI). */
export type SeleccionIngresos =
  | { tipo: 'tienda'; valor: string }
  | { tipo: 'region'; valor: string }
  | null

export const filtrosIngresosIniciales: FiltrosIngresos = { regiones: [], productos: [] }

export function filtrarLineas(
  filtros: FiltrosIngresos,
  seleccion: SeleccionIngresos,
  /** Dimensión del propio visual: no se filtra por ella, se resalta. */
  ignorar?: 'tienda' | 'region',
): LineaVenta[] {
  return lineasVenta.filter((l) => {
    if (filtros.regiones.length && !filtros.regiones.includes(l.region)) return false
    if (filtros.productos.length && !filtros.productos.includes(l.producto)) return false
    if (seleccion && seleccion.tipo !== ignorar) {
      if (seleccion.tipo === 'tienda' && l.tienda !== seleccion.valor) return false
      if (seleccion.tipo === 'region' && l.region !== seleccion.valor) return false
    }
    return true
  })
}

export type FilaTienda = Metricas & { tienda: string; ciudad: string; region: string }
export type FilaRegion = Metricas & { region: string }
export type FilaCiudad = Metricas & { ciudad: string; region: string; tiendas: string[] }

export function porTienda(lineas: LineaVenta[]): FilaTienda[] {
  const grupos = new Map<string, LineaVenta[]>()
  for (const l of lineas) grupos.set(l.tienda, [...(grupos.get(l.tienda) ?? []), l])
  return [...grupos.entries()]
    .map(([tienda, ls]) => ({ tienda, ciudad: ls[0].ciudad, region: ls[0].region, ...calcularMetricas(ls) }))
    .sort((a, b) => b.ingresos - a.ingresos)
}

export function porRegion(lineas: LineaVenta[]): FilaRegion[] {
  const grupos = new Map<string, LineaVenta[]>()
  for (const l of lineas) grupos.set(l.region, [...(grupos.get(l.region) ?? []), l])
  return [...grupos.entries()]
    .map(([region, ls]) => ({ region, ...calcularMetricas(ls) }))
    .sort((a, b) => b.ingresos - a.ingresos)
}

export function porCiudad(lineas: LineaVenta[]): FilaCiudad[] {
  const grupos = new Map<string, LineaVenta[]>()
  for (const l of lineas) grupos.set(l.ciudad, [...(grupos.get(l.ciudad) ?? []), l])
  return [...grupos.entries()].map(([ciudad, ls]) => ({
    ciudad,
    region: ls[0].region,
    tiendas: [...new Set(ls.map((l) => l.tienda))],
    ...calcularMetricas(ls),
  }))
}

export const opcionesRegion = [...new Set(tiendas.map((t) => t.region))].sort()
export const opcionesProducto = [...productos.map((p) => p.nombre)].sort()

/* ------------------------------------------------------------------ */
/*  Página 2 · Cuentas por cobrar                                      */
/* ------------------------------------------------------------------ */

export type Estado = 'Pagado' | 'Pendiente' | 'Vencido'

export type FilaCxC = {
  id: number
  clienteId: number
  cliente: string
  anio: string
  montoTotal: number
  saldoPendiente: number
  fechaVencimiento: string
  estado: Estado
}

export const filasCxC: FilaCxC[] = cuentasPorCobrar.map((c) => ({
  id: c.id,
  clienteId: c.clienteId,
  cliente: c.clienteNombre,
  anio: c.anio,
  montoTotal: c.montoTotal,
  saldoPendiente: c.saldoPendiente,
  fechaVencimiento: c.fechaVencimiento,
  estado: c.estado,
}))

export type FiltrosCxC = {
  /** Segmentador "Cliente": viene de la tabla clientes (id) */
  clientes: string[]
  /** Segmentador "Fecha de emisión": columna Año */
  anios: string[]
  estados: string[]
}

export const filtrosCxCIniciales: FiltrosCxC = { clientes: [], anios: [], estados: [] }

export type SeleccionCxC = { cliente: string } | null

export function filtrarCxC(
  filtros: FiltrosCxC,
  seleccion: SeleccionCxC,
  ignorarSeleccion = false,
): FilaCxC[] {
  return filasCxC.filter((f) => {
    if (filtros.clientes.length && !filtros.clientes.includes(String(f.clienteId))) return false
    if (filtros.anios.length && !filtros.anios.includes(f.anio)) return false
    if (filtros.estados.length && !filtros.estados.includes(f.estado)) return false
    if (seleccion && !ignorarSeleccion && f.cliente !== seleccion.cliente) return false
    return true
  })
}

const minTexto = (valores: string[]) => [...valores].sort()[0]

export type FilaClienteCxC = {
  cliente: string
  montoTotal: number
  saldoPendiente: number
  /** Min(fecha_vencimiento) */
  fechaLimite: string
  /** Min(estado) — igual que el tooltip de Power BI (mínimo alfabético) */
  estado: string
}

export function porClienteCxC(filas: FilaCxC[]): FilaClienteCxC[] {
  const grupos = new Map<string, FilaCxC[]>()
  for (const f of filas) grupos.set(f.cliente, [...(grupos.get(f.cliente) ?? []), f])
  return [...grupos.entries()]
    .map(([cliente, fs]) => ({
      cliente,
      montoTotal: fs.reduce((a, f) => a + f.montoTotal, 0),
      saldoPendiente: fs.reduce((a, f) => a + f.saldoPendiente, 0),
      fechaLimite: minTexto(fs.map((f) => f.fechaVencimiento)),
      estado: minTexto(fs.map((f) => f.estado)),
    }))
    .sort((a, b) => b.montoTotal - a.montoTotal)
}

export type FilaClienteAnio = {
  cliente: string
  anio: string
  montoTotal: number
  saldoPendiente: number
  fechaLimite: string
  estado: string
}

export function porClienteAnio(filas: FilaCxC[]): FilaClienteAnio[] {
  const grupos = new Map<string, FilaCxC[]>()
  for (const f of filas) {
    const key = `${f.cliente}|${f.anio}`
    grupos.set(key, [...(grupos.get(key) ?? []), f])
  }
  return [...grupos.values()]
    .map((fs) => ({
      cliente: fs[0].cliente,
      anio: fs[0].anio,
      montoTotal: fs.reduce((a, f) => a + f.montoTotal, 0),
      saldoPendiente: fs.reduce((a, f) => a + f.saldoPendiente, 0),
      fechaLimite: minTexto(fs.map((f) => f.fechaVencimiento)),
      estado: minTexto(fs.map((f) => f.estado)),
    }))
    .sort((a, b) => b.montoTotal - a.montoTotal)
}

export const opcionesCliente = clientes
  .map((c) => ({ value: String(c.id), label: c.nombre }))
  .sort((a, b) => a.label.localeCompare(b.label, 'es'))
export const opcionesAnio = [...new Set(filasCxC.map((f) => f.anio))].sort()
export const opcionesEstado: Estado[] = ['Pagado', 'Pendiente', 'Vencido']

export function fmtFecha(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
