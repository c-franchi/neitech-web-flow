/**
 * Index - Página principal do site NYV8 Digital
 * 
 * Estrutura:
 * - Header com navegação responsiva
 * - Hero com efeitos de mouse tracking
 * - Seção de serviços com cards interativos
 * - Portfolio com filtros e animações
 * - Formulário de contato com validação
 * - Footer completo com links e informações
 */
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import PortfolioSection from '../components/PortfolioSection';
import TestimonialSection from '../components/TestimonialSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { fetchSiteSections } from '../admin/firestoreSiteSections';
import { SiteSection } from '../admin/SiteSections';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { Edit3 } from 'lucide-react';
import type { SectionStyles } from '../types/sectionStyles';

const Index = () => {
  const [sections, setSections] = useState<Record<string, SiteSection>>({});
  const isAdmin = useIsAdmin();

  useEffect(() => {
    fetchSiteSections().then((data) => {
      const byName: Record<string, SiteSection> = {};
      data.forEach((section) => {
        byName[section.name] = section;
      });
      setSections(byName);
    });
  }, []);

  const heroStyles = sections.hero?.content?.styles as SectionStyles | undefined;
  const heroOverlapEnabled = heroStyles?.heroPinEnabled !== false && heroStyles?.heroOverlapEnabled !== false && heroStyles?.animationsEnabled !== false;

  return (
    <div className="min-h-screen">
      {/* Botão admin flutuante — só aparece para admin logado */}
      {isAdmin && (
        <a
          href="/admin/editor"
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg transition-colors"
        >
          <Edit3 size={16} /> Editar Site
        </a>
      )}

      {/* Navegação fixa */}
      <nav aria-label="Navegação principal">
        <Header data={sections.menu?.content} />
      </nav>

      {/* Conteúdo principal */}
      <main id="main-content" tabIndex={-1} aria-label="Conteúdo principal">
        {/* Seção principal com efeitos interativos */}
        <div className={heroOverlapEnabled ? 'mb-0' : 'mb-24'}>
        <HeroSection data={sections.hero?.content} />
        </div>
        <div className={`mb-24 relative ${heroOverlapEnabled ? '-mt-[70vh] md:-mt-[92vh] z-20' : 'z-10'}`}>
        {/* Apresentação dos serviços */}
        <ServicesSection data={sections.servicos?.content} />
        </div>
        <div className="mb-24">
        {/* Showcase de trabalhos realizados */}
        <PortfolioSection data={sections.portfolio?.content} />
        </div>
        <div className="mb-24">
        {/* Depoimentos de clientes */}
        <TestimonialSection data={sections.depoimentos?.content} />
        </div>
        <div className="mb-24">
        {/* Formulário de contato e informações */}
        <ContactSection data={sections.contato?.content} />
        </div>
      </main>

      {/* Rodapé com links e branding */}
      <footer aria-label="Rodapé">
        <Footer data={sections.rodape?.content} />
      </footer>
    </div>
  );
};

export default Index;
