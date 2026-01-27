'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert } from '@/components/Alert';
import Image from 'next/image';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('maury_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || profile?.role !== 'customer') {
          await supabase.auth.signOut();
          setError('Accesso negato. Questa area è riservata ai clienti.');
          return;
        }
      }

      router.push('/dashboard');
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Email o password errati.');
      } else {
        setError('Si è verificato un errore. Riprova più tardi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-primary/20 selection:text-primary overflow-hidden">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <Image
              src="/logo-hm-new.png"
              alt="HM Management"
              width={180}
              height={70}
              className="mx-auto drop-shadow-sm"
              priority
            />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic mb-2 uppercase">Portale Clienti</h1>
          <p className="text-slate-500 font-medium tracking-tight">Accedi all'area riservata di HM Management</p>
        </div>

        <div className="card-premium">
          {error && (
            <div className="mb-8">
              <Alert
                variant="error"
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="label-premium">Il tuo Indirizzo Email</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  placeholder="nome@esempio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-16 py-5"
                />
                <Mail className="w-6 h-6 text-slate-300 group-focus-within:text-primary transition-all duration-300 absolute left-6 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end pr-1">
                <label className="label-premium !mb-0">Password di Accesso</label>
                <Link href="/auth/forgot-password" title="Recupera password" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary-hover transition-colors">
                  Dimenticata?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-16 py-5"
                />
                <Lock className="w-6 h-6 text-slate-300 group-focus-within:text-primary transition-all duration-300 absolute left-6 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-5 flex items-center justify-center gap-3 !rounded-2xl group shadow-xl shadow-primary/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Accesso in corso...</span>
                </>
              ) : (
                <>
                  <span>Entra nel Portale</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-60">
          &copy; {new Date().getFullYear()} HM Management. ACCESSO RISERVATO.
        </p>
      </div>
    </div>
  );
}
