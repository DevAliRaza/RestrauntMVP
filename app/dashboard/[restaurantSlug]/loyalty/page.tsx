import DashboardShell from '@/components/layout/DashboardShell';

export default async function LoyaltyPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  return (
    <DashboardShell restaurantSlug={restaurantSlug}>
      <div className="space-y-4 text-xs">
        <h1 className="text-lg font-semibold">Loyalty & Customer Points</h1>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
          <p className="text-xs text-zinc-400">Loyalty program coming soon.</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Track customer visits, reward points, and redemptions.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

