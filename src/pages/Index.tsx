
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import PortfolioSection from '../components/PortfolioSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

/**
 * Index - Página principal do site NeiTech
 * 
 * Estrutura:
 * - Header com navegação responsiva
 * - Hero com efeitos de mouse tracking
 * - Seção de serviços com cards interativos
 * - Portfolio com filtros e animações
 * - Formulário de contato com validação
 * - Footer completo com links e informações
 * 
 * Features implementadas:
 * - Design mobile-first totalmente responsivo
 * - Animações suaves e micro-interações
 * - Efeitos de parallax e mouse tracking
 * - Componentes modulares e reutilizáveis
 * - Código bem estruturado com TypeScript
 * - Comentários detalhados para manutenção
 */
const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navegação fixa */}
      <Header />
      
      {/* Seção principal com efeitos interativos */}
      <HeroSection />
      
      {/* Apresentação dos serviços */}
      <ServicesSection />
      
      {/* Showcase de trabalhos realizados */}
      <PortfolioSection />
      
      {/* Formulário de contato e informações */}
      <ContactSection />
      
      {/* Rodapé com links e branding */}
      <Footer />
    </div>
  );
};

export default Index;
