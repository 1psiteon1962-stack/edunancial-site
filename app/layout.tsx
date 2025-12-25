import "./globals.css";
import RegionLanguageSwitcher from "@/components/RegionLanguageSwitcher";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
        }}
      >
        <RegionLanguageSwitcher />
        {children}
      </body>
    </html>
  );
}
