'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import {
  UserCircle,
  Lock,
  Mail,
  Loader2,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { Alert } from './Alert';

export default function ProfileClient({
  user: initialUser
}: {
  user: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!user) {
      const getUser = async () => {
        const {
          data: { user: fetchedUser }
        } = await supabase.auth.getUser();
        if (fetchedUser) {
          setUser(fetchedUser);
        }
      };
      getUser();
    }
  }, [user, supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Le password non coincidono.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Password aggiornata con successo!'
      });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      // Clear any cached data
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setMessage({ type: 'error', text: 'Errore durante il logout. Riprova.' });
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-black uppercase tracking-widest text-[10px]">
          Caricamento profilo...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">
          Il Mio Profilo
        </h2>
        <p className="text-slate-500 font-medium">
          Gestisci le tue informazioni di accesso.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Card */}
        <div className="lg:col-span-1">
          <div className="card-premium h-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mb-6 shadow-sm shadow-primary/5">
                <UserCircle className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                Account Cliente
              </h3>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-100 mb-8">
                <CheckCircle2 className="w-3 h-3" />
                Attivo
              </div>

              <div className="w-full space-y-4 pt-8 border-t border-slate-50">
                <div className="text-left">
                  <span className="label-premium">Email Registrata</span>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="w-full pt-8 border-t border-slate-50">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 font-black text-xs uppercase tracking-widest rounded-2xl border border-red-100 transition-all duration-300 disabled:opacity-50"
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Disconnessione...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>Esci dall&apos;Account</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2">
          <div className="card-premium">
            <h3 className="text-xl font-black text-slate-900 tracking-tight italic mb-8">
              Sicurezza Account
            </h3>

            {message && (
              <div className="mb-10">
                <Alert
                  variant={message.type}
                  message={message.text}
                  onClose={() => setMessage(null)}
                />
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="label-premium">Nuova Password</label>
                  <div className="relative group">
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-premium pl-14"
                    />
                    <Lock className="w-5 h-5 text-slate-300 group-focus-within:text-primary transition-all duration-300 absolute left-6 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="label-premium">Conferma Password</label>
                  <div className="relative group">
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-premium pl-14"
                    />
                    <Lock className="w-5 h-5 text-slate-300 group-focus-within:text-primary transition-all duration-300 absolute left-6 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                <button
                  type="submit"
                  className="btn-premium w-full md:w-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-3" />
                      AGGIORNAMENTO...
                    </>
                  ) : (
                    'AGGIORNA PASSWORD'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
