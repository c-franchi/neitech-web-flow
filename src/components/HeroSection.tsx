
import React, { useEffect, useMemo, useRef } from 'react';
import { ArrowRight, Code, Smartphone, Palette } from 'lucide-react';
import { scrollToSection } from '../utils/smoothScroll';
import { loadSectionFonts } from '../utils/loadGoogleFont';
import { useParallax } from '../hooks/useParallax';
import { usePinnedSection } from '../hooks/usePinnedSection';
import AnimatedSection from './AnimatedSection';
import { getSectionMotionSettings, type SectionStyles } from '../types/sectionStyles';

/**
 * HeroSection - Seção principal com efeitos de mouse e animações
 * Agora aceita prop 'data' para conteúdo dinâmico (preview/admin)
 */
type ServiceItem = {
  icon: string; // ex: 'Code', 'Smartphone', 'Palette'
  text: string;
};

type HeroSectionProps = {
  data?: {
    titulo?: string;
    subtitulo?: string;
    descricao?: string;
    imagem?: string;
    cta?: string;
    ctaLink?: string;
    styles?: SectionStyles;
    titleStyle?: {
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string | number;
      color?: string;
      letterSpacing?: string;
      lineHeight?: string | number;
      textAlign?: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
    };
    servicos?: ServiceItem[];
  };
  editMode?: boolean;
  onFieldChange?: (field: string, value: string) => void;
  onServiceChange?: (index: number, field: string, value: string) => void;
};

