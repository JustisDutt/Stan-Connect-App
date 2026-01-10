import { supabase } from './supabaseClient';

export type MessageRow = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    email: string;
  }[];
};

export async function fetchMessages(classId: string): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles (
        email
      )
    `)
    .eq('class_id', classId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function sendMessage(classId: string, content: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('messages')
    .insert({
      class_id: classId,
      user_id: user.id,
      content,
    });

  if (error) {
    throw error;
  }
}
