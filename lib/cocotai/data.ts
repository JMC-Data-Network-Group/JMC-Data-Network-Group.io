/**
 * Datos del modelo semántico de DEMO_2.pbix (esquema "cocotai").
 * Extraídos tal cual del archivo Power BI: 8 tablas de negocio.
 * Para conectar datos reales, reemplaza estos arreglos por una llamada a tu API / base de datos
 * manteniendo los mismos tipos: lib/cocotai/metrics.ts no necesita cambios.
 */

export type Tienda = { id: number; nombre: string; ciudad: string; region: string }
export type Producto = { id: number; nombre: string; categoriaId: number; precioCosto: number; precioVenta: number }
export type Cliente = { id: number; nombre: string; segmento: string; limiteCredito: number }
export type Venta = { id: number; tiendaId: number; clienteId: number; fecha: string; metodoPago: string; total: number }
export type DetalleVenta = {
  id: number
  ventaId: number
  productoId: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  /** Columna calculada del modelo: cantidad × precio_costo */
  costo: number
}
export type CuentaPorCobrar = {
  id: number
  clienteId: number
  ventaId: number
  montoTotal: number
  saldoPendiente: number
  anio: string
  fechaVencimiento: string
  estado: 'Pagado' | 'Pendiente' | 'Vencido'
  /** Columna "Clientes" de la tabla cuentas_por_cobrar (nombre tal como aparece en el reporte) */
  clienteNombre: string
}

export const tiendas: Tienda[] = [
  { id: 1, nombre: "Sucursal Monterrey Centro", ciudad: "Monterrey", region: "Norte" },
  { id: 2, nombre: "Sucursal San Pedro", ciudad: "San Pedro Garza Garcia", region: "Norte" },
  { id: 3, nombre: "Sucursal CDMX Polanco", ciudad: "CDMX", region: "Centro" },
  { id: 4, nombre: "Sucursal CDMX Santa Fe", ciudad: "CDMX", region: "Centro" },
  { id: 5, nombre: "Sucursal Guadalajara Minerva", ciudad: "Guadalajara", region: "Occidente" },
  { id: 6, nombre: "Sucursal Queretaro Antea", ciudad: "Queretaro", region: "Bajio" },
  { id: 7, nombre: "Sucursal Puebla Angelopolis", ciudad: "Puebla", region: "Centro" },
  { id: 8, nombre: "Sucursal Merida Altabrisa", ciudad: "Merida", region: "Sureste" },
]

export const productos: Producto[] = [
  { id: 1, nombre: "Laptop Pro 15\"", categoriaId: 1, precioCosto: 700.0, precioVenta: 1100.0 },
  { id: 2, nombre: "Laptop UltraSlim 13\"", categoriaId: 1, precioCosto: 550.0, precioVenta: 899.99 },
  { id: 3, nombre: "Desktop Workstation", categoriaId: 1, precioCosto: 950.0, precioVenta: 1450.0 },
  { id: 4, nombre: "Smartphone X 128GB", categoriaId: 2, precioCosto: 400.0, precioVenta: 650.0 },
  { id: 5, nombre: "Smartphone Pro Max", categoriaId: 2, precioCosto: 680.0, precioVenta: 1050.0 },
  { id: 6, nombre: "Tablet Air 10\"", categoriaId: 2, precioCosto: 220.0, precioVenta: 380.0 },
  { id: 7, nombre: "Refrigeradora Inverter 400L", categoriaId: 3, precioCosto: 500.0, precioVenta: 850.0 },
  { id: 8, nombre: "Lavadora Carga Frontal 15kg", categoriaId: 3, precioCosto: 420.0, precioVenta: 720.0 },
  { id: 9, nombre: "Microondas Digital 25L", categoriaId: 3, precioCosto: 65.0, precioVenta: 120.0 },
  { id: 10, nombre: "Audifonos Bluetooth Noise Cancelling", categoriaId: 4, precioCosto: 45.0, precioVenta: 99.99 },
  { id: 11, nombre: "Barra de Sonido 5.1", categoriaId: 4, precioCosto: 110.0, precioVenta: 210.0 },
  { id: 12, nombre: "Bocina Portatil Waterproof", categoriaId: 4, precioCosto: 28.0, precioVenta: 59.0 },
  { id: 13, nombre: "Monitor Gamer 27\" 144Hz", categoriaId: 5, precioCosto: 180.0, precioVenta: 299.0 },
  { id: 14, nombre: "Teclado Mecanico RGB", categoriaId: 5, precioCosto: 30.0, precioVenta: 65.0 },
  { id: 15, nombre: "Mouse Inalambrico Ergonomico", categoriaId: 5, precioCosto: 12.0, precioVenta: 28.0 },
  { id: 16, nombre: "Smart TV 55\" 4K UHD", categoriaId: 6, precioCosto: 320.0, precioVenta: 549.0 },
  { id: 17, nombre: "Smart TV 65\" OLED", categoriaId: 6, precioCosto: 850.0, precioVenta: 1399.0 },
]

