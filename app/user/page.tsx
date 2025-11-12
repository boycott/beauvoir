import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCustomParticipantId, getSessions, type SessionWithLink } from "@/lib/sessions";
import SessionsTable from "@/components/sessions-table";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const sessions = await Promise.all((await getSessions(data.claims.sub)).map(async (session) => {
    const custom_participant_id = await getCustomParticipantId(session.participant_id);

    return { ...session, custom_participant_id } as unknown as SessionWithLink;
  }));

  return (
    <SessionsTable sessions={sessions} />
  );
}
