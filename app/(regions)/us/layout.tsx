import type { ReactNode } from "react";
import USNav from "./components/USNav";

export default function USLayout({ children }: { children: ReactNode }) {
  return (
    <section style={{ maxWidth: 980, margin: "0 auto", padding: "18px 14px" }}>
      <USNav />
      {children}
    </section>
  );
}
