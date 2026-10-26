import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JMC Data & Network Group | Soluciones de datos y reportes',
  description:
    'Almacenamiento, gestión de datos, generación de reportes y servicios de redes para ayudar a las empresas a convertir información en decisiones claras.',
  applicationName: 'JMC Data & Network Group',
  generator: 'Next.js',
  icons: {
    icon: '/JMC - LOGO 1.png',
    apple:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JMC%20-%20EDITABLE_Mesa%20de%20trabajo%201%20copia%2017-6jL67J70uTOnxl7B7BWkgoQCSfxRSE.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#060b13',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
