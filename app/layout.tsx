// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Edunancial — Global Founder Routing Engine",
  description: "Move founders into survivable systems. Build globally. Scale safely.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
          <strong>Edunancial</strong> — Global Founder Routing Engine
        </header>

        <main style={{ padding: "24px" }}>
          {children}
        </main>

        <footer style={{ padding: "16px", borderTop: "1px solid #ddd", fontSize: "14px" }}>
          © {new Date().getFullYear()} Edunancial. Education & Routing Platform.
        </footer>
      </body>
    </html>
  );
}
