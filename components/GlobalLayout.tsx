import React from "react";

type GlobalLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

export default function GlobalLayout({
  title,
  children,
}: GlobalLayoutProps) {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "1.5rem" }}>
      <nav style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Regions:&nbsp;
        <a href="/us">US</a> |{" "}
        <a href="/latam">LATAM</a> |{" "}
        <a href="/africa">Africa</a> |{" "}
        <a href="/mena">MENA</a> |{" "}
        <a href="/europe">Europe</a> |{" "}
        <a href="/asia-pacific">Asia-Pacific</a> |{" "}
        <a href="/asia-emerging">Emerging Asia</a>
      </nav>

      {title && <h1>{title}</h1>}

      {children}
    </main>
  );
}
