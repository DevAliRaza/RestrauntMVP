import DashboardShell from '@/components/layout/DashboardShell';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { QRManager } from '@/components/dashboard/QRManager';

export default async function QRCodePage({
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

  const { data: codes } = await supabase
    .from('qr_codes')
    .select('id, table_number, target_url, image_url, created_at')
    .eq('restaurant_id', restaurant?.id ?? null)
    .order('created_at', { ascending: false })
    .limit(12);

  if (!restaurant) {
    return (
      <DashboardShell restaurantSlug={restaurantSlug}>
        <div className="space-y-4 text-xs">
          <h1 className="text-lg font-semibold">QR Codes</h1>
          <p className="text-xs text-red-400">
            No restaurant found for this slug.
          </p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell restaurantSlug={restaurantSlug}>
      <div className="space-y-4 text-xs">
        <h1 className="text-lg font-semibold">QR Codes</h1>
        <p className="text-[11px] text-zinc-500">
          Generate QR codes for tables and print them for your restaurant.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <QRManager
            restaurantId={restaurant.id}
            restaurantSlug={restaurantSlug}
            initialQRCodes={codes ?? []}
          />
        </div>
      </div>
    </DashboardShell>
  );
}

