import Image from 'next/image'

export const LOGO_ICON_URL =
  '/JMC - LOGO 1.png'

// Aquí colocas la ruta de tu imagen local dentro de public
export const LOGO_FULL_URL = '/JMC - LOGO 2.png'

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <a
      aria-label="JMC Data & Network Group, inicio"
      className={`brand-lockup${compact ? ' brand-lockup--compact' : ''}`}
      href="#inicio"
    >
      <span className="brand-mark-shell">
        <Image
          alt=""
          className="brand-mark-image"
          height={88}
          priority
          src={LOGO_ICON_URL}
          unoptimized
          width={88}
        />
      </span>
      <span className="brand-wordmark">
        <span className="brand-initials">JMC</span>
        <span className="brand-caption">DATA &amp; NETWORK GROUP</span>
      </span>
    </a>
  )
}

export function FullLogoArtwork() {
  return (
    <Image
      alt="Logotipo de JMC Data & Network Group: emblema azul y letras blancas sobre fondo negro"
      className="full-logo-artwork"
      height={540}
      src={LOGO_FULL_URL}
      unoptimized
      width={540}
      style={{ mixBlendMode: 'screen' }} // Esto hace que el negro del PNG se vuelva transparente
    />
  )
}