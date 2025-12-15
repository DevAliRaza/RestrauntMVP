 'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Category = {
  id: string;
  name: string;
};

type MenuDashboardItem = {
  id: string;
  name: string;
  base_price: number | string;
};

interface MenuManagerProps {
  restaurantId?: string;
  restaurantSlug: string;
  initialCategories: Category[];
  initialItems: MenuDashboardItem[];
}

export default function MenuManager({
  restaurantId,
  restaurantSlug,
  initialCategories,
  initialItems,
}: MenuManagerProps) {
  const supabase = createSupabaseBrowserClient();
  const [categories, setCategories] = useState(initialCategories);
  const [items] = useState(initialItems);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [saving, setSaving] = useState(false);

  const addCategory = async () => {
    if (!newCategoryName.trim() || !restaurantId) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('menu_categories')
      .insert({
        restaurant_id: restaurantId,
        name: newCategoryName.trim(),
        position: categories.length,
      })
      .select('*')
      .single();
    setSaving(false);
    if (!error && data) {
      const newCategory = data as Category;
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName('');
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Menu</h1>
        <a
          href={`/r/${restaurantSlug}`}
          target="_blank"
          className="text-amber-300 hover:underline"
        >
          View public menu
        </a>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Categories</h2>
        <div className="flex gap-2">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Add new category"
            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
          <button
            type="button"
            disabled={saving}
            onClick={addCategory}
            className="rounded-lg bg-amber-400 px-3 py-2 text-[11px] font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-70"
          >
            Add
          </button>
        </div>
        <div className="space-y-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2"
            >
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Items (read-only preview)</h2>
        <p className="text-[11px] text-zinc-500">
          Full item editing (prices, availability, options) can be added on top of
          this structure.
        </p>
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <span>{item.name}</span>
                <span className="text-[11px] text-amber-300">
                  Rs {Number(item.base_price).toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


