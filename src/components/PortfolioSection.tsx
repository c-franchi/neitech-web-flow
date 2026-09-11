
import React, { useEffect, useMemo, useState } from 'react';
import { loadSectionFonts } from '../utils/loadGoogleFont';
import AnimatedSection from './AnimatedSection';
import PortfolioCard, { PortfolioCardItem } from './PortfolioCard';
import PortfolioCarousel from './PortfolioCarousel';
import { getSectionMotionSettings, type SectionStyles } from '../types/sectionStyles';

/**
 * PortfolioSection - Showcase de trabalhos e projetos
 * Agora aceita prop 'data' para conteúdo dinâmico (preview/admin)
 */
type PortfolioItem = PortfolioCardItem;

type PortfolioSectionProps = {
  data?: {
    titulo?: string;
    subtitulo?: string;
    projetos?: PortfolioItem[];
    cta?: string;
    styles?: SectionStyles;
  };
};

const defaultPortfolioItems: PortfolioItem[] = [
  { id: 1, title: 'E-commerce Moderno', category: 'web', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80', description: 'Plataforma de e-commerce com design moderno, checkout seguro e painel administrativo personalizado.', technologies: ['React', 'TypeScript', 'Node.js', 'Stripe'] },
  { id: 2, title: 'App de Delivery', category: 'mobile', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', description: 'Aplicativo mobile para delivery com interface intuitiva, rastreamento em tempo real e integração com pagamentos.', technologies: ['React Native', 'Firebase', 'Maps API', 'Payments'] },
  { id: 3, title: 'Identidade Visual', category: 'design', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', description: 'Criação completa de identidade visual, manual de marca e aplicações digitais para startup.', technologies: ['Figma', 'Illustrator', 'Photoshop', 'Branding'] },
  { id: 4, title: 'Sistema de Gestão', category: 'web', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', description: 'Dashboard administrativo com analytics em tempo real, controle de permissões e relatórios customizados.', technologies: ['React', 'TypeScript', 'Chart.js', 'PostgreSQL'] },
  { id: 5, title: 'Cartão Digital', category: 'design', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80', description: 'Cartão de visita digital interativo, responsivo e com compartilhamento via QR Code.', technologies: ['Figma', 'Photoshop', 'Illustrator', 'QR Code'] },
  { id: 6, title: 'App Fitness', category: 'mobile', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', description: 'Aplicativo para acompanhamento de exercícios, dieta e integração com dispositivos de saúde.', technologies: ['React Native', 'TypeScript', 'Health API', 'Firebase'] },
];

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const titulo = data?.titulo || 'Nosso Portfolio';
  const subtitulo = data?.subtitulo || 'Conheça alguns dos projetos que desenvolvemos com excelência e inovação';
  const cta = data?.cta || 'Ver Todos os Projetos';
  const styles = data?.styles;
  const motion = getSectionMotionSettings(styles);
  const portfolioLayout = styles?.portfolioLayout || 'carousel';
  const portfolioItems: PortfolioItem[] = data?.projetos && Array.isArray(data.projetos) && data.projetos.length > 0 ? data.projetos : defaultPortfolioItems;

  useEffect(() => {
    loadSectionFonts(styles);
  }, [styles?.fontFamily, styles?.headingFontFamily]);

  // Gera filtros dinamicamente a partir dos dados
  const categories = useMemo(() => Array.from(new Set(portfolioItems.map(item => item.category))), [portfolioItems]);
  const filters = useMemo(
    () => [{ id: 'todos', label: 'Todos' }, ...categories.map(cat => ({ id: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))],
    [categories],
  );

  const filteredItems = useMemo(
    () => activeFilter === 'todos'
      ? portfolioItems
      : portfolioItems.filter(item => item.category === activeFilter),
    [activeFilter, portfolioItems],
  );

  return (
    <section id="portfolio" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50" style={{
      ...(styles?.backgroundColor ? { background: styles.backgroundColor } : {}),
      ...(styles?.backgroundImage ? { backgroundImage: `url(${styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      ...(styles?.fontFamily ? { fontFamily: styles.fontFamily } : {}),
      ...(styles?.fontSize ? { fontSize: styles.fontSize } : {}),
    }}>
      <div className={portfolioLayout === 'carousel' ? 'w-full' : 'container mx-auto px-4'}>
        {/* Header */}
        <AnimatedSection className={`text-center mb-16 space-y-4 px-4 ${portfolioLayout === 'carousel' ? 'mx-auto max-w-7xl' : ''}`} targets="[data-portfolio-header]" stagger={motion.stagger} y={motion.revealY} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800" style={{
              ...(styles?.headingColor ? { color: styles.headingColor } : {}),
              ...(styles?.headingFontFamily ? { fontFamily: styles.headingFontFamily } : {}),
              ...(styles?.headingFontWeight ? { fontWeight: styles.headingFontWeight } : {}),
            }}>
            <span data-portfolio-header>
              {titulo.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-blue-600" style={styles?.accentColor ? { color: styles.accentColor } : {}}>{titulo.split(' ').slice(-1)}</span>
            </span>
          </h2>
          <p data-portfolio-header className="text-xl text-slate-600 max-w-2xl mx-auto" style={styles?.textColor ? { color: styles.textColor } : {}}>
            {subtitulo}
          </p>
        </AnimatedSection>

        {/* Filtros */}
        <AnimatedSection className={`flex flex-wrap justify-center gap-4 mb-12 px-4 ${portfolioLayout === 'carousel' ? 'mx-auto max-w-7xl' : ''}`} role="tablist" aria-label="Filtrar projetos do portfólio" targets="button" stagger={Math.min(motion.stagger, 0.04)} y={Math.max(motion.revealY - 8, 14)} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`interactive-button px-6 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'
              }`}
              role="tab"
              aria-selected={activeFilter === filter.id}
              tabIndex={activeFilter === filter.id ? 0 : -1}
            >
              {filter.label}
            </button>
          ))}
        </AnimatedSection>

        {portfolioLayout === 'carousel' ? (
          <AnimatedSection className="relative w-full" y={motion.revealY + 4} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
            <div className="relative left-1/2 w-screen -translate-x-1/2">
              <PortfolioCarousel items={filteredItems} styles={styles} />
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" targets="[data-portfolio-item]" stagger={motion.stagger} y={motion.revealY + 2} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
            {filteredItems.map((item) => (
              <div key={item.id} data-portfolio-item>
                <PortfolioCard item={item} styles={styles} />
              </div>
            ))}
          </AnimatedSection>
        )}

        {/* CTA */}
        <AnimatedSection className={`text-center mt-16 px-4 ${portfolioLayout === 'carousel' ? 'mx-auto max-w-7xl' : ''}`} y={Math.max(motion.revealY - 6, 16)} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
          <button className="interactive-button bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg" style={{
              ...(styles?.buttonColor ? { backgroundColor: styles.buttonColor } : {}),
              ...(styles?.buttonTextColor ? { color: styles.buttonTextColor } : {}),
            }}>
            {cta}
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PortfolioSection;
