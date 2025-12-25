import Link from "next/link";

export default function RegionLanguageSwitcher() {
  return (
    <nav
      style={{
        marginBottom: "2rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid #ddd",
        fontSize: "0.9rem",
      }}
    >
      <strong>Regions:</strong>{" "}
      <Link href="/us">US</Link> |{" "}
      <Link href="/latam/es">LATAM</Link> |{" "}
      <Link href="/africa/en">Africa</Link> |{" "}
      <Link href="/mena/ar">MENA</Link> |{" "}
      <Link href="/eu/en">Europe</Link>
    </nav>
  );
}
