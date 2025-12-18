import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
// qrcode's types can be missing in some build environments (e.g. Vercel),
// so we fall back to an `any`-typed require here.
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const QRCode: any = require('qrcode');

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


