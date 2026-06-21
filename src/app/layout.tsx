import "./globals.css";

export const metadata = {
  title: "Edunancial",
  description: "Financial literacy platform for wealth building, business readiness, and access to capital."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