export const clientes: Cliente[] = [
  { id: 1, nombre: "Tech Solutions S.A. de C.V.", segmento: "Corporativo", limiteCredito: 50000.0 },
  { id: 2, nombre: "Grupo Comercial Del Norte", segmento: "Mayorista", limiteCredito: 80000.0 },
  { id: 3, nombre: "Distribuidora Bajio SpA", segmento: "Mayorista", limiteCredito: 60000.0 },
  { id: 4, nombre: "Consultoria Digital MX", segmento: "Corporativo", limiteCredito: 25000.0 },
  { id: 5, nombre: "Juan Perez Gomez", segmento: "Minorista", limiteCredito: 2000.0 },
  { id: 6, nombre: "Maria Rodriguez Silva", segmento: "Minorista", limiteCredito: 1500.0 },
  { id: 7, nombre: "Carlos Mendoza Ruiz", segmento: "Minorista", limiteCredito: 3000.0 },
  { id: 8, nombre: "Ana Sofia Lopez", segmento: "Minorista", limiteCredito: 1000.0 },
  { id: 9, nombre: "Desarrollos Logisticos S.A.", segmento: "Corporativo", limiteCredito: 40000.0 },
  { id: 10, nombre: "Oficinas & Espacios Coworking", segmento: "Corporativo", limiteCredito: 35000.0 },
]

export const ventas: Venta[] = [
  { id: 1, tiendaId: 1, clienteId: 1, fecha: "2025-05-10", metodoPago: "Transferencia", total: 5500.0 },
  { id: 2, tiendaId: 3, clienteId: 4, fecha: "2025-06-18", metodoPago: "Credito", total: 4350.0 },
  { id: 3, tiendaId: 5, clienteId: 5, fecha: "2025-08-22", metodoPago: "Tarjeta", total: 650.0 },
  { id: 4, tiendaId: 2, clienteId: 2, fecha: "2025-10-12", metodoPago: "Credito", total: 12750.0 },
  { id: 5, tiendaId: 4, clienteId: 6, fecha: "2025-11-05", metodoPago: "Efectivo", total: 120.0 },
  { id: 6, tiendaId: 7, clienteId: 9, fecha: "2025-12-01", metodoPago: "Transferencia", total: 8700.0 },
  { id: 7, tiendaId: 1, clienteId: 7, fecha: "2025-12-20", metodoPago: "Tarjeta", total: 1100.0 },
  { id: 8, tiendaId: 1, clienteId: 1, fecha: "2026-01-15", metodoPago: "Transferencia", total: 6600.0 },
  { id: 9, tiendaId: 3, clienteId: 3, fecha: "2026-02-02", metodoPago: "Credito", total: 10200.0 },
  { id: 10, tiendaId: 2, clienteId: 8, fecha: "2026-02-20", metodoPago: "Tarjeta", total: 299.0 },
  { id: 11, tiendaId: 4, clienteId: 4, fecha: "2026-03-05", metodoPago: "Transferencia", total: 4350.0 },
  { id: 12, tiendaId: 6, clienteId: 2, fecha: "2026-03-18", metodoPago: "Credito", total: 14500.0 },
  { id: 13, tiendaId: 5, clienteId: 5, fecha: "2026-04-01", metodoPago: "Efectivo", total: 850.0 },
  { id: 14, tiendaId: 8, clienteId: 10, fecha: "2026-04-10", metodoPago: "Credito", total: 6995.0 },
  { id: 15, tiendaId: 1, clienteId: 7, fecha: "2026-04-15", metodoPago: "Tarjeta", total: 1050.0 },
  { id: 16, tiendaId: 3, clienteId: 6, fecha: "2026-04-22", metodoPago: "Efectivo", total: 199.98 },
]

