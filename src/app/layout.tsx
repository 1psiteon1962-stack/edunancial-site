import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Edunancial",
  description:
    "Financial literacy provides the foundation. Financial competency is built through disciplined action.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#08101f] text-white">
        <Providers>
          <AnnouncementBar />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
