import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { restaurantId, code, amount } = await req.json();
  const supabase = await createSupabaseServerClient();

  const now = new Date().toISOString();

  const { data: promo, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('code', code)
    .eq('is_active', true)
    .lte('start_at', now)
    .gte('end_at', now)
    .single();

  if (error || !promo) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  if (promo.min_order_amount && amount < Number(promo.min_order_amount)) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  let discount = 0;
  if (promo.discount_type === 'percentage') {
    discount = (amount * Number(promo.discount_value)) / 100;
    if (promo.max_discount_amount) {
      discount = Math.min(discount, Number(promo.max_discount_amount));
    }
  } else {
    discount = Number(promo.discount_value);
  }

  return NextResponse.json({ valid: true, discount });
}


