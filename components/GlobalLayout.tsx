// components/GlobalLayout.tsx

import React from "react";

export type GlobalLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function GlobalLayout({
  children,
  title,
}: GlobalLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      {title && (
        <header
          style={{
            padding: "1.5rem 1rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>{title}</h1>
        </header>
      )}
      <main style={{ padding: "2rem 1rem" }}>{children}</main>
    </div>
  );
}
