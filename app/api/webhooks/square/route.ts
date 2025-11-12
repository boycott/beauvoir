import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST (req: NextRequest) {
  const { type, data } = await req.json();

  if (type === 'payment.updated') {
    const { payment } = data.object;

    if (payment.status === 'COMPLETED') {
      const supabase = await createClient();

      const { error } = await supabase.from('Session').update({ paid: true }).eq('id', payment.order_id);

      if (error) {
        console.error(error);
      }
    }
  }

  return NextResponse.json({ status: 200 });
}
