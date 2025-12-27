import { AuthProvider } from '../providers/AuthProvider';

export default function LoginPage() {
  return (
    <AuthProvider>
      <main style={{ padding: '2rem' }}>
        <h1>Login</h1>
        <p>Login form goes here.</p>
      </main>
    </AuthProvider>
  );
}
