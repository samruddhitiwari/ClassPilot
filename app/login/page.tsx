import Link from 'next/link';

import { AuthForm } from '../../components/AuthForm';

export default function LoginPage() {
  return (
    <main className="page">
      <div className="card stack">
        <AuthForm mode="login" />
        <p className="helper">
          Need an account? <Link href="/signup">Sign up here</Link>.
        </p>
      </div>
    </main>
  );
}