export const detalleVentas: DetalleVenta[] = [
  { id: 1, ventaId: 1, productoId: 1, cantidad: 5, precioUnitario: 1100.0, subtotal: 5500.0, costo: 3500.0 },
  { id: 2, ventaId: 2, productoId: 3, cantidad: 3, precioUnitario: 1450.0, subtotal: 4350.0, costo: 2850.0 },
  { id: 3, ventaId: 3, productoId: 4, cantidad: 1, precioUnitario: 650.0, subtotal: 650.0, costo: 400.0 },
  { id: 4, ventaId: 4, productoId: 7, cantidad: 15, precioUnitario: 850.0, subtotal: 12750.0, costo: 7500.0 },
  { id: 5, ventaId: 5, productoId: 9, cantidad: 1, precioUnitario: 120.0, subtotal: 120.0, costo: 65.0 },
  { id: 6, ventaId: 6, productoId: 3, cantidad: 6, precioUnitario: 1450.0, subtotal: 8700.0, costo: 5700.0 },
  { id: 7, ventaId: 7, productoId: 1, cantidad: 1, precioUnitario: 1100.0, subtotal: 1100.0, costo: 700.0 },
  { id: 8, ventaId: 8, productoId: 1, cantidad: 6, precioUnitario: 1100.0, subtotal: 6600.0, costo: 4200.0 },
  { id: 9, ventaId: 9, productoId: 8, cantidad: 10, precioUnitario: 720.0, subtotal: 7200.0, costo: 4200.0 },
  { id: 10, ventaId: 9, productoId: 13, cantidad: 10, precioUnitario: 300.0, subtotal: 3000.0, costo: 1800.0 },
  { id: 11, ventaId: 10, productoId: 13, cantidad: 1, precioUnitario: 299.0, subtotal: 299.0, costo: 180.0 },
  { id: 12, ventaId: 11, productoId: 3, cantidad: 3, precioUnitario: 1450.0, subtotal: 4350.0, costo: 2850.0 },
  { id: 13, ventaId: 12, productoId: 1, cantidad: 10, precioUnitario: 1100.0, subtotal: 11000.0, costo: 7000.0 },
  { id: 14, ventaId: 12, productoId: 16, cantidad: 10, precioUnitario: 350.0, subtotal: 3500.0, costo: 3200.0 },
  { id: 15, ventaId: 13, productoId: 7, cantidad: 1, precioUnitario: 850.0, subtotal: 850.0, costo: 500.0 },
  { id: 16, ventaId: 14, productoId: 17, cantidad: 5, precioUnitario: 1399.0, subtotal: 6995.0, costo: 4250.0 },
  { id: 17, ventaId: 15, productoId: 5, cantidad: 1, precioUnitario: 1050.0, subtotal: 1050.0, costo: 680.0 },
  { id: 18, ventaId: 16, productoId: 10, cantidad: 2, precioUnitario: 99.99, subtotal: 199.98, costo: 90.0 },
]

