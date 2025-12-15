'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function CheckoutPage({
  params,
}: {
  params: { restaurantSlug: string };
}) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a fuller implementation, hydrate cart from a shared store or localStorage.
  const cart: { id: string; name: string; price: number; quantity: number }[] =
    [];

  const placeOrder = async () => {
    if (!cart.length) {
      setError('Your cart is empty.');
      return;
    }
    setLoading(true);
    setError(null);

    const { data: restaurant, error: rErr } = await supabase
      .from('restaurants')
      .select('id')
      .eq('slug', params.restaurantSlug)
      .single();

    if (rErr || !restaurant) {
      setError('Could not load restaurant.');
      setLoading(false);
      return;
    }

    const subTotal = cart.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const { data: order, error: oErr } = await supabase
      .from('orders')
      .insert({
        restaurant_id: restaurant.id,
        source_id: 2,
        order_number: `R-${Date.now()}`,
        customer_name: name,
        customer_phone: phone,
        delivery_type: 'dine_in',
        sub_total: subTotal,
        total_amount: subTotal,
      })
      .select('id')
      .single();

    if (oErr || !order) {
      setError(oErr?.message ?? 'Could not place order.');
      setLoading(false);
      return;
    }

    const lineItems = cart.map((i) => ({
      order_id: order.id,
      menu_item_id: i.id,
      name_snapshot: i.name,
      price_snapshot: i.price,
      quantity: i.quantity,
      total_price: i.price * i.quantity,
    }));

    const { error: liErr } = await supabase.from('order_items').insert(lineItems);

    if (liErr) {
      setError(liErr.message);
      setLoading(false);
      return;
    }

    router.push(`/r/${params.restaurantSlug}/order-success`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-50">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 text-xs">
        <h1 className="text-lg font-semibold">Checkout</h1>
        <p className="text-[11px] text-zinc-400">
          Enter your details to place an in-app order. For WhatsApp orders, go
          back and choose the WhatsApp button instead.
        </p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] text-zinc-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-zinc-400">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        <button
          type="button"
          disabled={loading}
          onClick={placeOrder}
          className="mt-1 flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-[11px] font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-70"
        >
          {loading ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </div>
  );
}


