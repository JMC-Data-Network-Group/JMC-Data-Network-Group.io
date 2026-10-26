'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { BrandLockup } from './brand-lockup'

const navigationLinks = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#enfoque', label: 'Nuestro enfoque' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <BrandLockup />

        <nav
          aria-label="Navegación principal"
          className={`site-navigation${menuOpen ? ' site-navigation--open' : ''}`}
          id="primary-navigation"
        >
          {navigationLinks.map((link) => (
            <a className="navigation-link" href={link.href} key={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a className="navigation-cta" href="#contacto" onClick={closeMenu}>
            Conversemos <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="mobile-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
