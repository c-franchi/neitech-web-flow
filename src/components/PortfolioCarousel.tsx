import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import type { SectionStyles } from '../types/sectionStyles';

export type PortfolioCarouselItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  link?: string;
  technologies?: string[];
};

interface PortfolioCarouselProps {
  items: PortfolioCarouselItem[];
  styles?: SectionStyles;
}

function inferRecommendedStack(item: PortfolioCarouselItem) {
  if (item.technologies && item.technologies.length > 0) {
    return item.technologies.slice(0, 4);
  }

  const content = `${item.title} ${item.description}`.toLowerCase();

  if (content.includes('e-commerce') || content.includes('checkout') || content.includes('loja')) {
    return ['React', 'TypeScript', 'Node.js', 'Stripe'];
  }

  if (content.includes('blog')) {
    return ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'];
  }

  if (content.includes('delivery')) {
    return ['React Native', 'Firebase', 'Maps API', 'Payments'];
  }

  if (content.includes('dashboard') || content.includes('gestão') || content.includes('analytics')) {
    return ['React', 'TypeScript', 'Chart.js', 'PostgreSQL'];
  }

  if (content.includes('cartão') || content.includes('identidade') || content.includes('branding')) {
    return ['Figma', 'Illustrator', 'Photoshop', 'Branding'];
  }

  if (item.category === 'mobile') {
    return ['React Native', 'TypeScript', 'Firebase', 'API REST'];
  }

  if (item.category === 'design') {
    return ['Figma', 'Illustrator', 'Photoshop', 'Branding'];
  }

  return ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];
}

function getCircularOffset(index: number, activeIndex: number, total: number) {
  if (total <= 1) {
    return 0;
  }

  let diff = index - activeIndex;

  if (diff > total / 2) {
    diff -= total;
  }

  if (diff < -total / 2) {
    diff += total;
  }

  return diff;
}

