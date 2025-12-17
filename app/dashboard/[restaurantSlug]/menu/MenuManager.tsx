'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Category = {
  id: string;
  name: string;
};

type MenuDashboardItem = {
  id: string;
  name: string;
  base_price: number | string;
  category_id: string;
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
  const [items, setItems] = useState(initialItems);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategoryId, setNewItemCategoryId] = useState<string>('');
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  // When categories load for the first time, preselect the first one
  useEffect(() => {
    // Initialize default category once when categories first load
    if (sortedCategories.length > 0 && !newItemCategoryId) {
      // Defer to next tick to avoid setState directly in render
      const id = sortedCategories[0].id;
      Promise.resolve().then(() => setNewItemCategoryId(id));
    }
  }, [newItemCategoryId, sortedCategories]);

  const addCategory = async () => {
    if (!newCategoryName.trim() || !restaurantId) return;
    setSavingCategory(true);
    setError(null);
    const { data, error: dbError } = await supabase
      .from('menu_categories')
      .insert({
        restaurant_id: restaurantId,
        name: newCategoryName.trim(),
        position: categories.length,
      })
      .select('*')
      .single();
    setSavingCategory(false);
    if (dbError) {
      console.error('Add category error', dbError);
      setError(dbError.message || 'Failed to add category');
      return;
    }
    if (data) {
      const newCategory = data as Category;
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName('');
      if (!newItemCategoryId) {
        setNewItemCategoryId(newCategory.id);
      }
    }
  };

  const addItem = async () => {
    if (!restaurantId) return;
    if (!newItemName.trim() || !newItemPrice.trim() || !newItemCategoryId) {
      setError('Please enter name, price and choose category.');
      return;
    }
    const priceNumber = Number(newItemPrice);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    setSavingItem(true);
    setError(null);
    const { data, error: dbError } = await supabase
      .from('menu_items')
      .insert({
        restaurant_id: restaurantId,
        category_id: newItemCategoryId,
        name: newItemName.trim(),
        base_price: priceNumber,
        position: items.length,
        is_available: true,
      })
      .select('id, name, base_price, category_id')
      .single();
    setSavingItem(false);

    if (dbError) {
      console.error('Add item error', dbError);
      setError(dbError.message || 'Failed to add item');
      return;
    }

    if (data) {
      const newItem = data as MenuDashboardItem;
      setItems((prev) => [...prev, newItem]);
      setNewItemName('');
      setNewItemPrice('');
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

      {error && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
          {error}
        </p>
      )}

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
            disabled={savingCategory}
            onClick={addCategory}
            className="rounded-lg bg-amber-400 px-3 py-2 text-[11px] font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-70"
          >
            Add
          </button>
        </div>
        <div className="space-y-1">
          {sortedCategories.map((cat) => (
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
        <h2 className="text-sm font-semibold">Add item</h2>
        <div className="grid gap-2 md:grid-cols-[2fr,1fr,1.5fr,auto]">
          <input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name"
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
          <input
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            placeholder="Price (Rs)"
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
          <select
            value={newItemCategoryId}
            onChange={(e) => setNewItemCategoryId(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] outline-none ring-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          >
            <option value="">Select category</option>
            {sortedCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={savingItem}
            onClick={addItem}
            className="rounded-lg bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-70"
          >
            Add item
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Items</h2>
        <div className="space-y-1">
          {sortedCategories.map((cat) => {
            const catItems = items.filter((i) => i.category_id === cat.id);
            if (!catItems.length) return null;
            return (
              <div key={cat.id} className="space-y-1">
                <p className="text-[11px] font-semibold text-zinc-300">
                  {cat.name}
                </p>
                {catItems.map((item) => (
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
            );
          })}
          {!items.length && (
            <p className="text-[11px] text-zinc-500">
              No items yet. Add your first item above.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

