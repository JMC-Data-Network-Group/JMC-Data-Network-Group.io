const processSteps = [
  {
    number: '01',
    title: 'Entender',
    description: 'Conocemos tus objetivos, tus fuentes de información y los retos de tu operación.',
  },
  {
    number: '02',
    title: 'Organizar',
    description: 'Definimos una estructura y un flujo de trabajo adecuados para tu equipo.',
  },
  {
    number: '03',
    title: 'Activar',
    description: 'Convertimos la información en reportes y herramientas útiles para avanzar.',
  },
]

export function ProcessSection() {
  return (
    <section aria-labelledby="process-title" className="process-section" id="enfoque">
      <div className="site-shell">
        <div className="process-heading">
          <p className="section-eyebrow">NUESTRO ENFOQUE</p>
          <h2 id="process-title">Un proceso claro, <span>de principio a fin.</span></h2>
          <p>Trabajamos paso a paso para que cada decisión tecnológica tenga un propósito.</p>
        </div>

        <ol className="process-grid">
          {processSteps.map((step) => (
            <li className="process-step" key={step.number}>
              <span className="process-number">{step.number}</span>
              <div className="process-step-copy">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
