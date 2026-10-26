import { ArrowUpRight, MessageCircle } from 'lucide-react'

export const CONTACT_EMAIL = 'contacto@jmcdatanetworkgroup.com'

export function ContactSection() {
  const subject = encodeURIComponent('Consulta sobre servicios de JMC Data & Network Group')

  return (
    <section aria-labelledby="contact-title" className="contact-section" id="contacto">
      <div className="site-shell">
        <div className="contact-card">
          <div className="contact-copy">
            <p className="contact-eyebrow"><MessageCircle aria-hidden="true" /> HABLEMOS</p>
            <h2 id="contact-title">Tu próximo paso empieza con una conversación.</h2>
            <p>Cuéntanos qué necesitas y exploremos cómo darle más valor a tu información.</p>
          </div>
          <div className="contact-action">
            <a className="contact-button" href={`mailto:${CONTACT_EMAIL}?subject=${subject}`}>
              Escribir a JMC <ArrowUpRight aria-hidden="true" />
            </a>
            <span className="contact-email">{CONTACT_EMAIL}</span>
          </div>
          <span aria-hidden="true" className="contact-decoration contact-decoration--one" />
          <span aria-hidden="true" className="contact-decoration contact-decoration--two" />
        </div>
      </div>
    </section>
  )
}
