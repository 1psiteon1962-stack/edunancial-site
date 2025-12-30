import React from "react";
import Link from "next/link";

export default function GlobalLayout({
  title,
  region,
  children,
}: {
  title: string;
  region: string;
  children: React.ReactNode;
}) {
  return (
    <main style={{ maxWidth: "920px", margin: "0 auto", padding: "2rem" }}>
      <nav style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Regions:&nbsp;
        <Link href="/us">US</Link> |{" "}
        <Link href="/latam">LATAM</Link> |{" "}
        <Link href="/africa">Africa</Link> |{" "}
        <Link href="/mena">MENA</Link> |{" "}
        <Link href="/europe">Europe</Link> |{" "}
        <Link href="/asia-pacific">Asia-Pacific</Link> |{" "}
        <Link href="/emerging-asia">Emerging Asia</Link>
      </nav>

      <h1>{title}</h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}>
        Region: <strong>{region}</strong>
      </p>

      {children}

      <footer style={{ marginTop: "4rem", fontSize: "0.8rem", color: "#666" }}>
        Edunancial operates as a private commercial knowledge platform.
        Participation does not establish advisory, fiduciary, or professional
        relationships.
      </footer>
    </main>
  );
}
