// components/GlobalLayout.tsx

export default function GlobalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div style={{ minHeight: "100vh" }}>{children}</div>;
}
