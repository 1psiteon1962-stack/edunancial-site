import PageViewTracker from "./kpi/PageViewTracker";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
