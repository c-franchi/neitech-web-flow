import React, { useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { useTilt } from '../hooks/useTilt';
import { getSectionMotionSettings, type SectionStyles } from '../types/sectionStyles';

export type PortfolioCardItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  link?: string;
  technologies?: string[];
};

interface PortfolioCardProps {
  item: PortfolioCardItem;
  styles?: SectionStyles;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, styles }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const motion = getSectionMotionSettings(styles);

  useTilt(cardRef, {
    maxTilt: 7,
    scale: 1.035,
    disabled: isMobile || !motion.hoverEnabled,
  });

  return (
    <article
      ref={cardRef}
      className={`group/portfolio relative h-full overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/88 shadow-[0_18px_42px_rgba(15,23,42,0.12)] transition-[box-shadow,transform] duration-300 ${motion.hoverEnabled ? 'motion-safe:hover:shadow-[0_26px_70px_rgba(15,23,42,0.2)] motion-safe:hover:-translate-y-1' : ''}`}
      style={{
        ...(styles?.cardBackground ? { backgroundColor: styles.cardBackground } : {}),
        ...(styles?.borderColor ? { borderColor: styles.borderColor } : {}),
      }}
    >
      {motion.hoverEnabled && <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--pointer-x,50%)_var(--pointer-y,50%),rgba(96,165,250,0.18),transparent_38%)] opacity-0 transition-opacity duration-300 group-hover/portfolio:opacity-100" />}

      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-slate-950/0 transition-colors duration-300 ${motion.hoverEnabled ? 'group-hover/portfolio:bg-slate-950/12' : ''}`} />
        {motion.hoverEnabled && <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 translate-x-[-140%] rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover/portfolio:translate-x-[340%] group-hover/portfolio:opacity-100" />}

        <img
          src={item.image}
          alt={`Projeto de portfólio: ${item.title}`}
          loading="lazy"
          decoding="async"
          className={`h-56 w-full object-cover transition-transform duration-500 ease-out md:h-60 ${motion.hoverEnabled ? 'group-hover/portfolio:scale-[1.05]' : 'hover:scale-[1.02]'}`}
        />

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir projeto ${item.title}`}
            className={`absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/14 text-white shadow-[0_10px_30px_rgba(15,23,42,0.24)] backdrop-blur-md transition-all duration-300 focus:translate-y-0 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90 ${motion.hoverEnabled ? 'opacity-0 group-hover/portfolio:translate-y-0 group-hover/portfolio:opacity-100 md:translate-y-1' : 'opacity-100'}`}
            onClick={(event) => event.stopPropagation()}
            style={{
              ...(styles?.buttonColor ? { backgroundColor: styles.buttonColor } : {}),
              ...(styles?.buttonTextColor ? { color: styles.buttonTextColor } : {}),
            }}
          >
            <ExternalLink size={18} strokeWidth={2.5} />
          </a>
        )}
      </div>

      <div className="relative space-y-4 p-6 md:p-7">
        <div className="inline-flex rounded-full border border-slate-200/80 bg-slate-50/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {item.category}
        </div>

        <h3
          className={`text-xl font-bold leading-tight text-slate-800 transition-colors duration-300 ${motion.hoverEnabled ? 'group-hover/portfolio:text-blue-600' : ''}`}
          style={styles?.cardTextColor ? { color: styles.cardTextColor } : {}}
        >
          {item.title}
        </h3>

        <p
          className="text-sm leading-7 text-slate-600 md:text-[15px]"
          style={styles?.cardTextColor ? { color: styles.cardTextColor } : {}}
        >
          {item.description}
        </p>
      </div>
    </article>
  );
};

export default PortfolioCard;