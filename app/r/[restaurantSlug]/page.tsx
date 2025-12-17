import { createSupabaseServerClient } from '@/lib/supabase/server';
import RestaurantMenuPage from './RestaurantMenuPage';

interface Props {
  params: Promise<{ restaurantSlug: string }>;
  searchParams: Promise<{ table?: string; branch?: string }>;
}

type MenuItemRow = {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  base_price: number;
  discount_price?: number;
};

export default async function RestaurantPage({ params, searchParams }: Props) {
  const { restaurantSlug } = await params;
  const resolvedSearch = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', restaurantSlug)
    .eq('is_active', true)
    .single();

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50">
        <p className="text-sm text-zinc-400">Restaurant not found.</p>
      </div>
    );
  }

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_active', true)
    .order('position', { ascending: true });

  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_available', true)
    .order('position', { ascending: true });

  const normalizedItems = (items ?? []).map<MenuItemRow>((item) => ({
    ...item,
    base_price: Number(item.base_price),
    discount_price: item.discount_price
      ? Number(item.discount_price)
      : undefined,
  }));

  return (
    <RestaurantMenuPage
      restaurant={restaurant}
      categories={categories ?? []}
      items={normalizedItems}
      table={resolvedSearch.table}
      branchSlug={resolvedSearch.branch}
    />
  );
}


