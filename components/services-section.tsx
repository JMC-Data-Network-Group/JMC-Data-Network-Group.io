import { ArrowUpRight, BarChart3, Database, Network, Workflow } from 'lucide-react'

const services = [
  {
    number: '01',
    icon: Database,
    title: 'Almacenamiento de datos',
    description:
      'Estructuramos repositorios y soluciones de almacenamiento para mantener tu información organizada y disponible según las necesidades de tu negocio.',
    tag: 'DATA STORAGE',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Reportes y tableros',
    description:
      'Diseñamos reportes e indicadores claros que facilitan la lectura del desempeño y el seguimiento de lo importante.',
    tag: 'REPORTING',
  },
  {
    number: '03',
    icon: Workflow,
    title: 'Integración y gestión',
    description:
      'Conectamos fuentes y ordenamos flujos de información para simplificar procesos y reducir tareas manuales.',
    tag: 'DATA MANAGEMENT',
  },
  {
    number: '04',
    icon: Network,
    title: 'Redes e infraestructura',
    description:
      'Acompañamos la planificación y optimización de redes y recursos tecnológicos que sostienen tus operaciones.',
    tag: 'NETWORKS',
  },
]

export function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="services-section" id="servicios">
      <div className="site-shell">
        <div className="section-heading services-heading">
          <div>
            <p className="section-eyebrow">LO QUE HACEMOS</p>
            <h2 id="services-title">
              Soluciones para darle <span>sentido a tus datos.</span>
            </h2>
          </div>
          <p className="section-intro">
            Desde la organización de la información hasta su visualización, conectamos las piezas
            para que puedas enfocarte en lo esencial.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <article className="service-card" key={service.number}>
                <div className="service-card-top">
                  <span className="service-icon"><Icon aria-hidden="true" /></span>
                  <span className="service-number">{service.number}</span>
                </div>
                <p className="service-tag">{service.tag}</p>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <span aria-hidden="true" className="service-card-arrow"><ArrowUpRight /></span>
              </article>
            )
          })}
        </div>

        <div className="services-footnote">
          <span aria-hidden="true" className="services-footnote-line" />
          <p>Una solución adecuada empieza por entender cómo trabaja tu equipo.</p>
        </div>
      </div>
    </section>
  )
}
