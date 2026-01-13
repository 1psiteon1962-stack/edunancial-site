import Link from "next/link";

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  border: "1px solid #e5e5e5",
  padding: "8px 10px",
  borderRadius: 10,
  fontWeight: 700,
};

export default function USNav() {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
      <Link href="/us" style={linkStyle}>US Home</Link>
      <Link href="/us/level-1" style={linkStyle}>Level 1</Link>
      <Link href="/us/level-2" style={linkStyle}>Level 2</Link>
      <Link href="/us/level-3" style={linkStyle}>Level 3</Link>
      <Link href="/us/level-4" style={linkStyle}>Level 4</Link>
      <Link href="/us/level-5" style={linkStyle}>Level 5</Link>
      <Link href="/us/apps" style={linkStyle}>Apps</Link>
      <Link href="/us/pay" style={linkStyle}>Pay</Link>
      <Link href="/metrics" style={linkStyle}>Metrics</Link>
    </div>
  );
}
