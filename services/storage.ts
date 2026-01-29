import { createClient } from '@/utils/supabase/client';

/**
 * Uploads a file to the 'documents' bucket.
 * Path format: {userId}/{year}/{fileName}
 */
export async function uploadDocument(file: File, userId: string, year: string, month: string, customFileName?: string) {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${year}/${month}/${fileName}`;

  // Use custom filename if provided, otherwise use original file name
  const displayName = customFileName && customFileName.trim()
    ? `${customFileName.trim()}.${fileExt}`
    : file.name;

  // 1. Upload to Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (storageError) {
    throw storageError;
  }

  // 2. Insert Metadata into Database
  const { data: dbData, error: dbError } = await supabase
    .from('maury_documents')
    .insert({
      user_id: userId,
      name: displayName,
      file_path: filePath,
      year: year,
      month: month,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type.includes('pdf') ? 'pdf' : 'image',
      status: 'unread'
    })
    .select()
    .single();

  if (dbError) {
    // Optional: Cleanup storage if DB fails? For now, just throw.
    throw dbError;
  }

  return dbData;
}