export const cuentasPorCobrar: CuentaPorCobrar[] = [
  { id: 1, clienteId: 4, ventaId: 2, montoTotal: 4350.0, saldoPendiente: 0.0, anio: "2025", fechaVencimiento: "2025-07-18", estado: "Pagado", clienteNombre: "Consultoria Digital MX" },
  { id: 2, clienteId: 2, ventaId: 4, montoTotal: 12750.0, saldoPendiente: 0.0, anio: "2025", fechaVencimiento: "2025-11-12", estado: "Pagado", clienteNombre: "Grupo Comercial Del Norte" },
  { id: 3, clienteId: 3, ventaId: 9, montoTotal: 10200.0, saldoPendiente: 3200.0, anio: "2026", fechaVencimiento: "2026-03-04", estado: "Vencido", clienteNombre: "Distribuidora Bajio Spa" },
  { id: 4, clienteId: 2, ventaId: 12, montoTotal: 14500.0, saldoPendiente: 14500.0, anio: "2026", fechaVencimiento: "2026-04-18", estado: "Vencido", clienteNombre: "Grupo Comercial Del Norte" },
  { id: 5, clienteId: 10, ventaId: 14, montoTotal: 6995.0, saldoPendiente: 6995.0, anio: "2026", fechaVencimiento: "2026-05-10", estado: "Pendiente", clienteNombre: "Oficinas & Espacios Coworking" },
]

/** Coordenadas aproximadas (lat, lon) de las ciudades del mapa de Power BI (Azure Maps). */
export const coordenadasCiudad: Record<string, { lat: number; lon: number }> = {
  Monterrey: { lat: 25.6866, lon: -100.3161 },
  'San Pedro Garza Garcia': { lat: 25.6515, lon: -100.4023 },
  CDMX: { lat: 19.4326, lon: -99.1332 },
  Guadalajara: { lat: 20.6597, lon: -103.3496 },
  Queretaro: { lat: 20.5888, lon: -100.3899 },
  Puebla: { lat: 19.0414, lon: -98.2063 },
  Merida: { lat: 20.9674, lon: -89.5926 },
}

/** Contorno simplificado de México [lon, lat] (continente y península de Baja California). */
export const mexicoContorno: { continente: [number, number][]; baja: [number, number][] } = {
  continente: [
    [-114.72, 32.72], [-111.07, 31.33], [-108.2, 31.78], [-106.5, 31.75], [-105.0, 30.65], [-104.5, 29.6],
    [-103.1, 29.0], [-102.4, 29.8], [-101.4, 29.77], [-100.7, 29.1], [-99.5, 27.5], [-99.1, 26.4],
    [-97.15, 25.95], [-97.2, 24.0], [-97.8, 22.5], [-97.4, 21.0], [-96.4, 19.6], [-95.0, 18.7],
    [-94.4, 18.2], [-92.0, 18.6], [-91.0, 18.8], [-90.5, 19.9], [-90.4, 21.0], [-88.0, 21.6],
    [-87.0, 21.5], [-87.4, 20.0], [-87.5, 18.5], [-88.3, 18.5], [-89.15, 17.95], [-90.98, 17.8],
    [-91.4, 17.25], [-90.4, 16.1], [-92.2, 14.55], [-94.0, 16.2], [-96.0, 15.7], [-98.0, 16.2],
    [-100.0, 17.0], [-102.0, 17.9], [-103.5, 18.8], [-105.3, 20.0], [-105.6, 21.6], [-106.7, 23.2],
    [-108.8, 25.4], [-110.6, 27.8], [-112.2, 29.0], [-112.9, 30.8], [-114.8, 31.8], [-114.72, 32.72],
  ],
  baja: [
    [-117.1, 32.53], [-116.2, 30.8], [-114.4, 28.4], [-113.2, 27.0], [-112.2, 25.0], [-110.5, 23.3],
    [-109.5, 23.0], [-109.8, 24.2], [-111.3, 26.0], [-112.4, 28.0], [-114.0, 29.5], [-114.9, 30.8],
    [-114.75, 31.8], [-114.72, 32.72], [-117.1, 32.53],
  ],
}
