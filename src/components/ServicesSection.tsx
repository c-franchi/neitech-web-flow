
import React from 'react';
import { Globe, Smartphone, Palette, Video, MousePointer, Megaphone } from 'lucide-react';

/**
 * ServicesSection - Seção de serviços com cards interativos
 * Features: Hover effects, animações staggered, ícones representativos
 */
const ServicesSection = () => {
  const services = [
    {
      icon: Globe,
      title: 'Desenvolvimento Web',
      description: 'Sites modernos, responsivos e otimizados para SEO. Desenvolvemos desde landing pages até sistemas complexos.',
      features: ['Responsivo', 'SEO Otimizado', 'Performance', 'Segurança']
    },
    {
      icon: Smartphone,
      title: 'Aplicativos Mobile',
      description: 'Apps nativos e híbridos para iOS e Android com foco na experiência do usuário.',
      features: ['iOS & Android', 'UX/UI', 'Performance', 'Publicação']
    },
    {
      icon: Palette,
      title: 'Design Digital',
      description: 'Criação de identidade visual, logos, cartões digitais clicáveis e material gráfico.',
      features: ['Logos', 'Cartões Digitais', 'Banners', 'Identidade Visual']
    },
    {
      icon: MousePointer,
      title: 'Cartões Digitais',
      description: 'Cartões de visita interativos e clicáveis para networking moderno e sustentável.',
      features: ['Interativo', 'Clicável', 'Compartilhável', 'Analytics']
    },
    {
      icon: Megaphone,
      title: 'Banners Publicitários',
      description: 'Criação de banners digitais impactantes para campanhas online e redes sociais.',
      features: ['Animados', 'Responsivos', 'Otimizados', 'Criativos']
    },
    {
      icon: Video,
      title: 'Vídeos Corporativos',
      description: 'Produção de conteúdo audiovisual para apresentações, marketing e comunicação interna.',
      features: ['Roteiro', 'Edição', 'Motion Graphics', 'Trilha Sonora']
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
            Nossos <span className="text-blue-600">Serviços</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Oferecemos soluções digitais completas para impulsionar seu negócio no mundo online
          </p>
        </div>

        {/* Grid de serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Header do card */}
              <div className="p-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon size={32} className="text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Features list */}
              <div className="px-8 pb-8">
                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((feature, i) => (
                    <div
                      key={feature}
                      className="flex items-center space-x-2 text-sm text-slate-500"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Solicitar Orçamento
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
