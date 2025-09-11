import Container from '@/components/ui/Container'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="py-10 text-sm text-stone">
        © {new Date().getFullYear()} Allowance Guard. All rights reserved.
      </Container>
    </footer>
  )
}