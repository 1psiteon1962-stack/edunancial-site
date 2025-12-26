import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LegalFooter from "@/components/LegalFooter";

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
        <LegalFooter />
      </body>
    </html>
  );
}
