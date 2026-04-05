'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import ClientConnectButton from '@/components/ClientConnectButton'
import CascadingScrollAnimation, { FadeInScale } from '@/components/CascadingScrollAnimation'

interface CTABandProps {
  isConnected: boolean
  onScan: () => void
  isScanning: boolean
}

export default function CTABand({ isConnected, onScan, isScanning }: CTABandProps) {
  return (
    <CascadingScrollAnimation direction="up" distance={80} delay={800}>
      <Section className="py-16 sm:py-20 lg:py-24 bg-secondary-900 dark:bg-[#060A14] text-white">
        <Container>
          <FadeInScale delay={400}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Ready to Secure Your Wallet?
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Complete your security audit in under a minute. No sign-up required, no email collection, just connect and scan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {!isConnected ? (
                  <ClientConnectButton
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto min-h-[44px] px-8 py-4 text-lg font-semibold"
                  />
                ) : (
                  <Button
                    onClick={onScan}
                    disabled={isScanning}
                    loading={isScanning}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto min-h-[44px] px-8 py-4 text-lg font-semibold"
                  >
                    {isScanning ? 'Scanning...' : 'Scan Your Wallet'}
                  </Button>
                )}
                <p className="text-base text-gray-300 leading-relaxed max-w-md text-center">
                  No sign-up required. No email. Just connect and scan.
                </p>
              </div>
            </div>
          </FadeInScale>
        </Container>
      </Section>
    </CascadingScrollAnimation>
  )
}
