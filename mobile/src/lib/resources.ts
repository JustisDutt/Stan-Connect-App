import { supabase } from './supabaseClient';

export type ClassResourceRow = {
  id: string;
  class_id: string;
  uploader_id: string;
  storage_path: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  created_at: string;
  profiles: {
    email: string;
  }[] | null;
};

export async function fetchClassResources(
  classId: string
): Promise<ClassResourceRow[]> {
  const { data, error } = await supabase
    .from('class_resources')
    .select(
      `
      id,
      class_id,
      uploader_id,
      storage_path,
      original_filename,
      file_type,
      file_size,
      created_at,
      profiles:profiles!uploader_id (
        email
      )
    `
    )
    .eq('class_id', classId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchClassResources error:', error);
    throw error;
  }

  return (data ?? []) as ClassResourceRow[];
}
