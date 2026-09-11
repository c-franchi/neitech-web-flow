
import React, { useEffect, useRef } from 'react';
import { Globe, Smartphone, Palette, Video, MousePointer, Megaphone } from 'lucide-react';
import { loadSectionFonts } from '../utils/loadGoogleFont';
import { useClipReveal } from '../hooks/useClipReveal';
import { useParallax } from '../hooks/useParallax';
import { useTilt } from '../hooks/useTilt';
import AnimatedSection from './AnimatedSection';
import { getSectionMotionSettings, type SectionMotionSettings, type SectionStyles } from '../types/sectionStyles';


/**
 * ServicesSection - Seção de serviços com cards interativos
 * Agora aceita prop 'data' para conteúdo dinâmico (preview/admin)
 */
type Service = {
  icon: any;
  title: string;
  description: string;
  features: string[];
};

type ServicesSectionProps = {
  data?: {
    titulo?: string;
    subtitulo?: string;
    servicos?: Array<{
      title: string;
      description: string;
      features: string[];
      icon?: string;
    }>;
    cta?: string;
    styles?: SectionStyles;
  };
};

const iconMap: Record<string, any> = {
  Globe,
  Smartphone,
  Palette,
  Video,
  MousePointer,
  Megaphone,
};

const defaultServices: Service[] = [
  { icon: Globe, title: 'Desenvolvimento Web', description: 'Desenvolvimento de sites modernos, responsivos e otimizados para SEO. Soluções sob medida para destacar sua marca e gerar resultados.', features: ['Responsivo', 'SEO Otimizado', 'Performance', 'Segurança'] },
  { icon: Smartphone, title: 'Aplicativos Mobile', description: 'Aplicativos nativos e híbridos para iOS e Android, com foco em usabilidade, performance e integração com seu negócio.', features: ['iOS & Android', 'UX/UI', 'Performance', 'Publicação'] },
  { icon: Palette, title: 'Design Digital', description: 'Design de marcas, criação de identidade visual, logos, cartões digitais interativos e materiais gráficos para fortalecer sua presença digital.', features: ['Logos', 'Cartões Digitais', 'Banners', 'Identidade Visual'] },
  { icon: MousePointer, title: 'Cartões Digitais', description: 'Cartões digitais interativos e clicáveis, ideais para networking moderno, sustentável e compartilhamento fácil.', features: ['Interativo', 'Clicável', 'Compartilhável', 'Analytics'] },
  { icon: Megaphone, title: 'Banners Publicitários', description: 'Banners digitais criativos e impactantes para campanhas online, redes sociais e anúncios, aumentando o alcance da sua marca.', features: ['Animados', 'Responsivos', 'Otimizados', 'Criativos'] },
  { icon: Video, title: 'Vídeos Corporativos', description: 'Produção de conteúdo audiovisual para apresentações, marketing e comunicação interna.', features: ['Roteiro', 'Edição', 'Motion Graphics', 'Trilha Sonora'] },
];

