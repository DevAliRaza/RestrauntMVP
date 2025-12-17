'use client';

import { useState } from 'react';

type QRCodeRecord = {
  id: string;
  table_number: string | null;
  target_url: string;
  image_url: string | null;
  created_at: string;
};

type QRManagerProps = {
  restaurantId: string;
  restaurantSlug: string;
  initialQRCodes: QRCodeRecord[];
};

export function QRManager({
  restaurantId,
  restaurantSlug,
  initialQRCodes,
}: QRManagerProps) {
  const [tableNumber, setTableNumber] = useState('');
  const [codes, setCodes] = useState<QRCodeRecord[]>(initialQRCodes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      setError('Please enter a table number or label.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';
      const targetUrl = `${origin}/r/${restaurantSlug}?table=${encodeURIComponent(
        tableNumber.trim()
      )}`;

      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          branchId: null,
          tableNumber: tableNumber.trim(),
          targetUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate QR code.');
      }

      setCodes((prev) => [data.qr as QRCodeRecord, ...prev]);
      setTableNumber('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <form onSubmit={handleGenerate} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr,auto]">
          <div>
            <label className="mb-1 block text-[11px] text-zinc-400">
              Table number / label
            </label>
            <input
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. 12 or Terrace-3"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <p className="mt-1 text-[10px] text-zinc-500">
              This will be encoded in the URL so orders are tagged with the
              correct table.
            </p>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-[11px] font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-60"
            >
              {loading ? 'Generating…' : 'Generate QR'}
            </button>
          </div>
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </form>

      <div className="space-y-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
          Existing QR codes
        </h2>
        {codes.length === 0 ? (
          <p className="text-[11px] text-zinc-500">
            No QR codes yet. Generate your first one above.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {codes.map((code) => (
              <div
                key={code.id}
                className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
              >
                {code.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={code.image_url}
                    alt={code.table_number || 'QR code'}
                    className="h-40 w-full rounded bg-zinc-950 object-contain"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded bg-zinc-950 text-[11px] text-zinc-500">
                    No image
                  </div>
                )}
                <div className="space-y-1 text-[11px]">
                  <p className="font-semibold text-zinc-200">
                    Table {code.table_number ?? '—'}
                  </p>
                  <p className="truncate text-zinc-500">{code.target_url}</p>
                  <a
                    href={code.image_url ?? code.target_url}
                    download={`qr-table-${code.table_number ?? code.id}.png`}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-3 py-1 text-[11px] text-zinc-200 hover:border-amber-300 hover:text-amber-200"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


