// components/GlobalLayout.tsx

import React from "react";

type GlobalLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

export default function GlobalLayout({ title, children }: GlobalLayoutProps) {
  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      {title && (
        <header style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>{title}</h1>
        </header>
      )}

      <section>{children}</section>
    </main>
  );
}
