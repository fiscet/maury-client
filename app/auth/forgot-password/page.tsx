'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase'; // Adjust import if needed (should be browser client)
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string; } | null>(null);

  // Ensure we use a browser client
  const supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Determines where to redirect after clicking the email link
      // For Client app, we want to go straight to the profile/dashboard to reset
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/profile`,
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Controlla la tua email. Ti abbiamo inviato un link per reimpostare la password.'
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <div className="text-center mb-4">
          <img src="/logo-hm-new.png" alt="HM Management" style={{ maxWidth: '150px', height: 'auto' }} />
        </div>
        <h2 className="text-center mb-6">Recupera Password</h2>

        {message && (
          <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset}>
          <div className="form-group mb-4">
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.com"
              required
              className="input w-full"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Invio in corso...' : 'Invia Link di Recupero'}
          </button>
        </form>

        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-gray shadow-none hover:underline">
            Torna al Login
          </Link>
        </p>
      </div>
    </div>
  );
}
