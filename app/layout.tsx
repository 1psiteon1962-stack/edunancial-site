export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            padding: "1rem",
            borderBottom: "1px solid #ddd",
            marginBottom: "2rem",
          }}
        >
          <strong>Regions:</strong>{" "}
          <a href="/us">US</a> |{" "}
          <a href="/latam">LATAM</a> |{" "}
          <a href="/africa">Africa</a> |{" "}
          <a href="/mena">MENA</a> |{" "}
          <a href="/europe">Europe</a>
        </header>

        {children}
      </body>
    </html>
  );
}
