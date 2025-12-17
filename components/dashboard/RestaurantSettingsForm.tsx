'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type RestaurantSettingsFormProps = {
  restaurantId: string;
  initialName: string;
  initialDescription: string | null;
  initialWhatsapp: string | null;
  initialPrimaryColor: string | null;
};

export function RestaurantSettingsForm({
  restaurantId,
  initialName,
  initialDescription,
  initialWhatsapp,
  initialPrimaryColor,
}: RestaurantSettingsFormProps) {
  const supabase = createSupabaseBrowserClient();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? '');
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp ?? '');
  const [primaryColor, setPrimaryColor] = useState(
    initialPrimaryColor ?? '#fbbf24'
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: updateError } = await supabase
      .from('restaurants')
      .update({
        name: name.trim(),
        description: description.trim() || null,
        whatsapp_number: whatsapp.trim() || null,
        primary_color: primaryColor,
      })
      .eq('id', restaurantId);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Settings saved.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-xs">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] text-zinc-400">
            Restaurant name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-zinc-400">
            WhatsApp number
          </label>
          <input
            placeholder="+92…"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[11px] text-zinc-400">
          Short description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
        <p className="mt-1 text-[10px] text-zinc-500">
          Shown at the top of your public menu.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-[11px] text-zinc-400">
          Accent color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="h-8 w-12 cursor-pointer rounded border border-zinc-700 bg-zinc-950"
          />
          <span className="text-[11px] text-zinc-400">
            Used for buttons and highlights (saved for future theming).
          </span>
        </div>
      </div>

      {error && <p className="text-[11px] text-red-400">{error}</p>}
      {message && <p className="text-[11px] text-emerald-400">{message}</p>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-[11px] font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  );
}


