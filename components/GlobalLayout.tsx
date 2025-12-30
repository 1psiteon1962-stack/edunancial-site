import React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function GlobalLayout({ title, children }: Props) {
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "1.5rem" }}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
}
