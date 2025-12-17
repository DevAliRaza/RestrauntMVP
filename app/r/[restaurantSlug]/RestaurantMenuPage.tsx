'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Restaurant = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  whatsapp_number?: string;
};

type Category = {
  id: string;
  name: string;
  description?: string;
};

type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  base_price: number;
  discount_price?: number;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

interface Props {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
  table?: string;
  branchSlug?: string;
}

export default function RestaurantMenuPage({
  restaurant,
  categories,
  items,
  table,
}: Props) {
  const [cartOpen, setCartOpen] = useState(false);
  const storageKey = `restaurant-cart:${restaurant.slug}`;
  const isInitialMount = useRef(true);
  
  // Initialize cart with lazy initializer from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  // Persist cart to localStorage whenever it changes (after initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // ignore quota errors
    }
  }, [cart, storageKey]);

  const incrementItem = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const price = Number(item.discount_price ?? item.base_price);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: item.id, name: item.name, price, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const decrementItem = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="relative">
        <div
          className="h-40 w-full bg-cover bg-center md:h-56"
          style={{
            backgroundImage: restaurant.cover_image_url
              ? `url(${restaurant.cover_image_url})`
              : undefined,
          }}
        >
          {!restaurant.cover_image_url && (
            <div className="h-full w-full bg-gradient-to-r from-amber-400 to-red-400" />
          )}
        </div>
        <div className="mx-auto -mt-10 flex max-w-4xl items-end gap-4 px-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
            {restaurant.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold">
                {restaurant.name?.charAt(0)}
              </span>
            )}
          </div>
          <div className="pb-2">
            <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                {restaurant.description}
              </p>
            )}
            {table && (
              <p className="mt-1 inline-flex items-center rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-0.5 text-[11px] text-emerald-300">
                Table {table}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl gap-8 px-4 pb-28 pt-6 md:pb-10">
        <div className="flex-1 space-y-4 text-sm">
          {categories.map((cat) => (
            <section key={cat.id} id={cat.id} className="space-y-2">
              <h2 className="text-base font-semibold">{cat.name}</h2>
              {cat.description && (
                <p className="text-xs text-zinc-400">{cat.description}</p>
              )}
              <div className="space-y-3">
                {items
                  .filter((i) => i.category_id === cat.id)
                  .map((item) => {
                    const inCart = cart.find((c) => c.id === item.id);
                    const qty = inCart?.quantity ?? 0;
                    return (
                      <div
                        key={item.id}
                        className="flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-left transition hover:border-amber-400/60"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm font-semibold text-amber-300">
                              Rs{' '}
                              {Number(
                                item.discount_price ?? item.base_price
                              ).toFixed(0)}
                            </p>
                          </div>
                          {item.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => decrementItem(item.id)}
                            disabled={qty === 0}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 text-xs text-zinc-200 disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="min-w-[1.5rem] text-center text-xs">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => incrementItem(item)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-semibold text-zinc-950 hover:bg-amber-300"
                          >
                            +
                          </button>
                        </div>
                        {item.image_url && (
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>

        <aside className="hidden w-72 md:block">
          <CartPanel
            restaurantSlug={restaurant.slug}
            whatsapp={restaurant.whatsapp_number}
            table={table}
            cart={cart}
            subtotal={subtotal}
          />
        </aside>
      </main>

      <div className="fixed bottom-3 left-0 right-0 px-4 md:hidden">
        {cart.length > 0 && (
          <button
            type="button"
            onClick={() => setCartOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-full bg-amber-400 px-5 py-3 text-xs font-semibold text-zinc-900 shadow-lg"
          >
            <span>{cart.length} item(s)</span>
            <span>View cart · Rs {subtotal.toFixed(0)}</span>
          </button>
        )}
      </div>

      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] space-y-3 overflow-auto rounded-t-2xl bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Your order</p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="text-[11px] text-zinc-400"
              >
                Close
              </button>
            </div>
            <CartPanel
              restaurantSlug={restaurant.slug}
              whatsapp={restaurant.whatsapp_number}
              table={table}
              cart={cart}
              subtotal={subtotal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CartPanel({
  restaurantSlug,
  whatsapp,
  table,
  cart,
  subtotal,
}: {
  restaurantSlug: string;
  whatsapp?: string;
  table?: string;
  cart: { id: string; name: string; price: number; quantity: number }[];
  subtotal: number;
}) {
  if (!cart.length) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-xs text-zinc-400">
        Your cart is empty.
      </div>
    );
  }

  const whatsappText = encodeURIComponent(
    [
      'New order from QR menu:',
      ...cart.map(
        (i) => `• ${i.name} x${i.quantity} = Rs ${(i.price * i.quantity).toFixed(0)}`
      ),
      `Total: Rs ${subtotal.toFixed(0)}`,
      table ? `Table: ${table}` : '',
    ]
      .filter(Boolean)
      .join('\n')
  );

  const whatsappUrl =
    whatsapp &&
    `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${whatsappText}`;

  return (
    <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-xs">
      <div className="max-h-56 space-y-2 overflow-auto pr-1">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-[11px]"
          >
            <span>
              {item.name}{' '}
              <span className="text-zinc-500">x{item.quantity}</span>
            </span>
            <span>Rs {(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-zinc-800 pt-2 text-[11px]">
        <span className="text-zinc-400">Subtotal</span>
        <span className="text-sm font-semibold">
          Rs {subtotal.toFixed(0)}
        </span>
      </div>
      <div className="grid gap-2 pt-1">
        <Link
          href={`/r/${restaurantSlug}/checkout`}
          className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-[11px] font-semibold text-zinc-950 hover:bg-amber-300"
        >
          In-app checkout
        </Link>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            className="inline-flex w-full items-center justify-center rounded-full border border-emerald-500/60 px-4 py-2 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/10"
          >
            Order via WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}


