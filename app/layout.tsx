import "./globals.css";

import Navbar from "../components/navbar";
import Footer from "../components/GlobalFooter";

export const metadata = {
  title: "Edunancial",

  description:
    "Edunancial is a Financial Literacy Platform focused on financial education, entrepreneurship, capital access, and wealth building.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body>

        <Navbar />

        {children}

        <Footer />

      </body>

    </html>

  );

}
