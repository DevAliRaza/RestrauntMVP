import { createSupabaseServerClient } from '@/lib/supabase/server';
import DashboardShell from '@/components/layout/DashboardShell';

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantSlug: string }>;
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { restaurantSlug } = await params;
  const { status: statusParam = 'all', q: qParam = '' } = await searchParams;
  const currentStatus = statusParam || 'all';
  const currentQuery = qParam || '';

  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name')
    .eq('slug', restaurantSlug)
    .single();

  let query = supabase
    .from('orders')
    .select('*, order_items(id, name_snapshot, quantity, total_price)')
    .eq('restaurant_id', restaurant?.id ?? null)
    .order('created_at', { ascending: false })
    .limit(50);

  if (currentStatus !== 'all') {
    query = query.eq('status', currentStatus);
  }

  if (currentQuery) {
    // Match on customer name or phone
    const pattern = `%${currentQuery}%`;
    query = query.or(
      `customer_name.ilike.${pattern},customer_phone.ilike.${pattern}`
    );
  }

  const { data: orders } = await query;

  return (
    <DashboardShell restaurantSlug={restaurantSlug}>
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Orders</h1>
          <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
            {orders?.length ?? 0} total
          </span>
        </div>

        <form
          method="get"
          className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-900 bg-zinc-950/60 p-3"
        >
          <div>
            <label className="mb-1 block text-[11px] text-zinc-400">
              Status
            </label>
            <select
              name="status"
              defaultValue={currentStatus}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="mb-1 block text-[11px] text-zinc-400">
              Search (name or phone)
            </label>
            <input
              name="q"
              defaultValue={currentQuery}
              placeholder="e.g. ali or 0313…"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-[11px] font-semibold text-zinc-950 hover:bg-amber-300"
          >
            Apply
          </button>
        </form>

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
                <details className="group space-y-2">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
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
                  </summary>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mt-2 space-y-1 border-t border-zinc-800 pt-2 text-[11px] text-zinc-300">
                      {order.order_items.map((item: {
                        id: string;
                        name_snapshot: string | null;
                        quantity: number | null;
                        total_price: number | null;
                      }) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <span>
                            {item.name_snapshot}{' '}
                            <span className="text-zinc-500">
                              x{item.quantity}
                            </span>
                          </span>
                          <span>
                            Rs {Number(item.total_price ?? 0).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

