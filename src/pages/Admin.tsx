
import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AdminDashboard from '@/components/AdminDashboard';
import { auth } from '@/lib/firebase';
import { signInAnonymously, signOut } from 'firebase/auth';

/**
 * Admin - Página de administração com autenticação simples
 * Features: Login básico, acesso ao dashboard administrativo
 */

const AUTH_KEY = 'nyv8_admin_auth';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Senha temporária simples - em produção, usar autenticação mais robusta
  const ADMIN_PASSWORD = 'nyv8digital2024';


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password === ADMIN_PASSWORD) {
      // Autentica no Firebase para permitir uploads ao Storage
      try {
        await signInAnonymously(auth);
      } catch (firebaseErr) {
        console.warn('Firebase anonymous auth falhou:', firebaseErr);
      }
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      // Redireciona para home após login
      window.location.href = '/';
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    signOut(auth).catch(() => {});
  };

  // Garante sessão Firebase Auth ao carregar se já autenticado
  useEffect(() => {
    if (isAuthenticated && !auth.currentUser) {
      signInAnonymously(auth).catch(() => {});
    }
  }, [isAuthenticated]);


  if (isAuthenticated) {
    return <>
      <AdminDashboard />
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow font-semibold"
        >
          Sair
        </button>
      </div>
    </>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Acesse o sistema de gerenciamento de orçamentos
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-blue-400 disabled:to-cyan-400 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <Lock size={20} />
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Sistema de gerenciamento NYV8 Digital • Versão 1.0
        </div>
      </div>
    </div>
  );
};

export default Admin;
