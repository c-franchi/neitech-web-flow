import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LanguageGateway from './pages/LanguageGateway';
import FlliHome from './pages/FlliHome';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from './components/ui/toaster';

const Admin = lazy(() => import('./pages/Admin'));
const OrcamentoPublico = lazy(() => import('./pages/OrcamentoPublico'));
const StatusSolicitacao = lazy(() => import('./pages/StatusSolicitacao'));
const FormularioDetalhado = lazy(() => import('./components/FormularioDetalhado'));
const ConfirmacaoOrcamento = lazy(() => import('./pages/ConfirmacaoOrcamento'));
const PoliticaPrivacidade = lazy(() => import('./pages/PoliticaPrivacidade'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full">
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#11110f] text-[#e9e5d8]">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<LanguageGateway />} />
            <Route path="/br" element={<FlliHome locale="br" />} />
            <Route path="/it" element={<FlliHome locale="it" />} />

            <Route path="/admin" element={<Admin />} />
            <Route path="/orcamento/:id" element={<OrcamentoPublico />} />
            <Route path="/status/:id" element={<StatusSolicitacao />} />
            <Route path="/formulario/:id" element={<FormularioDetalhado />} />
            <Route path="/confirmacao/:id" element={<ConfirmacaoOrcamento />} />
            <Route path="/privacidade" element={<PoliticaPrivacidade />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ScrollToTop />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
