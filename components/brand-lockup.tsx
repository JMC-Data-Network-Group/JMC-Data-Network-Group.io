import Image from 'next/image'

export const LOGO_ICON_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JMC%20-%20EDITABLE_Mesa%20de%20trabajo%201%20copia%2017-6jL67J70uTOnxl7B7BWkgoQCSfxRSE.png'

export const LOGO_FULL_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JMC%20-%20EDITABLE_Mesa%20de%20trabajo%201%20copia%2016-0WMFl3iiMXGYQBY89GXr4fMHFmMcXw.png'

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
    />
  )
}
