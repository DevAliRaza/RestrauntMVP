import { createSupabaseServerClient } from '@/lib/supabase/server';
import DashboardShell from '@/components/layout/DashboardShell';

export default async function OrdersPage({
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

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('restaurant_id', restaurant?.id ?? null)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <DashboardShell restaurantSlug={params.restaurantSlug}>
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Orders</h1>
          <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
            {orders?.length ?? 0} total
          </span>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
            <p className="text-xs text-zinc-400">No orders yet.</p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Orders will appear here when customers place them.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200">
                        {order.order_number}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          order.status === 'new'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : order.status === 'completed'
                              ? 'bg-zinc-700 text-zinc-400'
                              : 'bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      {order.customer_name || 'Guest'} · {order.customer_phone}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {new Date(order.created_at).toLocaleString('en-PK', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-300">
                      Rs {Number(order.total_amount).toFixed(0)}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {order.delivery_type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

