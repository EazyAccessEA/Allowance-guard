import Link from 'next/link'
import Container from '@/components/ui/Container'
import ConnectButton from '@/components/ConnectButton'

interface HeaderProps {
  isConnected: boolean
}

export default function Header({ isConnected }: HeaderProps) {
  return (
    <header className="border-b border-line">
      <Container className="h-14 flex items-center justify-between">
        <Link href="/" className="text-ink font-medium">Allowance Guard</Link>
        <nav className="flex items-center gap-6">
          <Link href="/docs" className="text-ink/70 hover:text-ink text-sm">Docs</Link>
          <Link href="/settings" className="text-ink/70 hover:text-ink text-sm">Settings</Link>
          <span>{isConnected ? '' : <ConnectButton />}</span>
        </nav>
      </Container>
    </header>
  )
}