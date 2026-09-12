import React, { useEffect, useState } from 'react';
import { ClipboardList, LogIn, LogOut, Pencil, ShieldCheck } from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import FlliAdminDashboard from '@/components/FlliAdminDashboard';
import FlliSiteEditor from '@/components/FlliSiteEditor';
import { auth, googleProvider } from '@/lib/firebase';

const ADMIN_EMAILS = ['neifranchi@gmail.com'];

type AdminView = 'requests' | 'site';

const isAllowedAdmin = (user: User | null) => {
  const email = user?.email?.toLowerCase();
  return Boolean(email && ADMIN_EMAILS.includes(email));
};

const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<AdminView>('requests');

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
      <div className="min-h-screen bg-[#f0ede3] text-[#171713]">
        <header className="sticky top-0 z-[90] border-b border-black/10 bg-[#f0ede3]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="flex items-center justify-between gap-4">
              <a href="/" className="flex items-center gap-3">
                <img src="/brand/flli-monogram.svg" alt="F.LLI FRANCHI" className="h-9 w-9" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#686d4e]">F.LLI FRANCHI</p>
                  <p className="font-serif text-lg leading-none">Administração</p>
                </div>
              </a>
              <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-full bg-[#171713] px-3 py-2 text-xs font-semibold text-white lg:hidden">
                <LogOut className="h-3.5 w-3.5" /> Sair
              </button>
            </div>

            <nav className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveView('requests')}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${activeView === 'requests' ? 'bg-[#171713] text-white' : 'border border-black/10 bg-white/70 text-black/60 hover:bg-white'}`}
              >
                <ClipboardList className="h-3.5 w-3.5" /> Solicitações
              </button>
              <button
                onClick={() => setActiveView('site')}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${activeView === 'site' ? 'bg-[#74795a] text-white' : 'border border-black/10 bg-white/70 text-black/60 hover:bg-white'}`}
              >
                <Pencil className="h-3.5 w-3.5" /> Editar site
              </button>
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <span className="text-xs text-black/45">{user.email}</span>
              <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-full bg-[#171713] px-3 py-2 text-xs font-semibold text-white hover:bg-black">
                <LogOut className="h-3.5 w-3.5" /> Sair
              </button>
            </div>
          </div>
        </header>

        {activeView === 'requests' ? (
          <FlliAdminDashboard />
        ) : (
          <div className="px-4 py-8 sm:px-6 lg:px-10">
            <FlliSiteEditor adminEmail={user.email || 'admin'} />
          </div>
        )}
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
          Entre com a conta Google autorizada para gerenciar solicitações, orçamentos e o conteúdo do site.
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
