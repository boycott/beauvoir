import { redirect } from "next/navigation";

import { getSession } from "@/lib/sessions";
import { createPaymentLink } from "@/lib/square";
import { createClient } from "@/lib/supabase/server";

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
            <h1 className="text-balance text-3xl font-semibold tracking-tight lg:text-4xl">We cannot process your payment at this time.</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
