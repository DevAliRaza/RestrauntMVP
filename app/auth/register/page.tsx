'use client';

import { useState, FormEvent } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const supabase = createSupabaseBrowserClient();
  const [fullName, setFullName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !signUpData.user) {
      setLoading(false);
      setError(signUpError?.message ?? 'Could not sign up');
      return;
    }

    const userId = signUpData.user.id;
    const slug = slugify(restaurantName);

    const { error: dbError } = await supabase.rpc('init_restaurant_for_user', {
      p_user_id: userId,
      p_full_name: fullName,
      p_restaurant_name: restaurantName,
      p_slug: slug,
      p_whatsapp: whatsapp,
    });

    setLoading(false);

    if (dbError) {
      setError(dbError.message);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          Get your QR menu in minutes
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Create an account and launch a branded digital menu for your restaurant.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Full name</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">
                Restaurant name
              </label>
              <input
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              WhatsApp number
            </label>
            <input
              placeholder="+92…"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-sm shadow-amber-400/40 transition hover:bg-amber-300 disabled:opacity-70"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <a href="/auth/login" className="text-amber-300 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}