const PortfolioCarousel: React.FC<PortfolioCarouselProps> = ({ items, styles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const backgroundRefs = useRef<Array<HTMLDivElement | null>>([]);
  const transitionLockRef = useRef(false);
  const transitionTimeoutRef = useRef<number | undefined>(undefined);
  const isMobile = useIsMobile();
  const itemSignature = useMemo(() => items.map((item) => item.id).join('|'), [items]);
  const configuredTransitionDuration = 0.8;
  const transitionDuration = isMobile ? Math.min(configuredTransitionDuration, 0.48) : configuredTransitionDuration;
  const transitionDurationMs = Math.max(250, transitionDuration * 1000);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setCurrentIndex((previous) => (previous >= items.length ? 0 : previous));
  }, [itemSignature, items.length]);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || items.length === 0) {
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      if (cancelled) {
        return;
      }

      const ctx = gsap.context(() => {
        backgroundRefs.current.forEach((node, index) => {
          if (!node) {
            return;
          }

          const active = index === currentIndex;
          gsap.to(node, {
            opacity: active ? 1 : 0,
            scale: active ? 1.02 : 1,
            filter: active ? 'blur(0px)' : 'blur(14px)',
            duration: transitionDuration,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });

        cardRefs.current.forEach((node, index) => {
          if (!node) {
            return;
          }

          const offset = getCircularOffset(index, currentIndex, items.length);
          const active = offset === 0;
          const adjacent = Math.abs(offset) === 1;

          gsap.to(node, {
            xPercent: isMobile ? offset * 82 : offset * 58,
            scale: active ? 0.93 : adjacent ? 0.84 : 0.72,
            opacity: active ? 1 : adjacent ? 0.52 : 0.14,
            rotateY: isMobile ? 0 : active ? 0 : offset > 0 ? -26 : 26,
            filter: active ? 'blur(0px)' : adjacent ? 'blur(0.8px)' : 'blur(2.6px)',
            zIndex: active ? 30 : adjacent ? 20 : 10,
            duration: transitionDuration,
            ease: 'power3.out',
            transformPerspective: 1800,
            transformOrigin: offset > 0 ? 'left center' : 'right center',
            overwrite: 'auto',
          });
        });
      }, root);

      cleanup = () => {
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [currentIndex, isMobile, items, transitionDuration]);

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[currentIndex];
  const activeTechnologies = inferRecommendedStack(activeItem);

  const advanceTo = (nextIndex: number) => {
    if (items.length <= 1 || transitionLockRef.current || nextIndex === currentIndex) {
      return;
    }

    transitionLockRef.current = true;
    setCurrentIndex(nextIndex);

    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      transitionLockRef.current = false;
    }, transitionDurationMs + 120);
  };

  const goNext = () => {
    advanceTo((currentIndex + 1) % items.length);
  };

  const goPrevious = () => {
    advanceTo((currentIndex - 1 + items.length) % items.length);
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden bg-slate-950 shadow-[0_30px_90px_rgba(15,23,42,0.24)]"
    >
      <div className="absolute inset-0">
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(node) => {
              backgroundRefs.current[index] = node;
            }}
            className="absolute inset-0 scale-100 opacity-0"
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-slate-950/58" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_34%),linear-gradient(135deg,rgba(37,99,235,0.2),transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.2),rgba(15,23,42,0.9))]" />
      </div>

      <div className="relative z-10 px-3 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="min-w-0">
            <div className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
              {activeItem.category}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/72 backdrop-blur-md">
              {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={goPrevious}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:bg-white/16"
              aria-label="Projeto anterior"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:bg-white/16"
              aria-label="Próximo projeto"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="relative h-[460px] md:h-[640px]" style={{ perspective: '1800px' }}>
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="absolute inset-x-0 top-1/2 mx-auto w-[84vw] max-w-[1240px] -translate-y-1/2 overflow-hidden rounded-[24px] border border-white/18 bg-white/12 shadow-[0_25px_80px_rgba(15,23,42,0.32)] backdrop-blur-xl md:w-[78vw] md:rounded-[30px]"
              style={{
                pointerEvents: index === currentIndex ? 'auto' : 'none',
                transformStyle: 'preserve-3d',
                ...(styles?.cardBackground ? { backgroundColor: styles.cardBackground } : {}),
                ...(styles?.borderColor ? { borderColor: styles.borderColor } : {}),
              }}
            >
              <div className="grid min-h-full md:grid-cols-[1.2fr_0.8fr]">
                <div className="relative min-h-[220px] md:min-h-[560px]">
                  <img
                    src={item.image}
                    alt={`Projeto de portfólio: ${item.title}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/45 via-transparent to-white/15" />
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute left-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white shadow-[0_10px_30px_rgba(15,23,42,0.24)] backdrop-blur-md transition-all duration-300 hover:bg-white/20"
                      aria-label={`Abrir projeto ${item.title}`}
                      style={{
                        ...(styles?.buttonColor ? { backgroundColor: styles.buttonColor } : {}),
                        ...(styles?.buttonTextColor ? { color: styles.buttonTextColor } : {}),
                      }}
                    >
                      <ExternalLink size={18} strokeWidth={2.5} />
                    </a>
                  )}
                </div>

                <div className="relative flex flex-col justify-between gap-5 bg-[linear-gradient(180deg,rgba(15,23,42,0.58),rgba(15,23,42,0.72))] p-6 text-white md:p-8">
                  <div>
                    <div className="mb-3 inline-flex rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/70 backdrop-blur-md">
                      Case ativo
                    </div>
                    <h3
                      className="text-2xl font-bold leading-tight text-white [text-shadow:0_10px_35px_rgba(15,23,42,0.45)] md:text-[2rem]"
                      style={{
                        ...(styles?.cardTextColor ? { color: styles.cardTextColor } : {}),
                        ...(styles?.headingFontFamily ? { fontFamily: styles.headingFontFamily } : {}),
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-4 text-sm leading-7 text-white/86 [text-shadow:0_8px_24px_rgba(15,23,42,0.38)] md:text-[15px]"
                      style={styles?.cardTextColor ? { color: styles.cardTextColor } : {}}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                      Pode ser criado com
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {activeTechnologies.map((technology) => (
                        <div key={technology} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                          <div className="text-sm font-semibold text-white/90">{technology}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2 pb-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => advanceTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-10 bg-white' : 'w-2.5 bg-white/35 hover:bg-white/60'}`}
              aria-label={`Ir para projeto ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCarousel;