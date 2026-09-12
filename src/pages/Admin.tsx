import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import FlliAdminDashboard from '@/components/FlliAdminDashboard';
import { auth, googleProvider } from '@/lib/firebase';

const ADMIN_EMAILS = ['neifranchi@gmail.com'];

const isAllowedAdmin = (user: User | null) => {
  const email = user?.email?.toLowerCase();
  return Boolean(email && ADMIN_EMAILS.includes(email));
};

const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !isAllowedAdmin(currentUser)) {
        setError('Esta conta Google não possui acesso administrativo.');
        await signOut(auth).catch(() => undefined);
        setUser(null);
        setChecking(false);
        return;
      }

      setUser(currentUser);
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    setAuthenticating(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!isAllowedAdmin(result.user)) {
        await signOut(auth);
        setError('Esta conta Google não possui acesso administrativo.');
        return;
      }
      setUser(result.user);
    } catch (loginError: any) {
      console.error('F.LLI admin login error:', loginError);
      const code = loginError?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        setError('Login cancelado.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('O domínio fllifranchi.com ainda precisa ser autorizado no Firebase Authentication.');
      } else {
        setError('Não foi possível entrar com o Google. Verifique a configuração do Firebase Authentication.');
      }
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#11110f] text-[#e9e5d8]">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Validando acesso...</span>
      </div>
    );
  }

  if (user && isAllowedAdmin(user)) {
    return (
      <div className="relative">
        <div className="fixed right-4 top-4 z-[100] flex items-center gap-2 rounded-full border border-black/10 bg-white/95 p-1.5 pl-3 shadow-lg backdrop-blur">
          <span className="hidden text-xs font-medium text-black/55 sm:inline">{user.email}</span>
          <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-full bg-[#171713] px-3 py-2 text-xs font-semibold text-white hover:bg-black">
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </div>
        <FlliAdminDashboard />
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#11110f] px-5 py-12 text-[#f2eee2]">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#74795a]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-[#958b6d]/15 blur-3xl" />

      <section className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#74795a] text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a9ad8d]">F.LLI FRANCHI</p>
            <h1 className="mt-1 font-serif text-3xl tracking-[-0.035em]">Área administrativa</h1>
          </div>
        </div>

        <p className="mb-7 text-sm leading-6 text-white/55">
          Entre com a conta Google autorizada para gerenciar solicitações e orçamentos. O acesso antigo por senha local foi removido.
        </p>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm leading-5 text-red-100">
            {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={authenticating} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e9e5d8] px-5 py-3.5 text-sm font-bold text-[#171713] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
          <LogIn className="h-4 w-4" />
          {authenticating ? 'Entrando...' : 'Entrar com Google'}
        </button>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.16em] text-white/30">
          <a href="/" className="transition hover:text-white/60">Voltar ao site</a>
          <span>Acesso restrito</span>
        </div>
      </section>
    </main>
  );
};

export default Admin;
