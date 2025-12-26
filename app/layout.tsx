import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageSwitcher />
        {children}
      </body>
    </html>
  );
}
