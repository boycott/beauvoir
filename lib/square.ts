'use server';

import { randomUUID } from "node:crypto";
import { createClient } from '@/lib/supabase/server';

const API = process.env.NEXT_PUBLIC_SQUARE_API;

const headers = new Headers({
  'Square-Version': '2025-10-16',
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
});

export async function createPaymentLink (amount: number, session_id: string) {
  let checkout: string | undefined;

  const body = JSON.stringify({
    idempotency_key: randomUUID(),
    description: session_id,
    quick_pay: {
      name: 'Therapy Session',
      price_money: {
        amount,
        currency: "GBP"
      },
      location_id: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!
    }
  });

  const request = await fetch(`${API}/online-checkout/payment-links`, {
    method: 'POST',
    headers,
    body
  });

  if (!request) throw new Error('Customer not connected');

  const { error, payment_link } = await request.json();

  if (error) throw new Error(error.detail);

  if (payment_link) {
    const supabase = await createClient();

    const { error } = await supabase.from('Session').update({ order_id: payment_link.order_id }).eq('id', session_id).limit(1);

    if (error) throw new Error(error.message);

    checkout = payment_link.long_url;
  }

  return checkout;
}
