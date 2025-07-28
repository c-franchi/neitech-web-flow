
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

/**
 * App - Componente principal da aplicação
 * Features: Roteamento, configuração de toasts, estrutura geral
 */
function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
