import DashboardShell from '@/components/layout/DashboardShell';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function RestaurantDashboardPage({
  params,
}: {
  params: { restaurantSlug: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name')
    .eq('slug', params.restaurantSlug)
    .single();

  const today = new Date().toISOString().slice(0, 10);

  const { data: ordersToday } = await supabase
    .from('orders')
    .select('id')
    .eq('restaurant_id', restaurant?.id ?? null)
    .gte('created_at', today);

  return (
    <DashboardShell restaurantSlug={params.restaurantSlug}>
      <div className="space-y-4 text-xs">
        <h1 className="text-lg font-semibold">
          {restaurant?.name ?? 'Restaurant'} overview
        </h1>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Orders today" value={ordersToday?.length ?? 0} />
          {/* Placeholders for future metrics */}
          <StatCard label="Visitors" value="—" />
          <StatCard label="Revenue" value="—" />
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3">
      <p className="text-[11px] text-zinc-400">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}


