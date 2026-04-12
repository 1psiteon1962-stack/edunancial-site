import React from "react";

export default function GlobalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header style={{ padding: 20, background: "#111", color: "#fff" }}>
        Edunancial
      </header>

      <main>{children}</main>
    </div>
  );
}
