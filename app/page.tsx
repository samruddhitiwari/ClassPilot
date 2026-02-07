'use client';

import Link from 'next/link';

import { useSession } from '../lib/useSession';
import { useSubscription } from '../lib/useSubscription';

export default function Home() {
  const { session, user, loading } = useSession();
  const { subscription, loading: subscriptionLoading, error: subscriptionError } = useSubscription(session);

  const studentLimitCopy = subscription?.studentLimit
    ? `Up to ${subscription.studentLimit} students`
    : 'Unlimited students';

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
          <h2 className="section-title">Subscription</h2>
          {!user ? (
            <p className="helper">Sign in to see your Dodo subscription status and student limits.</p>
          ) : subscriptionLoading ? (
            <p className="helper">Checking Dodo subscription...</p>
          ) : subscriptionError ? (
            <p className="helper">{subscriptionError}</p>
          ) : (
            <>
              <div className={`pill ${subscription?.isPaid ? 'pill--paid' : 'pill--free'}`}>
                {subscription?.isPaid ? 'Paid plan active' : 'Free plan'}
              </div>
              <div className="stack">
                <p className="helper">
                  {subscription?.isPaid
                    ? `Plan: ${subscription?.plan ?? 'Paid'}`
                    : 'Plan: Free (30-student limit)'}
                </p>
                <p className="helper">Student access: {studentLimitCopy}</p>
                <p className="helper">Paid subscriptions unlock unlimited students.</p>
              </div>
              {!subscription?.configured && (
                <p className="helper">
                  Add a DODO_API_KEY to enable live subscription checks. Free accounts default to 30 students.
                </p>
              )}
            </>
          )}
        </div>
        <div className="stack">
          <Link href="/login" className="button">
            Go to login
          </Link>
          <Link href="/signup" className="button">
            Create an account
          </Link>
          <Link href="/attendance" className="button">
            Manage attendance
          </Link>
        </div>
      </div>
    </main>
  );
}
