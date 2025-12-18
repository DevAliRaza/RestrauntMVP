import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// Utility to slugify a name/email prefix
function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60);
}

export async function POST() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // If user already has a membership, reuse it
  const { data: member } = await supabase
    .from('restaurant_members')
    .select('restaurants!inner(slug)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (member?.restaurants) {
    const rel = member.restaurants as { slug: string } | { slug: string }[];
    const slug = Array.isArray(rel) ? rel[0]?.slug : rel.slug;
    if (slug) {
      return NextResponse.json({ slug });
    }
  }

  // If user owns a restaurant already, reuse it
  const { data: owned } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle();

  if (owned?.slug) {
    return NextResponse.json({ slug: owned.slug });
  }

  // Create a new restaurant + membership
  const baseSlug = slugify(user.email || user.id);
  let slug = baseSlug || 'my-restaurant';
  let suffix = 1;

  // Ensure slug uniqueness
  while (true) {
    const { data: existing } = await supabase
      .from('restaurants')
      .select('id')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${suffix++}`;
  }

  const { data: restaurant, error: createError } = await supabase
    .from('restaurants')
    .insert({
      owner_id: user.id,
      name: `${user.email?.split('@')[0] || 'My'} Restaurant`,
      slug,
      whatsapp_number: null,
      city: 'Lahore',
      is_active: true,
    })
    .select('id, slug')
    .single();

  if (createError || !restaurant) {
    return NextResponse.json(
      { error: createError?.message || 'Failed to create restaurant' },
      { status: 400 }
    );
  }

  // Add membership as owner
  await supabase.from('restaurant_members').insert({
    restaurant_id: restaurant.id,
    user_id: user.id,
    role: 'owner',
  });

  return NextResponse.json({ slug: restaurant.slug });
}


