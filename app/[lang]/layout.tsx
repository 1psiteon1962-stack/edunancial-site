import "../../globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footersection";

export const metadata = {
  title: "Edunancial | Financial Literacy & Education",
  description:
    "Edunancial provides bilingual financial education covering business, real estate, investing, and AI-powered tools.",
};

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body className="bg-white text-gray-900">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
