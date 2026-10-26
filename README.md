JMC Data & Network Group
Sitio web informativo de JMC Data & Network Group, empresa enfocada en almacenamiento y gestión de datos, generación de reportes y servicios relacionados con redes e infraestructura tecnológica.
Secciones del sitio
Presentación principal de la empresa.
Servicios de almacenamiento, reportes, integración de datos y redes.
Quiénes somos y enfoque de trabajo.
Llamado de contacto por correo electrónico.
Diseño adaptable a escritorio y móvil, con navegación móvil interactiva.
Tecnologías
Next.js 16 con React 19 y TypeScript.
Tailwind CSS 4.
Iconos de Lucide.
Desarrollo local
Requiere Node.js y pnpm. Desde la carpeta del proyecto:
```bash
pnpm install
pnpm dev
```
Abre http://localhost:3000 para ver el sitio.
Compilación de producción
```bash
pnpm build
pnpm start
```
`pnpm start` sirve la versión generada por `pnpm build`.
Estructura principal
```text
app/
  globals.css       Estilos globales y diseño adaptable
  layout.tsx        Metadatos, idioma y configuración del documento
  page.tsx          Composición de la página principal
components/
  about-section.tsx
  brand-lockup.tsx
  contact-section.tsx
  hero-section.tsx
  process-section.tsx
  services-section.tsx
  site-footer.tsx
  site-header.tsx
```
Personalización antes de publicar
Correo de contacto: cambia `CONTACT_EMAIL` en `components/contact-section.tsx`. Actualmente está configurado como `contacto@jmcdata.com` y debe reemplazarse por el correo oficial de la empresa.
Contenido: actualiza los textos de las secciones en sus respectivos archivos dentro de `components/`.
Logotipos: `components/brand-lockup.tsx` usa las dos imágenes proporcionadas para el emblema y el logotipo completo.
Colores y estilos: modifica las variables y reglas de `app/globals.css`.
No se requiere base de datos ni variables de entorno para ejecutar esta página informativa.