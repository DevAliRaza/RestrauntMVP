import DashboardShell from '@/components/layout/DashboardShell';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  return (
    <DashboardShell restaurantSlug={restaurantSlug}>
      <div className="space-y-4 text-xs">
        <h1 className="text-lg font-semibold">Restaurant Settings</h1>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
          <p className="text-xs text-zinc-400">Settings page coming soon.</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Update branding, contact details, WhatsApp number, and payment
            methods.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

