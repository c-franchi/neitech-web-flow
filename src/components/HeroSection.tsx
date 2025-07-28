
import React, { useRef, useEffect } from 'react';
import { ArrowRight, Code, Smartphone, Palette } from 'lucide-react';
import { scrollToSection } from '../utils/smoothScroll';

/**
 * HeroSection - Seção principal com efeitos de mouse e animações
 * Features: Parallax mouse tracking, animações de entrada, CTA interativo
 */
const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement[]>([]);

  // Efeito de movimento seguindo o mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calcula offset baseado na posição do mouse
      const offsetX = (clientX - centerX) / centerX;
      const offsetY = (clientY - centerY) / centerY;

      // Aplica movimento aos elementos flutuantes
      floatingElementsRef.current.forEach((element, index) => {
        if (element) {
          const multiplier = (index + 1) * 10;
          element.style.transform = `translate(${offsetX * multiplier}px, ${offsetY * multiplier}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Função para lidar com o clique no botão "Começar Projeto"
  const handleStartProject = () => {
    scrollToSection('contact');
  };

  // Função para lidar com o clique no botão "Ver Portfolio"
  const handleViewPortfolio = () => {
    scrollToSection('portfolio');
  };

  return (
    <section id="home" className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Elementos flutuantes de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Círculos animados */}
        <div 
          ref={(el) => el && (floatingElementsRef.current[0] = el)}
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl transition-transform duration-700 ease-out"
        ></div>
        <div 
          ref={(el) => el && (floatingElementsRef.current[1] = el)}
          className="absolute top-40 right-20 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl transition-transform duration-1000 ease-out"
        ></div>
        <div 
          ref={(el) => el && (floatingElementsRef.current[2] = el)}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-200/25 rounded-full blur-xl transition-transform duration-500 ease-out"
        ></div>
      </div>

      <div ref={containerRef} className="w-full px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
            {/* Conteúdo Principal */}
            <div className="lg:w-1/2 space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
                  Soluções Web
                  <span className="block text-blue-600 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Inovadoras
                  </span>
                </h1>
                <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                  Criamos sites modernos, aplicativos mobile, artes digitais e conteúdo corporativo 
                  que impulsionam seu negócio para o futuro digital.
                </p>
              </div>

              {/* Lista de serviços rápidos */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Code size={20} className="text-blue-600" />
                  <span>Desenvolvimento Web</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Smartphone size={20} className="text-blue-600" />
                  <span>Apps Mobile</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Palette size={20} className="text-blue-600" />
                  <span>Design Digital</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleStartProject}
                  className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Começar Projeto</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button 
                  onClick={handleViewPortfolio}
                  className="border-2 border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-md"
                >
                  Ver Portfolio
                </button>
              </div>
            </div>

            {/* Área Visual */}
            <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
              <div className="relative">
                {/* Card flutuante com logo */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="/lovable-uploads/c843c9c6-4e20-47e7-8c42-c19f2f6694bf.png" 
                    alt="NeiTech Logo" 
                    className="w-full max-w-sm mx-auto"
                  />
                </div>
                
                {/* Elementos decorativos */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
