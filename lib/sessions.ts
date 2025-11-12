'use server';
import { createClient } from '@/lib/supabase/server';

export type Session = {
  id: string;
  user_id: string;
  participant_id: string;
  start_time: string;
  end_time: string;
  cost: number;
  paid: boolean;
  attendance: string;
  location_id: string;
};

export type SessionWithLink = Session & {
  custom_participant_id: string;
}

export const getSession = async (id: string) => {
  let session: Session | undefined;

  try {
    const supabase = await createClient();

    const { error, data } = await supabase.from('Session').select().eq('id', id).limit(1);

    if (error) throw new Error(error.message);

    if (data.length) session = data[0] as Session;
  } catch (e) {
    console.error(e);
  }

  return session;
}

export const getSessions = async (user_id: string) => {
  let sessions: Session[] = [];

  try {
    const supabase = await createClient();

    const { error, data } = await supabase.from('Session').select().eq('user_id', user_id).order('start_time');

    if (error) throw new Error(error.message);

    if (data.length) sessions = data as Session[];
  } catch (e) {
    console.error(e);
  }

  return sessions;
};

export const getCustomParticipantId = async (participant_id: string) => {
  let custom_participant_id: string | undefined;

  try {
    const supabase = await createClient();

    const { error, data } = await supabase.from('MeetingParticipant').select().eq('participant_id', participant_id).limit(1);

    if (error) throw new Error(error.message);

    if (data.length) custom_participant_id = data[0].custom_participant_id;
  } catch (e) {
    console.error(e);
  }

  return custom_participant_id;
};