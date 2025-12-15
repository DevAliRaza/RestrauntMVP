import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-16 px-6 py-12 md:flex-row md:justify-between md:py-20">
        <section className="max-w-xl space-y-6">
          <p className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-300/80 shadow-sm backdrop-blur">
            Lahore · QR Menus · Zero Commission
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Launch your{' '}
            <span className="block bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
              restaurant menu & ordering
            </span>
            in 5 days.
          </h1>
          <p className="text-pretty text-base text-zinc-300 sm:text-lg">
            A ready-made QR menu and online ordering system built for Lahore
            restaurants. No Foodpanda commissions, just direct WhatsApp and
            in-app orders.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-7 py-3 text-sm font-medium text-zinc-950 shadow-lg shadow-amber-400/30 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Get started
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/40 px-7 py-3 text-sm font-medium text-zinc-100 transition hover:border-amber-300/70 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              View live demo
            </Link>
          </div>
          <p className="text-xs text-zinc-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-amber-300 hover:underline">
              Sign in
            </Link>
          </p>
          <div className="flex flex-wrap gap-6 text-xs text-zinc-400">
            <div>
              <p className="font-semibold text-zinc-200">For</p>
              <p>Restaurants · Cafes · Dhabas · Home chefs</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-200">Includes</p>
              <p>Digital menu, QR codes, WhatsApp + in-app orders</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-200">Pricing</p>
              <p>One-time setup + monthly hosting</p>
            </div>
          </div>
        </section>

        <section className="mt-10 w-full max-w-md md:mt-0">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-2xl">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 left-10 h-32 w-32 rounded-full bg-rose-400/10 blur-3xl" />

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
                QR Menu Snapshot
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Zero commission
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <FeatureRow
                title="Scan · Browse · Order"
                subtitle="Guests scan a QR code, see your full menu with photos, and order in a few taps."
              />
              <FeatureRow
                title="WhatsApp or in-app"
                subtitle="Start with WhatsApp ordering, upgrade to full in-app order management anytime."
              />
              <FeatureRow
                title="Owner dashboard"
                subtitle="Update prices, mark items out of stock, and see orders in one simple panel."
              />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-400">
              <p>Built specifically for Lahore restaurants and food brands.</p>
              <span className="rounded-full bg-zinc-900 px-3 py-1 font-medium text-amber-200">
                Ready in 5 weeks
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-zinc-50">{title}</p>
        <p className="text-xs text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
}

