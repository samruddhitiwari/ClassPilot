'use client';

import { useState } from 'react';

import { supabase } from '../lib/supabaseClient';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const actionLabels = {
  login: {
    title: 'Welcome back',
    cta: 'Log in'
  },
  signup: {
    title: 'Create your account',
    cta: 'Sign up'
  }
};

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const action = mode === 'signup' ? supabase.auth.signUp : supabase.auth.signInWithPassword;
      const { error } = await action({ email, password });

      if (error) {
        setStatus(error.message);
        return;
      }

      setStatus(mode === 'signup' ? 'Check your inbox to confirm your account.' : 'Logged in successfully.');
    } catch (err) {
      if (err instanceof Error) {
        setStatus(err.message);
      } else {
        setStatus('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setStatus(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setStatus(error.message);
    } else {
      setStatus('Signed out successfully.');
    }
    setLoading(false);
  };

  return (
    <div className="stack">
      <h1 className="title">{actionLabels[mode].title}</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          Email
          <input
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="field">
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button
          className="button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Working...' : actionLabels[mode].cta}
        </button>
      </form>
      <button
        className="link"
        type="button"
        onClick={handleSignOut}
        disabled={loading}
      >
        Sign out
      </button>
      {status ? <p className="muted">{status}</p> : null}
    </div>
  );
}
