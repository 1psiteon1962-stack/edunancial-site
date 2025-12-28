import './globals.css';
import { NavBar } from '@/components/NavBar';
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
            <NavBar />
            {children}
          </EnrollmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
