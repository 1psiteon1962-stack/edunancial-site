import { CartProvider } from './providers/CartProvider';
import { AuthProvider } from './providers/AuthProvider';
import { EnrollmentProvider } from './providers/EnrollmentProvider';
import { NavBar } from '@/components/NavBar';

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
            <CartProvider>
              <NavBar />
              {children}
            </CartProvider>
          </EnrollmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
