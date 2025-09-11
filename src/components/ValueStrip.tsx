import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'

export default function ValueStrip() {
  const items = [
    { title: 'Audit approvals', text: 'One scan across supported chains reveals unlimited and risky allowances.' },
    { title: 'Revoke cleanly', text: 'Guided revocation flows with links to explorers and revoke utilities.' },
    { title: 'Stay ahead', text: 'Email/Slack alerts on new or high-risk approvals. Noise controlled.' },
  ]
  return (
    <Section className="bg-mist">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((it) => (
            <div key={it.title}>
              <h3 className="text-xl text-ink mb-3">{it.title}</h3>
              <p className="text-base text-stone max-w-reading">{it.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
