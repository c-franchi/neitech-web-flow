import React, { useEffect } from 'react';
import { Star } from 'lucide-react';
import { loadSectionFonts } from '../utils/loadGoogleFont';
import AnimatedSection from './AnimatedSection';
import { getSectionMotionSettings, type SectionStyles } from '../types/sectionStyles';

type Testimonial = {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
};

type TestimonialSectionProps = {
  data?: {
    titulo?: string;
    subtitulo?: string;
    depoimentos?: Testimonial[];
    styles?: SectionStyles;
  };
};

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Ana Souza',
    role: 'Cl\u00ednica Vida',
    content: 'A NYV8 Digital superou nossas expectativas! O site ficou moderno, r\u00e1pido e j\u00e1 trouxe novos clientes para a cl\u00ednica.',
    rating: 5
  },
  {
    name: 'Carlos Lima',
    role: 'Lima Engenharia',
    content: 'Equipe atenciosa, entregaram nosso portf\u00f3lio digital no prazo e com excelente qualidade. Recomendo!',
    rating: 5
  },
  {
    name: 'Juliana Torres',
    role: 'Juliana MakeUp',
    content: 'O cart\u00e3o digital ficou incr\u00edvel e facilitou muito meu networking. Atendimento diferenciado!',
    rating: 5
  }
];

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ data }) => {
  const titulo = data?.titulo || 'O que dizem nossos clientes';
  const styles = data?.styles;
  const motion = getSectionMotionSettings(styles);
  const items = data?.depoimentos && Array.isArray(data.depoimentos) && data.depoimentos.length > 0
    ? data.depoimentos
    : defaultTestimonials;

  useEffect(() => {
    loadSectionFonts(styles);
  }, [styles?.fontFamily, styles?.headingFontFamily]);

  return (
    <section id="depoimentos" className="py-24 bg-slate-50" style={{
      ...(styles?.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}),
      ...(styles?.backgroundImage ? { backgroundImage: `url(${styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      ...(styles?.fontFamily ? { fontFamily: styles.fontFamily } : {}),
      ...(styles?.fontSize ? { fontSize: styles.fontSize } : {}),
    }}>
      <div className="container mx-auto px-4">
        <AnimatedSection className="mb-12 text-center" y={Math.max(motion.revealY - 8, 16)} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800" style={{
            ...(styles?.headingColor ? { color: styles.headingColor } : {}),
            ...(styles?.headingFontFamily ? { fontFamily: styles.headingFontFamily } : {}),
            ...(styles?.headingFontWeight ? { fontWeight: styles.headingFontWeight } : {}),
          }}>
            {titulo}
          </h2>
        </AnimatedSection>
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-8" targets="[data-testimonial-card]" stagger={motion.stagger} y={motion.revealY} duration={motion.revealDuration || 0.01} disabled={!motion.revealEnabled}>
          {items.map((t, i) => (
            <div key={i} data-testimonial-card className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-slate-100 transition-transform duration-300 ${motion.hoverEnabled ? 'hover:-translate-y-1 hover:shadow-xl' : ''}`} style={{
              ...(styles?.cardBackground ? { backgroundColor: styles.cardBackground } : {}),
              ...(styles?.borderColor ? { borderColor: styles.borderColor } : {}),
            }}>
              <div className="flex mb-4">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={20} className="text-amber-400 fill-amber-400 mr-1" style={styles?.accentColor ? { color: styles.accentColor, fill: styles.accentColor } : {}} />
                ))}
              </div>
              <p className="text-slate-600 mb-6" style={styles?.cardTextColor ? { color: styles.cardTextColor } : {}}>&ldquo;{t.content}&rdquo;</p>
              <div className="font-semibold text-blue-700" style={styles?.accentColor ? { color: styles.accentColor } : {}}>{t.name}</div>
              <div className="text-sm text-slate-400" style={styles?.textColor ? { color: styles.textColor } : {}}>{t.role}</div>
            </div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TestimonialSection;