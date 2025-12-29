import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
          <nav style={{ fontSize: "0.95rem" }}>
            <strong>Regions:</strong>{" "}
            <Link href="/us">US</Link> |{" "}
            <Link href="/latam">LATAM</Link> |{" "}
            <Link href="/africa">Africa</Link> |{" "}
            <Link href="/mena">MENA</Link> |{" "}
            <Link href="/asia">Asia</Link> |{" "}
            <Link href="/europe">Europe</Link>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
