import Link from 'next/link'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import Footer from '@/components/Footer'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      
      <Section className="pt-20 pb-24 sm:pt-24 sm:pb-32">
        <Container className="text-center">
          <H1 className="mb-8">Coming Soon</H1>
          <p className="text-xl text-stone leading-relaxed mb-8 max-w-2xl mx-auto">
            This feature is currently under development. We&apos;re working hard to bring you the best possible experience.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-cobalt text-white rounded-lg font-medium hover:bg-cobalt/90 transition-colors duration-200"
          >
            Return to Homepage
          </Link>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}
