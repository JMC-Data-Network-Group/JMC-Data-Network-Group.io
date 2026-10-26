import { BrandLockup } from './brand-lockup'
import { CONTACT_EMAIL } from './contact-section'

const footerLinks = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#enfoque', label: 'Enfoque' },
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-main">
          <div className="footer-brand-block">
            <BrandLockup compact />
            <p>Datos organizados. Decisiones con dirección.</p>
          </div>
          <nav aria-label="Navegación del pie de página" className="footer-navigation">
            {footerLinks.map((link) => (
              <a href={link.href} key={link.href}>{link.label}</a>
            ))}
            <a href={`mailto:${CONTACT_EMAIL}`}>Contacto</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} JMC Data &amp; Network Group</span>
          <a href="#inicio">Volver al inicio <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  )
}
