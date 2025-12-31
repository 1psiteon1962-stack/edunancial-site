"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

type GlobalLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function GlobalLayout({ children, title }: GlobalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isSpanish = pathname?.startsWith("/es") ?? false;

  const toggleLanguage = () => {
    if (!pathname) return;

    if (isSpanish) {
      router.push(pathname.replace("/es", ""));
    } else {
      router.push(`/es${pathname}`);
    }
  };

  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #e5e5e5" }}>
        <nav style={{ fontSize: "0.9rem" }}>
          <strong>Regions:</strong>{" "}
          <a href="/us">US</a> |{" "}
          <a href="/latam">LATAM</a> |{" "}
          <a href="/africa">Africa</a> |{" "}
          <a href="/mena">MENA</a> |{" "}
          <a href="/europe">Europe</a>
        </nav>

        <button
          onClick={toggleLanguage}
          style={{
            marginTop: "0.75rem",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          {isSpanish ? "English" : "Español"}
        </button>
      </header>

      <main>{children}</main>
    </div>
  );
}
