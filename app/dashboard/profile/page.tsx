import { createClient } from '@/utils/supabase/server';
import ProfileClient from '@/components/ProfileClient';

export default async function Profile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container">
      <h1 className="mb-6">Il mio Profilo</h1>
      <div className="card max-w-lg">
        <ProfileClient user={user} />
      </div>
    </div>
  );
}
