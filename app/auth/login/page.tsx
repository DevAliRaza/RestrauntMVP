'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Attempting login with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('Login result:', { data, error });
    setLoading(false);

    if (error) {
      console.error('Login error:', error);
      setError(`${error.message} (Code: ${error.status || 'unknown'})`);
    } else {
      console.log('Login successful, redirecting...');
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-xs text-zinc-400">
          Access your restaurant dashboard and manage your QR menu.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-sm shadow-amber-400/40 transition hover:bg-amber-300 disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-xs text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-amber-300 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}


