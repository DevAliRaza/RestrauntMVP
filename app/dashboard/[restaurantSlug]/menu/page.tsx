import DashboardShell from '@/components/layout/DashboardShell';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import MenuManager from './MenuManager';

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('slug', restaurantSlug)
    .single();

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurant?.id ?? null)
    .order('position');

  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant?.id ?? null)
    .order('position');

  return (
    <DashboardShell restaurantSlug={restaurantSlug}>
      <MenuManager
        restaurantId={restaurant?.id}
        restaurantSlug={restaurantSlug}
        initialCategories={categories ?? []}
        initialItems={items ?? []}
      />
    </DashboardShell>
  );
}


