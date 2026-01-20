"use client";

export default function GlobalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>Edunancial</header>
      <main>{children}</main>
    </div>
  );
}
