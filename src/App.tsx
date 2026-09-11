import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LanguageGateway from './pages/LanguageGateway';
import FlliHome from './pages/FlliHome';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from './components/ui/toaster';

const LegacyIndex = lazy(() => import('./pages/Index'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminSite = lazy(() => import('./pages/AdminSite'));
const AdminEditorInline = lazy(() => import('./pages/AdminEditorInline'));
const OrcamentoPublico = lazy(() => import('./pages/OrcamentoPublico'));
const StatusSolicitacao = lazy(() => import('./pages/StatusSolicitacao'));
const FormularioDetalhado = lazy(() => import('./components/FormularioDetalhado'));
const ConfirmacaoOrcamento = lazy(() => import('./pages/ConfirmacaoOrcamento'));
const PoliticaPrivacidade = lazy(() => import('./pages/PoliticaPrivacidade'));
const SetupSections = lazy(() => import('./pages/SetupSections'));
const ImportContent = lazy(() => import('./pages/ImportContent'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#11110f] text-[#e9e5d8]">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<LanguageGateway />} />
            <Route path="/br" element={<FlliHome locale="br" />} />
            <Route path="/it" element={<FlliHome locale="it" />} />
            <Route path="/legacy" element={<LegacyIndex />} />

            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-site" element={<AdminSite />} />
            <Route path="/admin/editor" element={<AdminEditorInline />} />
            <Route path="/orcamento/:id" element={<OrcamentoPublico />} />
            <Route path="/status/:id" element={<StatusSolicitacao />} />
            <Route path="/formulario/:id" element={<FormularioDetalhado />} />
            <Route path="/confirmacao/:id" element={<ConfirmacaoOrcamento />} />
            <Route path="/privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/setup-sections" element={<SetupSections />} />
            <Route path="/import-content" element={<ImportContent />} />
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
