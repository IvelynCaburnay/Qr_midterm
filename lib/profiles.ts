import { supabase } from './supabase';

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'student' | 'teacher';
};

export async function getProfile(
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('getProfile error:', error);
    return null;
  }

  return data;
}
