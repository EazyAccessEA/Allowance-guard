import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'

export default function RiskExplainer() {
  const rows = [
    { k: 'UNLIMITED', v: 'Contract can spend any amount. Revoke immediately.' },
    { k: 'HIGH RISK', v: 'Large amounts or unknown contracts. Review carefully.' },
    { k: 'SAFE', v: 'Small amounts from trusted sources. Monitor periodically.' },
  ]
  return (
    <Section className="bg-white">
      <Container>
        <h2 className="text-2xl text-ink mb-6">Risk model</h2>
        <div className="divide-y divide-line border border-line rounded-md">
          {rows.map((r, i) => (
            <div key={i} className="px-6 py-4 flex items-start gap-8">
              <div className="w-40 shrink-0 text-ink font-medium">{r.k}</div>
              <div className="text-stone">{r.v}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
