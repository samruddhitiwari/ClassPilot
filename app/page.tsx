'use client';

import Link from 'next/link';

import { useSession } from '../lib/useSession';

export default function Home() {
  const { user, loading } = useSession();

  return (
    <main className="page">
      <div className="card stack">
        <h1 className="title">ClassPilot Auth</h1>
        <p className="helper">
          Use the signup or login pages to authenticate with Supabase. Your session state will appear here.
        </p>
        <div className="badge">
          {loading ? 'Checking session...' : user ? `Signed in as ${user.email ?? user.id}` : 'Not signed in'}
        </div>
        <div className="stack">
          <Link href="/login" className="button">
            Go to login
          </Link>
          <Link href="/signup" className="button">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
