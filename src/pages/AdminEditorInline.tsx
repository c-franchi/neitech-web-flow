import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSiteSections, updateSiteSection } from '../admin/firestoreSiteSections';
import { saveSectionVersion } from '../admin/firestoreSiteSectionVersions';
import { SiteSection, initialSections } from '../admin/SiteSections';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import PortfolioSection from '../components/PortfolioSection';
import TestimonialSection from '../components/TestimonialSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import SectionEditorPanel from '../admin/SectionEditorPanel';
import { X, Edit3, ArrowLeft, Save } from 'lucide-react';
import { auth } from '../lib/firebase';
import type { SectionStyles } from '../types/sectionStyles';

// Mapeia nome da seção → componente de preview
const SECTION_ORDER = ['hero', 'servicos', 'portfolio', 'depoimentos', 'contato'];

const AdminEditorInline: React.FC = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Record<string, SiteSection>>({});
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const editorTopBarHeight = 52;

  useEffect(() => {
    // Require admin login via Google on /admin — if not authenticated, redirect to /admin
    if (!auth.currentUser) {
      navigate('/admin');
      return;
    }
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    const data = await fetchSiteSections();
    const byName: Record<string, SiteSection> = {};
    data.forEach((section) => {
      byName[section.name] = section;
    });
    // Garante que todas as seções existam — usa initialSections como fallback
    for (const template of initialSections) {
      if (!byName[template.name]) {
        byName[template.name] = { ...template };
      } else {
        // Mescla campos faltantes do template no conteúdo existente
        const existing = byName[template.name].content;
        const merged = { ...template.content };
        for (const key of Object.keys(merged)) {
          if (key in existing) merged[key] = existing[key];
        }
        byName[template.name] = { ...byName[template.name], content: merged };
      }
    }
    setSections(byName);
    setLoading(false);
  };

  const handleFieldChange = (sectionName: string, field: string, value: any) => {
    setSections((prev) => {
      const sec = prev[sectionName];
      if (!sec) return prev;
      return {
        ...prev,
        [sectionName]: { ...sec, content: { ...sec.content, [field]: value } },
      };
    });
  };

  const handleArrayItemChange = (sectionName: string, field: string, index: number, subField: string, value: any) => {
    setSections((prev) => {
      const sec = prev[sectionName];
      if (!sec) return prev;
      const arr = [...(sec.content[field] || [])];
      arr[index] = { ...arr[index], [subField]: value };
      return {
        ...prev,
        [sectionName]: { ...sec, content: { ...sec.content, [field]: arr } },
      };
    });
  };

  const handleAddArrayItem = (sectionName: string, field: string) => {
    setSections((prev) => {
      const sec = prev[sectionName];
      if (!sec) return prev;
      const arr = [...(sec.content[field] || [])];
      const template = arr.length > 0
        ? Object.fromEntries(Object.entries(arr[0]).map(([k, v]) => {
            if (typeof v === 'number') return [k, k === 'id' ? arr.length + 1 : 0];
            if (Array.isArray(v)) return [k, []];
            return [k, ''];
          }))
        : {};
      arr.push(template);
      return {
        ...prev,
        [sectionName]: { ...sec, content: { ...sec.content, [field]: arr } },
      };
    });
  };

  const handleRemoveArrayItem = (sectionName: string, field: string, index: number) => {
    setSections((prev) => {
      const sec = prev[sectionName];
      if (!sec) return prev;
      const arr = [...(sec.content[field] || [])];
      arr.splice(index, 1);
      return {
        ...prev,
        [sectionName]: { ...sec, content: { ...sec.content, [field]: arr } },
      };
    });
  };

  const handleSave = async (sectionName: string) => {
    const sec = sections[sectionName];
    if (!sec) return;
    setSaving(true);
    try {
      await updateSiteSection(sec.id, sec.content, 'admin');
      await saveSectionVersion(sec, 'admin');
      setSaving(false);
    } catch {
      setSaving(false);
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const editingData = editingSection ? sections[editingSection] : null;
  const heroStyles = sections.hero?.content?.styles as SectionStyles | undefined;
  const heroOverlapEnabled = heroStyles?.heroPinEnabled !== false && heroStyles?.heroOverlapEnabled !== false && heroStyles?.animationsEnabled !== false;

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar do editor */}
      <div className="fixed top-0 left-0 right-0 z-[90] bg-slate-900 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Voltar
            </button>
            <div className="h-5 w-px bg-gray-600" />
            <span className="font-semibold text-sm">Editor Visual — Clique numa seção para editar</span>
          </div>
          <div className="flex items-center gap-2">
            {editingSection && (
              <button
                onClick={() => handleSave(editingSection)}
                disabled={saving}
                className="flex items-center gap-1 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
              >
                <Save size={14} /> {saving ? 'Salvando...' : 'Salvar'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo do site — com overlays clicáveis */}
      <div
        className="transition-all duration-300"
        style={{
          marginTop: editorTopBarHeight,
          marginRight: editingSection ? 420 : 0,
        }}
      >
        {/* Menu / Header */}
        <SectionOverlay
          label="Menu Principal"
          isActive={editingSection === 'menu'}
          onClick={() => setEditingSection('menu')}
        >
          <Header data={sections.menu?.content} topOffset={editorTopBarHeight} zIndexClassName="z-40" />
        </SectionOverlay>

        <main style={{ paddingTop: 80 }}>
          {/* Hero */}
          <SectionOverlay
            label="Hero / Banner"
            isActive={editingSection === 'hero'}
            onClick={() => setEditingSection('hero')}
          >
            <HeroSection data={sections.hero?.content} />
          </SectionOverlay>

          {/* Serviços */}
          <SectionOverlay
            label="Serviços"
            isActive={editingSection === 'servicos'}
            onClick={() => setEditingSection('servicos')}
          >
            <div className={`relative ${heroOverlapEnabled ? '-mt-[70vh] md:-mt-[92vh] z-20' : 'z-10'}`}>
              <ServicesSection data={sections.servicos?.content} />
            </div>
          </SectionOverlay>

          {/* Portfólio */}
          <SectionOverlay
            label="Portfólio"
            isActive={editingSection === 'portfolio'}
            onClick={() => setEditingSection('portfolio')}
          >
            <PortfolioSection data={sections.portfolio?.content} />
          </SectionOverlay>

          {/* Depoimentos */}
          <SectionOverlay
            label="Depoimentos"
            isActive={editingSection === 'depoimentos'}
            onClick={() => setEditingSection('depoimentos')}
          >
            <TestimonialSection data={sections.depoimentos?.content} />
          </SectionOverlay>

          {/* Contato */}
          <SectionOverlay
            label="Contato"
            isActive={editingSection === 'contato'}
            onClick={() => setEditingSection('contato')}
          >
            <ContactSection data={sections.contato?.content} />
          </SectionOverlay>
        </main>

        {/* Rodapé */}
        <SectionOverlay
          label="Rodapé"
          isActive={editingSection === 'rodape'}
          onClick={() => setEditingSection('rodape')}
        >
          <Footer data={sections.rodape?.content} />
        </SectionOverlay>
      </div>

      {/* Painel lateral de edição */}
      {editingSection && editingData && (
        <div className="fixed top-[52px] right-0 bottom-0 w-[420px] bg-white shadow-2xl border-l border-gray-200 z-40 flex flex-col">
          {/* Header do painel */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-800">{editingData.label}</h3>
            <button
              onClick={() => setEditingSection(null)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Conteúdo do painel — scrollável */}
          <div className="flex-1 overflow-y-auto p-4">
            <SectionEditorPanel
              section={editingData}
              onFieldChange={(field, value) => handleFieldChange(editingSection, field, value)}
              onArrayItemChange={(field, index, subField, value) =>
                handleArrayItemChange(editingSection, field, index, subField, value)
              }
              onAddArrayItem={(field) => handleAddArrayItem(editingSection, field)}
              onRemoveArrayItem={(field, index) => handleRemoveArrayItem(editingSection, field, index)}
            />
          </div>

          {/* Footer do painel */}
          <div className="px-4 py-3 bg-gray-50 border-t">
            <button
              onClick={() => handleSave(editingSection)}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Overlay clicável sobre cada seção — div transparente captura todos os cliques
const SectionOverlay: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative group">
      {children}

      {/* Overlay transparente clicável — fica acima do conteúdo para capturar cliques */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ zIndex: 51 }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Borda de highlight ao hover/active */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-200"
        style={{
          zIndex: 52,
          outline: isActive
            ? '3px solid #2563eb'
            : hovered
            ? '2px dashed #60a5fa'
            : '2px dashed transparent',
          outlineOffset: '-2px',
        }}
      />

      {/* Badge de identificação */}
      {(hovered || isActive) && (
        <div
          className="absolute top-2 left-2 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg"
          style={{
            zIndex: 53,
            backgroundColor: isActive ? '#2563eb' : '#1e293b',
            color: 'white',
          }}
        >
          <Edit3 size={12} />
          {label}
        </div>
      )}
    </div>
  );
};

export default AdminEditorInline;