type ServiceCardProps = {
  service: Service;
  index: number;
  motion: SectionMotionSettings;
  styles?: SectionStyles;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, motion, styles }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useTilt(cardRef, {
    maxTilt: 10,
    scale: 1.018,
    disabled: !motion.hoverEnabled,
  });

  return (
    <div
      ref={cardRef}
      data-service-card
      className={`service-card-premium group relative overflow-hidden rounded-[28px] border border-slate-100 ${motion.hoverEnabled ? 'hover:shadow-[0_30px_70px_-34px_rgba(37,99,235,0.42)]' : ''}`}
      style={{
        animationDelay: `${index * 100}ms`,
        ...(styles?.cardBackground ? { backgroundColor: styles.cardBackground } : {}),
        ...(styles?.borderColor ? { borderColor: styles.borderColor } : {}),
      }}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-90" />
      <div className="service-card-surface relative z-10 p-8 pb-6">
        <div className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 transition-transform duration-300 ${motion.hoverEnabled ? 'group-hover:scale-110 group-hover:rotate-3' : ''}`}>
          <div className="absolute inset-0 rounded-2xl bg-white/10 blur-[1px]" />
          <service.icon size={32} className="relative z-10 text-white" />
        </div>
        <h3 className="mb-4 text-xl font-bold text-slate-800" style={styles?.cardTextColor ? { color: styles.cardTextColor } : {}}>
          {service.title}
        </h3>
        <p className="mb-6 leading-relaxed text-slate-600" style={styles?.cardTextColor ? { color: styles.cardTextColor } : {}}>
          {service.description}
        </p>
      </div>
      <div className="service-card-surface relative z-10 px-8 pb-8">
        <div className="grid grid-cols-2 gap-2">
          {service.features.map((feature) => (
            <div key={feature} className="flex items-center space-x-2 text-sm text-slate-700">
              <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ data }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const headerLayerRef = useRef<HTMLDivElement>(null);
  const topGlowRef = useRef<HTMLDivElement>(null);
  const sideGlowRef = useRef<HTMLDivElement>(null);
  const titulo = data?.titulo || 'Nossos Serviços';
  const subtitulo = data?.subtitulo || 'Oferecemos soluções digitais completas para impulsionar seu negócio no mundo online';
  const cta = data?.cta || 'Solicitar Orçamento';
  const styles = data?.styles;
  const motion = getSectionMotionSettings(styles);
  let services: Service[] = defaultServices;
  if (data?.servicos && Array.isArray(data.servicos)) {
    services = data.servicos.map((s) => ({
      ...s,
      icon: s.icon && iconMap[s.icon] ? iconMap[s.icon] : Globe,
    }));
  }

  useEffect(() => {
    loadSectionFonts(styles);
  }, [styles?.fontFamily, styles?.headingFontFamily]);

  useClipReveal({
    targetRef: sectionRef,
    disabled: !motion.animationsEnabled,
    start: 'top 92%',
    y: 54,
    duration: 0.96,
  });

  useParallax({
    rootRef: sectionRef,
    backgroundRef: ambientRef,
    contentRef: headerLayerRef,
    foregroundRefs: [topGlowRef, sideGlowRef],
    disabled: !motion.parallaxEnabled,
  });

  return (
    <section ref={sectionRef} id="services" className="service-shell relative z-20 overflow-hidden rounded-t-[32px] border-t border-white/70 bg-white py-24 shadow-[0_-30px_70px_rgba(15,23,42,0.18)] md:rounded-t-[42px]" style={{
      ...(styles?.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}),
      ...(styles?.backgroundImage ? { backgroundImage: `url(${styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      ...(styles?.fontFamily ? { fontFamily: styles.fontFamily } : {}),
      ...(styles?.fontSize ? { fontSize: styles.fontSize } : {}),
    }}>
      <div ref={ambientRef} className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0))]" />
        <div className="absolute inset-x-[8%] top-4 h-24 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),rgba(59,130,246,0))] blur-3xl" />
      </div>
      <div ref={topGlowRef} className="pointer-events-none absolute inset-x-[18%] top-0 h-24 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2),rgba(56,189,248,0))] blur-3xl" />
      <div ref={sideGlowRef} className="pointer-events-none absolute -right-20 top-1/3 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90" />
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div ref={headerLayerRef} className="relative z-10 will-change-transform">
          <AnimatedSection className="text-center mb-16 space-y-4" targets="[data-services-header]" stagger={motion.stagger} y={motion.revealY} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800" style={{
                ...(styles?.headingColor ? { color: styles.headingColor } : {}),
                ...(styles?.headingFontFamily ? { fontFamily: styles.headingFontFamily } : {}),
                ...(styles?.headingFontWeight ? { fontWeight: styles.headingFontWeight } : {}),
              }}>
              <span data-services-header>
                {titulo.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-blue-600" style={styles?.accentColor ? { color: styles.accentColor } : {}}>{titulo.split(' ').slice(-1)}</span>
              </span>
            </h2>
            <p data-services-header className="text-xl text-slate-600 max-w-2xl mx-auto" style={styles?.textColor ? { color: styles.textColor } : {}}>
              {subtitulo}
            </p>
          </AnimatedSection>
        </div>

        {/* Grid de serviços */}
        <AnimatedSection className="services-grid-depth relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" targets="[data-service-card]" stagger={motion.stagger} y={motion.revealY} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              motion={motion}
              styles={styles}
            />
          ))}
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="text-center mt-16" y={Math.max(motion.revealY - 4, 16)} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
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

export default ServicesSection;
