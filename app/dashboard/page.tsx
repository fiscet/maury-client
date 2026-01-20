import { createClient } from '@/utils/supabase/server';
import DashboardClient from '@/components/DashboardClient';

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: documents } = await supabase
    .from('maury_documents')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <DashboardClient initialDocuments={documents || []} />
  );
}
