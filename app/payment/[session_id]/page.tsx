import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { randomUUID } from "node:crypto";

import { getSession } from "@/lib/sessions";
import { createClient } from "@/lib/supabase/server";

const API = 'https://connect.squareupsandbox.com/v2';

async function createPaymentLink (amount: number, location_id: string, session_id: string) {
  let checkout: string | undefined;

  const body = JSON.stringify({
    idempotency_key: randomUUID(),
    order_id: session_id,
    quick_pay: {
      name: 'Therapy session',
      amount_money: {
        amount,
        currency: "GBP"
      },
      location_id
    },
    redirect_url: `${process.env.NEXT_PUBLIC_URL}/payment/return`
  });

  try {
    const request = await fetch(`${API}/online-checkout/payment-links`, {
      method: 'POST',
      headers: new Headers({
        'Square-Version': '2024-05-15',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }),
      body
    });

    const { errors, payment_link } = await request.json();

    if (errors) throw new Error(errors[0].detail);

    checkout = payment_link.long_url;
  } catch (e) {
    console.error(e);
  }

  return checkout;
}

export default async function Page({ params }: { params: { session_id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const session = await getSession(params.session_id);

  if (session) {
    const payment_link = await createPaymentLink(session.cost, session.location_id, session.id);

    if (payment_link) {
      redirect(payment_link);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight lg:text-4xl">We couldn't process your payment at this time</h1>
          </div>
        </div>
      </div>
    </div>
  )
}