import "./globals.css";

export const metadata = {
  title: "Edunancial",
  description: "Financial Literacy and Education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body>

        {children}

      </body>

    </html>

  );

}
