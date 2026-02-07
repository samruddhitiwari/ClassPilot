import Link from 'next/link';

import { AuthForm } from '../../components/AuthForm';

export default function SignupPage() {
  return (
    <main className="page">
      <div className="card stack">
        <AuthForm mode="signup" />
        <p className="helper">
          Already have an account? <Link href="/login">Log in here</Link>.
        </p>
      </div>
    </main>
  );
}
