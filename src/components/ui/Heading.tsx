export function H1({ children, className='' }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`text-5xl sm:text-6xl font-medium tracking-[-0.02em] text-ink ${className}`}>{children}</h1>;
}

export function H2({ children, className='' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-3xl sm:text-4xl font-medium tracking-[-0.01em] text-ink ${className}`}>{children}</h2>;
}

export function Eyebrow({ children, className='' }: { children: React.ReactNode; className?: string }) {
  return <p className={`uppercase tracking-[0.2em] text-xs text-stone ${className}`}>{children}</p>;
}
