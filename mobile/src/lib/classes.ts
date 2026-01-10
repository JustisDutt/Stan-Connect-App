import { supabase } from './supabaseClient';

type ClassRow = {
  id: string;
  name: string;
  code: string;
};

export async function fetchMyClasses(): Promise<ClassRow[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('*');

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function joinClassByCode(code: string): Promise<void> {
  // 1. Get the current authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('User is not authenticated');
  }

  // 2. Look up the class by code
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('code', code);

  if (classError) {
    throw classError;
  }

  if (!classes || classes.length === 0) {
    throw new Error('No class found with that code.');
  }

  if (classes.length > 1) {
    throw new Error('Multiple classes found with this code.');
  }

  const classId = classes[0].id;

  // 3. Insert membership WITH user_id
  const { error: joinError } = await supabase
    .from('class_members')
    .insert({
      class_id: classId,
      user_id: user.id,
    });

  if (joinError) {
    throw joinError;
  }
}
