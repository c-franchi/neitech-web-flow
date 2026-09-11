
import React, { useEffect, useState } from 'react';
import { fetchSiteSectionsStaging } from '../admin/firestoreSiteSectionsStaging';
import { SiteSection } from '../admin/SiteSections';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import PortfolioSection from '../components/PortfolioSection';
import TestimonialSection from '../components/TestimonialSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import type { SectionStyles } from '../types/sectionStyles';

// Componentes reais aceitam props? Se sim, crie versões que aceitam dados dinâmicos. Caso contrário, adapte aqui.

const AdminPreview = () => {
  const [sections, setSections] = useState<Record<string, SiteSection>>( {} );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSectionsStaging().then((data) => {
      // Monta objeto { [name]: section }
      const byName: Record<string, SiteSection> = {};
      data.forEach((section) => {
        byName[section.name] = section;
      });
      setSections(byName);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Carregando preview...</div>;

  const heroStyles = sections.hero?.content?.styles as SectionStyles | undefined;
  const heroOverlapEnabled = heroStyles?.heroPinEnabled !== false && heroStyles?.heroOverlapEnabled !== false && heroStyles?.animationsEnabled !== false;

  // Renderização do layout real, passando dados de staging para cada seção
  return (
    <div className="min-h-screen bg-white">
      {/* Banner de aviso */}
      <div className="w-full bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-medium shadow z-50">
        Preview Visual do Site (Staging) — Você está vendo alterações ainda não publicadas
      </div>
      {/* Header fixo */}
      <Header data={sections.menu?.content} />
      <main id="main-content" tabIndex={-1} aria-label="Conteúdo principal">
        {/* HeroSection com dados de staging */}
        <HeroSection data={sections.hero?.content} />
        <div className={`relative ${heroOverlapEnabled ? '-mt-[70vh] md:-mt-[92vh] z-20' : 'z-10'}`}>
          {/* ServicesSection com dados de staging */}
          <ServicesSection data={sections.servicos?.content} />
        </div>
        {/* PortfolioSection com dados de staging */}
        <PortfolioSection data={sections.portfolio?.content} />
        {/* TestimonialSection com dados de staging */}
        <TestimonialSection data={sections.depoimentos?.content} />
        {/* ContactSection com dados de staging */}
        <ContactSection data={sections.contato?.content} />
      </main>
      <Footer data={sections.rodape?.content} />
      <div className="mt-8 text-center text-gray-400 text-xs pb-4">Este preview usa dados de staging. O site público só muda após publicação.</div>
    </div>
  );
};

export default AdminPreview;
