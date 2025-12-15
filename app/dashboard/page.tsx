import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardIndexPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: member } = await supabase
    .from('restaurant_members')
    .select('restaurants(slug)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  const slug = member?.restaurants?.slug;

  redirect(slug ? `/dashboard/${slug}` : '/auth/login');
}


