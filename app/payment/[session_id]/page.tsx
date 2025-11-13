import { redirect, RedirectType } from "next/navigation";

import { getSession } from "@/lib/sessions";
import { createPaymentLink } from "@/lib/square";
import { createClient } from "@/lib/supabase/server";

export default async function Page(props: { params: Promise<{ session_id: string }>}) {
  let payment_link;
  const { session_id } = await props.params;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  try {
    const session = await getSession(session_id);

    if (!session) throw new Error('No session found');

    payment_link = await createPaymentLink(session.cost, session.id);

    if (!payment_link) throw new Error('No payment link found');

  } catch (e) {
    console.error(e);
  }

  if (payment_link) redirect(payment_link, RedirectType.push);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight lg:text-4xl">We cannot process your payment at this time.</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
