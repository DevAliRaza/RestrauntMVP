import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  const { restaurantId, branchId, tableNumber, targetUrl } = await req.json();
  const supabase = await createSupabaseServerClient();

  const pngDataUrl = await QRCode.toDataURL(targetUrl, {
    margin: 1,
    width: 512,
  });

  const { data, error } = await supabase
    .from('qr_codes')
    .insert({
      restaurant_id: restaurantId,
      branch_id: branchId,
      table_number: tableNumber,
      target_url: targetUrl,
      image_url: pngDataUrl,
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ qr: data });
}