const HeroSection: React.FC<HeroSectionProps> = ({ data, editMode = false, onFieldChange, onServiceChange }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentParallaxRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const orbOneRef = useRef<HTMLDivElement>(null);
  const orbTwoRef = useRef<HTMLDivElement>(null);
  const orbThreeRef = useRef<HTMLDivElement>(null);

  const parallaxLayers = useMemo(
    () => [visualRef, orbOneRef, orbTwoRef, orbThreeRef],
    [],
  );

  // Função para lidar com o clique no botão "Começar Projeto"
  const handleStartProject = () => {
    scrollToSection('contact');
  };

  // Função para lidar com o clique no botão "Ver Portfolio"
  const handleViewPortfolio = () => {
    scrollToSection('portfolio');
  };

  // Conteúdo dinâmico ou padrão
  const titulo = data?.titulo || 'NYV8 Digital';
  const subtitulo = data?.subtitulo || 'Soluções digitais sob medida para o seu negócio';
  const descricao = data?.descricao || 'Agência especializada em criar experiências digitais personalizadas, com foco em resultados, inovação e crescimento para empresas de todos os portes.';
  const imagem = data?.imagem || '/img/nyv8-hero.png';
  const cta = data?.cta || 'Começar Projeto';
  const ctaLinkRaw = data?.ctaLink || '#contact';
  // Normaliza links legados: /contato → #contact
  const ctaLink = ctaLinkRaw === '/contato' ? '#contact' : ctaLinkRaw;
  const servicos: ServiceItem[] = data?.servicos || [
    { icon: 'Code', text: 'Desenvolvimento Web' },
    { icon: 'Smartphone', text: 'Aplicativos Mobile' },
    { icon: 'Palette', text: 'Design Digital' },
  ];
  const styles = data?.styles;
  const motion = getSectionMotionSettings(styles);
  const heroPinEnabled = styles?.heroPinEnabled !== false && motion.animationsEnabled;
  const heroOverlapEnabled = styles?.heroOverlapEnabled !== false && heroPinEnabled;

  useParallax({
    rootRef: sectionRef,
    backgroundRef,
    contentRef: contentParallaxRef,
    foregroundRefs: parallaxLayers,
    disabled: !motion.parallaxEnabled || heroPinEnabled,
  });

  usePinnedSection({
    rootRef: sectionRef,
    pinRef: pinStageRef,
    backgroundRef,
    disabled: !heroPinEnabled,
  });

  // Carrega Google Fonts dinamicamente
  useEffect(() => {
    loadSectionFonts(styles);
  }, [styles?.fontFamily, styles?.headingFontFamily]);

  return (
    <section ref={sectionRef} id="home" className={`relative w-full bg-transparent ${heroPinEnabled ? 'min-h-[170vh] md:min-h-[190vh]' : ''}`}>
      <div ref={pinStageRef} className={`w-full relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 ${heroPinEnabled ? 'sticky top-0 h-screen' : 'min-h-screen'} ${heroOverlapEnabled ? 'z-10' : ''}`} style={{
        ...(styles?.fontFamily ? { fontFamily: styles.fontFamily } : {}),
        ...(styles?.fontSize ? { fontSize: styles.fontSize } : {}),
      }}>
        <div
          ref={backgroundRef}
          className="absolute inset-0 pointer-events-none will-change-transform"
          style={{
            ...(styles?.backgroundColor ? { background: styles.backgroundColor } : {}),
            ...(styles?.backgroundImage ? { backgroundImage: `url(${styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.14),transparent_34%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-slate-950/5" />
        </div>

        {/* Elementos flutuantes de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            ref={orbOneRef}
            className="absolute top-20 left-10 h-20 w-20 rounded-full bg-blue-200/30 blur-xl will-change-transform"
          ></div>
          <div 
            ref={orbTwoRef}
            className="absolute top-40 right-20 h-32 w-32 rounded-full bg-sky-200/20 blur-2xl will-change-transform"
          ></div>
          <div 
            ref={orbThreeRef}
            className="absolute bottom-20 left-1/4 h-24 w-24 rounded-full bg-cyan-200/25 blur-xl will-change-transform"
          ></div>
        </div>

        <div ref={contentParallaxRef} className="relative z-10 w-full px-4 pt-24 pb-12 will-change-transform">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
            {/* Conteúdo Principal */}
            <AnimatedSection
              className="lg:w-1/2"
              targets="[data-hero-item]"
              stagger={motion.stagger}
              y={Math.max(motion.revealY, 18)}
              duration={motion.revealDuration || 0.01}
              disabled={!motion.revealEnabled}
            >
              <div className="flex flex-col space-y-1">
                <h1
                  data-hero-item
                  style={{
                    ...(data?.titleStyle ? {
                      fontFamily: data.titleStyle.fontFamily,
                      fontSize: data.titleStyle.fontSize,
                      fontWeight: data.titleStyle.fontWeight,
                      color: data.titleStyle.color,
                      letterSpacing: data.titleStyle.letterSpacing,
                      lineHeight: data.titleStyle.lineHeight,
                      textAlign: data.titleStyle.textAlign,
                    } : {}),
                    ...(styles?.headingColor ? { color: styles.headingColor } : {}),
                    ...(styles?.headingFontFamily ? { fontFamily: styles.headingFontFamily } : {}),
                    ...(styles?.headingFontWeight ? { fontWeight: styles.headingFontWeight } : {}),
                  }}
                  className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight mb-4"
                >
                  {editMode ? (
                    <input
                      className="font-bold text-4xl md:text-6xl text-slate-800 bg-white/80 border-b-2 border-blue-200 focus:border-blue-600 outline-none w-full mb-2"
                      value={titulo}
                      onChange={e => onFieldChange && onFieldChange('titulo', e.target.value)}
                    />
                  ) : (
                    titulo
                  )}
                  <span className="block text-blue-600 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-4 mb-4 leading-relaxed" style={styles?.accentColor ? { color: styles.accentColor, backgroundImage: 'none', WebkitTextFillColor: styles.accentColor } : {}}>
                    {editMode ? (
                      <input
                        className="text-2xl md:text-4xl text-blue-600 bg-white/80 border-b-2 border-cyan-200 focus:border-cyan-600 outline-none w-full"
                        value={subtitulo}
                        onChange={e => onFieldChange && onFieldChange('subtitulo', e.target.value)}
                      />
                    ) : (
                      subtitulo
                    )}
                  </span>
                </h1>
                {/* Descrição dinâmica/editável */}
                {editMode ? (
                  <textarea
                    data-hero-item
                    className="text-xl text-slate-600 max-w-lg leading-relaxed border rounded p-2 mb-2 w-full"
                    value={descricao}
                    onChange={e => onFieldChange && onFieldChange('descricao', e.target.value)}
                  />
                ) : (
                  <p data-hero-item className="text-xl text-slate-600 max-w-lg leading-relaxed" style={styles?.textColor ? { color: styles.textColor } : {}}>{descricao}</p>
                )}
              </div>

              {/* Lista de serviços dinâmicos/editáveis */}
              <div data-hero-item className="flex flex-wrap gap-8 text-sm mt-6 mb-5">
                {servicos.map((serv, idx) => {
                  let IconComp = Code;
                  if (serv.icon === 'Smartphone') IconComp = Smartphone;
                  if (serv.icon === 'Palette') IconComp = Palette;
                  // Adicione mais ícones conforme necessário
                  return (
                    <div key={idx} className="flex items-center space-x-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-slate-600 backdrop-blur-md shadow-sm">
                      <IconComp size={20} className="text-blue-600" />
                      {editMode && onServiceChange ? (
                        <>
                          <input
                            className="border-b border-blue-200 focus:border-blue-600 outline-none bg-white/80 px-1"
                            value={serv.text}
                            onChange={e => onServiceChange(idx, 'text', e.target.value)}
                          />
                          <select
                            className="border rounded px-1 py-0.5"
                            value={serv.icon}
                            onChange={e => onServiceChange(idx, 'icon', e.target.value)}
                          >
                            <option value="Code">Code</option>
                            <option value="Smartphone">Smartphone</option>
                            <option value="Palette">Palette</option>
                          </select>
                        </>
                      ) : (
                        <span>{serv.text}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div data-hero-item className="flex flex-col sm:flex-row gap-4">
                {editMode ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      className="px-4 py-2 border rounded mb-2"
                      value={cta}
                      onChange={e => onFieldChange && onFieldChange('cta', e.target.value)}
                      placeholder="Texto do botão principal"
                    />
                    <input
                      className="px-4 py-2 border rounded mb-2"
                      value={ctaLink}
                      onChange={e => onFieldChange && onFieldChange('ctaLink', e.target.value)}
                      placeholder="Link do botão principal"
                    />
                  </div>
                ) : (
                  <a
                    href={ctaLink}
                    className="interactive-button group premium-surface bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                    style={{
                      ...(styles?.buttonColor ? { backgroundColor: styles.buttonColor } : {}),
                      ...(styles?.buttonTextColor ? { color: styles.buttonTextColor } : {}),
                    }}
                  >
                    <span>{cta}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                )}
                <button 
                  onClick={handleViewPortfolio}
                  className="interactive-button border-2 border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-md"
                >
                  Ver Portfolio
                </button>
              </div>
            </AnimatedSection>

            {/* Área Visual */}
            <AnimatedSection className="lg:w-1/2 mt-24 lg:mt-0 relative" y={Math.max(motion.revealY + 10, 22)} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
              <div className="relative">
                <div ref={visualRef} className="group premium-surface rounded-[30px] p-8 rotate-[2deg] transition-all duration-500 hover:rotate-0 hover:shadow-[0_30px_80px_rgba(15,23,42,0.16)] will-change-transform">
                  <div className="relative overflow-hidden rounded-xl">
                    {editMode ? (
                      <div className="flex flex-col gap-2 mb-2">
                        <input
                          className="px-4 py-2 border rounded"
                          value={imagem}
                          onChange={e => onFieldChange && onFieldChange('imagem', e.target.value)}
                          placeholder="URL da imagem do banner"
                        />
                        <img
                          src={imagem}
                          alt="Logo da NYV8 Digital sobre fundo azul claro, representando inovação digital"
                          loading="lazy" decoding="async"
                          className="w-full max-w-sm mx-auto transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        />
                      </div>
                    ) : (
                      <img
                        src={imagem}
                        alt="Logo da NYV8 Digital sobre fundo azul claro, representando inovação digital"
                        loading="lazy" decoding="async"
                        className="w-full max-w-sm mx-auto transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              </div>
            </AnimatedSection>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
