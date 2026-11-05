import { AboutSection } from '@/components/about-section'
import { ContactSection } from '@/components/contact-section'
import { HeroSection } from '@/components/hero-section'
import { ProcessSection } from '@/components/process-section'
import { ServicesSection } from '@/components/services-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { CocotaiReport } from '@/components/demo/cocotai-report'
import { ChatWidget } from '@/components/chat-widget'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ProcessSection />
        <ContactSection />
        <CocotaiReport />
      </main>
      <SiteFooter />
      <ChatWidget />
    </>
  )
}

