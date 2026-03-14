'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../src/lib/supabase';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const hasAdminQuery = searchParams?.has('admin');

  useEffect(() => {
    async function checkActiveSession() {
      if (!supabase) {
        setCheckingSession(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin');
      } else {
        setCheckingSession(false);
      }
    }
    checkActiveSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!hasAdminQuery) {
      setTimeout(() => {
        setError('Email atau Password salah.');
        setLoading(false);
      }, 800);
      return;
    }

    if (!supabase) {
      setError('Supabase is not configured yet. Please set up your .env file.');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Email atau Password salah.');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-[var(--text-primary)]">
         <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-[var(--text-primary)] font-montserrat relative page-in w-full">
      <div 
        className="w-full max-w-md p-8 rounded-2xl border backdrop-blur-md relative z-10 shadow-xl"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <button 
           onClick={() => router.push('/')}
           className="mb-6 flex items-center gap-2 text-sm font-semibold hover:opacity-75 transition-opacity"
           style={{ color: 'var(--text-secondary)' }}
        >
           ← Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Welcome back, Master.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg mb-6 text-sm border font-semibold" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none focus:border-[var(--green)] transition-all bg-transparent"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                placeholder="admin@knowrise.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none focus:border-[var(--green)] transition-all bg-transparent"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-70"
            style={{ background: 'var(--btn-active)', color: 'var(--btn-active-text)' }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-[var(--text-primary)]"><Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" /></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
