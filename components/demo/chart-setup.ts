import {
  type ActiveElement,
  type ChartEvent,
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  Tooltip,
} from 'chart.js'
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap'

let registrado = false

/** Registra solo lo necesario (tree-shaking) y aplica el tema oscuro de JMC. Se ejecuta una vez en el cliente. */
export function setupChartJs() {
  if (registrado) return
  registrado = true

  Chart.register(
    ArcElement,
    BarController,
    BarElement,
    BubbleController,
    CategoryScale,
    DoughnutController,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PieController,
    PointElement,
    Tooltip,
    TreemapController,
    TreemapElement,
  )

  Chart.defaults.color = '#a9b5c5'
  Chart.defaults.font.family = 'Arial, Helvetica, sans-serif'
  Chart.defaults.font.size = 12
  Chart.defaults.borderColor = 'rgb(255 255 255 / 7%)'
  Chart.defaults.plugins.legend.labels.usePointStyle = true
  Chart.defaults.plugins.legend.labels.boxWidth = 8
  Chart.defaults.plugins.legend.labels.boxHeight = 8
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgb(8 16 27 / 96%)'
  Chart.defaults.plugins.tooltip.borderColor = 'rgb(190 210 235 / 22%)'
  Chart.defaults.plugins.tooltip.borderWidth = 1
  Chart.defaults.plugins.tooltip.padding = 12
  Chart.defaults.plugins.tooltip.cornerRadius = 10
  Chart.defaults.plugins.tooltip.titleColor = '#f4f7fb'
  Chart.defaults.plugins.tooltip.bodyColor = '#c9d4e2'
  Chart.defaults.plugins.tooltip.boxPadding = 4
}

/** Paleta de datos tomada del tema Fluent2 del reporte, ajustada para fondo oscuro. */
export const colores = {
  ingresos: '#118DFF',
  costo: '#E66C37',
  utilidad: '#5BD667',
  region: {
    Norte: '#118DFF',
    Centro: '#E66C37',
    Occidente: '#E044A7',
    Bajio: '#D9B300',
    Sureste: '#15C6F4',
  } as Record<string, string>,
  serie: [
    '#118DFF',
    '#E66C37',
    '#5BD667',
    '#E044A7',
    '#D9B300',
    '#15C6F4',
    '#B5A1FF',
    '#FF8080',
    '#00DBBC',
    '#FFA058',
  ],
  estado: {
    Vencido: '#D64550',
    Pendiente: '#e1c233',
    Pagado: '#00FF37',
  } as Record<string, string>,
}

/** Añade transparencia a un color #rrggbb */
export function conAlfa(hex: string, alfa: number): string {
  const a = Math.round(alfa * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${a}`
}

export type { ActiveElement, ChartEvent }

/** Cursor de mano al pasar sobre un elemento seleccionable (filtrado cruzado). */
export function cursorPointer(evento: ChartEvent, elementos: ActiveElement[]) {
  const el = evento.native?.target as HTMLElement | undefined
  if (el) el.style.cursor = elementos.length ? 'pointer' : 'default'
}
