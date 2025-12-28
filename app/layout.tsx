import './globals.css';
import Link from 'next/link';
import { AuthProvider } from './providers/AuthProvider';
import { EnrollmentProvider } from './providers/EnrollmentProvider';

export const metadata = {
  title: 'Edunancial',
  description: 'Global financial education platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <EnrollmentProvider>

            {/* INLINE NAVBAR — NO IMPORTS, NO CASING ISSUES */}
            <nav className="w-full border-b border-gray-200 bg-white">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="text-xl font-semibold">
                  <Link href="/">Edunancial</Link>
                </div>

                <div className="flex gap-6 text-sm font-medium">
                  <Link href="/us">US</Link>
                  <Link href="/latam">LATAM</Link>
                  <Link href="/africa">Africa</Link>
                  <Link href="/conclusions">Conclusions</Link>
                </div>
              </div>
            </nav>

            {children}

          </EnrollmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
