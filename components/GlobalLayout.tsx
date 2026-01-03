// components/GlobalLayout.tsx
import { ReactNode } from "react";

export default function GlobalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <header>
        <strong>Edunancial</strong>
      </header>
      <main>{children}</main>
    </div>
  );
}
