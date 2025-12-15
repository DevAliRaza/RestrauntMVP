import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { restaurantId, eventType, payload } = await req.json();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('events').insert({
    restaurant_id: restaurantId,
    event_type: eventType,
    payload,
  });

  if (error) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}


