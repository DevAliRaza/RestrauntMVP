'use client';

import { useState } from 'react';

export function NoRestaurantFallback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/restaurants/create-default', {
        method: 'POST',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Could not create restaurant');
      }
      const { slug } = await res.json();
      window.location.href = `/dashboard/${slug}`;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not create restaurant';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 px-4">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center space-y-4 max-w-md w-full">
        <h1 className="text-lg font-semibold">No restaurant linked</h1>
        <p className="text-sm text-zinc-400">
          You are signed in but don&apos;t have a restaurant yet. Create one now
          or ask an owner to invite you.
        </p>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          onClick={onCreate}
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-70"
        >
          {loading ? 'Creating...' : 'Create restaurant'}
        </button>
      </div>
    </div>
  );
}


