import { redirect, RedirectType } from 'next/navigation';
import { getParticipantToken } from "@/lib/sessions";
import MeetingRoom from '@/components/meeting-room';

export default async function MeetingPage(props: { params: Promise<{ custom_participant_id: string }>}) {
  const { custom_participant_id } = await props.params;
  let token: string | undefined;

  try {
    if (!custom_participant_id) throw new Error('No room id passed in.');

    token = await getParticipantToken(custom_participant_id);

    if (!token) throw new Error('No meeting associated with room id.');
  } catch (e) {
    const error = e as unknown as Error;

    console.error(error);

    redirect(`/?error=${error.message}`, RedirectType.replace);
  }

  return (
    <MeetingRoom authToken={token} />
  );
}