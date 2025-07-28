
import React, { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';

/**
 * PortfolioSection - Showcase de trabalhos e projetos
 * Features: Filtros interativos, modal de preview, animações de hover
 */
const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState('todos');

  const portfolioItems = [
    {
      id: 1,
      title: 'E-commerce Moderno',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
      description: 'Plataforma de e-commerce com design moderno e funcionalidades avançadas',
      technologies: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'App de Delivery',
      category: 'mobile',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      description: 'Aplicativo mobile para delivery com interface intuitiva',
      technologies: ['React Native', 'Firebase', 'Maps API']
    },
    {
      id: 3,
      title: 'Identidade Visual',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      description: 'Criação completa de identidade visual para startup',
      technologies: ['Figma', 'Adobe CC', 'Branding']
    },
    {
      id: 4,
      title: 'Sistema de Gestão',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      description: 'Dashboard administrativo com analytics em tempo real',
      technologies: ['Vue.js', 'Python', 'PostgreSQL']
    },
    {
      id: 5,
      title: 'Cartão Digital',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80',
      description: 'Cartão de visita digital interativo e responsivo',
      technologies: ['HTML5', 'CSS3', 'JavaScript']
    },
    {
      id: 6,
      title: 'App Fitness',
      category: 'mobile',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
      description: 'Aplicativo para acompanhamento de exercícios e dieta',
      technologies: ['Flutter', 'Dart', 'HealthKit']
    }
  ];

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'web', label: 'Web' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'design', label: 'Design' }
  ];

  const filteredItems = activeFilter === 'todos' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
            Nosso <span className="text-blue-600">Portfolio</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Conheça alguns dos projetos que desenvolvemos com excelência e inovação
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid do Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Imagem */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <div className="flex space-x-2">
                    <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
                      <ExternalLink size={18} className="text-slate-700" />
                    </button>
                    <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
                      <Github size={18} className="text-slate-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Ver Todos os Projetos
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
