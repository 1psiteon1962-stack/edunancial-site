export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px' }}>
      {children}
    </div>
  )
}
