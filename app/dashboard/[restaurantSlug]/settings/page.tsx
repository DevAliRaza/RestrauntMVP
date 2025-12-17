import DashboardShell from '@/components/layout/DashboardShell';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { RestaurantSettingsForm } from '@/components/dashboard/RestaurantSettingsForm';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name, description, whatsapp_number, primary_color')
    .eq('slug', restaurantSlug)
    .single();

  if (!restaurant) {
    return (
      <DashboardShell restaurantSlug={restaurantSlug}>
        <div className="space-y-4 text-xs">
          <h1 className="text-lg font-semibold">Restaurant Settings</h1>
          <p className="text-xs text-red-400">
            No restaurant was found for this slug.
          </p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell restaurantSlug={restaurantSlug}>
      <div className="space-y-4 text-xs">
        <h1 className="text-lg font-semibold">Restaurant Settings</h1>
        <p className="text-[11px] text-zinc-500">
          Update your restaurant details, WhatsApp number, and accent color used
          in the menu.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <RestaurantSettingsForm
            restaurantId={restaurant.id}
            initialName={restaurant.name}
            initialDescription={restaurant.description}
            initialWhatsapp={restaurant.whatsapp_number}
            initialPrimaryColor={restaurant.primary_color}
          />
        </div>
      </div>
    </DashboardShell>
  );
}

