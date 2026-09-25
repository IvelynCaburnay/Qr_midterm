import { supabase } from './supabase';

export type Event = {
  eventId: string;
  title: string;
  start: string;
  end: string;
};

export type CloudEvent = {
  id: string;
  event_code: string;
  title: string;
  start_time: string;
  end_time: string;
  created_by: string;
  created_at?: string;
};

export async function createEvent(
  event: Event
): Promise<void> {
  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      'You must be signed in to create an event.'
    );
  }

  const { error } = await supabase
    .from('events')
    .upsert(
      {
        event_code: event.eventId,
        title: event.title,
        start_time: event.start,
        end_time: event.end,
        created_by: user.id,
      },
      {
        onConflict: 'event_code',
      }
    );

  if (error) {
    throw error;
  }
}

export async function getEventsByTeacher(
  teacherId: string
): Promise<CloudEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select(
      'id, event_code, title, start_time, end_time, created_by, created_at'
    )
    .eq('created_by', teacherId)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'getEventsByTeacher error:',
      error
    );
    return [];
  }

  return data ?? [];
}

export async function getEventByCode(
  code: string
): Promise<CloudEvent | null> {
  const { data, error } = await supabase
    .from('events')
    .select(
      'id, event_code, title, start_time, end_time, created_by, created_at'
    )
    .eq('event_code', code)
    .maybeSingle();

  if (error) {
    console.error(
      'getEventByCode error:',
      error
    );
    return null;
  }

  return data;
}
