import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NoRestaurantFallback } from '@/components/dashboard/NoRestaurantFallback';

// If a user exists but has no restaurant membership yet, show a gentle
// onboarding fallback instead of redirecting back to /auth/login (loop).

export default async function DashboardIndexPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Try membership first
  const { data: member } = await supabase
    .from('restaurant_members')
    .select('restaurant_id, restaurants!inner(slug)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (member?.restaurants) {
    const rel = member.restaurants as { slug: string } | { slug: string }[];
    const slug = Array.isArray(rel) ? rel[0]?.slug : rel.slug;
    if (slug) {
      redirect(`/dashboard/${slug}`);
    }
  }

  // Fallback: if user owns a restaurant directly (owner_id)
  const { data: owned } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle();

  if (owned?.slug) {
    redirect(`/dashboard/${owned.slug}`);
  }

  // Last resort: show onboarding UI, avoid redirect loop
  return <NoRestaurantFallback />;
}


