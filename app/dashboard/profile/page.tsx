import { createClient } from '@/utils/supabase/server';
import ProfileClient from '@/components/ProfileClient';

export default async function Profile() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return <ProfileClient user={user} />;
}
