import { AuthProvider } from '../providers/AuthProvider';
import { EnrollmentProvider } from '../providers/EnrollmentProvider';

export default function DashboardPage() {
  return (
    <AuthProvider>
      <EnrollmentProvider>
        <main style={{ padding: '2rem' }}>
          <h1>Dashboard</h1>
          <p>Welcome to your dashboard.</p>
        </main>
      </EnrollmentProvider>
    </AuthProvider>
  );
}
