export default function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-wrap px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
