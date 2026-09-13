import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Loader2, Menu, MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cloneFlliContent, defaultFlliContent, FlliContent, FlliLocale } from '../content/flliContent';
import { getFlliContent } from '../services/flliContentService';
import { OrcamentoService } from '../services/orcamentoService';
import { useToast } from '../hooks/use-toast';

type FlliHomeProps = {
  locale: FlliLocale;
};

const upsertMeta = (selector: string, attributes: Record<string, string>, content?: string) => {
  let tag = document.head.querySelector(selector) as HTMLElement | null;
  if (!tag) {
    tag = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => tag?.setAttribute(key, value));
  if (content !== undefined) tag.setAttribute('content', content);
};

const normalizeExternalUrl = (value?: string) => {
  const trimmed = value?.trim() || '';
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const FlliHome = ({ locale }: FlliHomeProps) => {
  const { toast } = useToast();
  const [t, setT] = useState<FlliContent>(() => cloneFlliContent(defaultFlliContent[locale]));
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', service: '', message: '' });

  const canonical = useMemo(() => `https://fllifranchi.com/${locale}`, [locale]);
  const logoUrl = t.media.logoUrl || '/brand/flli-monogram.svg';
  const defaultLogo = logoUrl === '/brand/flli-monogram.svg';
  const desktopHeroImage = t.media.heroImageUrl?.trim() || '';
  const mobileHeroImage = t.media.heroMobileImageUrl?.trim() || desktopHeroImage;
  const hasHeroMedia = Boolean(desktopHeroImage || mobileHeroImage);

  useEffect(() => {
    let active = true;
    const fallback = cloneFlliContent(defaultFlliContent[locale]);
    setT(fallback);

    getFlliContent(locale)
      .then((content) => {
        if (active) setT(content);
      })
      .catch((error) => {
        console.warn(`F.LLI content (${locale}) indisponível; usando conteúdo padrão.`, error);
        if (active) setT(fallback);
      });

    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = t.lang;
    document.title = t.title;
    upsertMeta('meta[name="description"]', { name: 'description' }, t.description);
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, t.title);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, t.description);
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonical);
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: canonical });

    const socialImage = t.media.socialImageUrl?.trim();
    if (socialImage) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image' }, socialImage);
      upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, socialImage);
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }
  }, [canonical, t.description, t.lang, t.media.socialImageUrl, t.title]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await OrcamentoService.criarSolicitacao({
        nomeCliente: form.name.trim(),
        emailCliente: form.email.trim(),
        whatsappCliente: form.whatsapp.trim(),
        servicoInteresse: form.service,
        mensagem: form.message.trim() || `Contato pelo site F.LLI FRANCHI (${locale.toUpperCase()})`,
      });
      setForm({ name: '', email: '', whatsapp: '', service: '', message: '' });
      toast({ title: t.form.successTitle, description: t.form.successDescription });
    } catch (error) {
      console.error('F.LLI FRANCHI contact error:', error);
      toast({ title: t.form.errorTitle, description: t.form.errorDescription, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`flli-site min-h-screen bg-[#f0ede3] text-[#171713] selection:bg-[#74795a] selection:text-white ${hasHeroMedia ? 'flli-site--hero-media' : ''}`}>
      <header className="flli-header sticky top-0 z-50 border-b border-black/10 bg-[#f0ede3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3" aria-label="F.LLI FRANCHI">
            <img src={logoUrl} alt="F.LLI FRANCHI" className="h-10 w-10 object-contain" />
            <div className="leading-none">
              <p className="text-xs font-bold tracking-[0.22em]">F.LLI FRANCHI</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#74795a]">Digital studio</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
            {t.nav.map((item, index) => (
              <a key={item} href={`#${t.navIds[index]}`} className="text-xs font-semibold uppercase tracking-[0.16em] text-black/65 transition hover:text-black">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to={t.localeHref} className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold tracking-[0.15em] transition hover:bg-black hover:text-white">
              {t.localeLabel}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-black/15 p-2.5 lg:hidden" aria-label="Menu">
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-black/10 bg-[#f0ede3] px-6 py-5 lg:hidden">
            {t.nav.map((item, index) => (
              <a key={item} href={`#${t.navIds[index]}`} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-black/10 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] md:text-sm">
                {item}<ChevronRight className="h-4 w-4" />
              </a>
            ))}
          </nav>
        )}
      </header>

      <section className={`flli-hero relative overflow-hidden border-b border-black/10 ${hasHeroMedia ? 'flli-hero--media' : ''}`}>
        {!hasHeroMedia && (
          <>
            <div className="pointer-events-none absolute right-[-12rem] top-10 h-[38rem] w-[38rem] rounded-full border border-[#74795a]/20" />
            <div className="pointer-events-none absolute right-[-7rem] top-28 h-[28rem] w-[28rem] rounded-full bg-[#74795a]/10 blur-3xl" />
          </>
        )}

        {hasHeroMedia && (
          <div className="flli-hero-bg" aria-hidden="true">
            <picture>
              {mobileHeroImage && <source media="(max-width: 767px)" srcSet={mobileHeroImage} />}
              <img src={desktopHeroImage || mobileHeroImage} alt="" />
            </picture>
          </div>
        )}

        <div className="flli-hero-body mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.25fr_.75fr] lg:px-10">
          <div className="flli-hero-copy relative z-10">
            <p className="flli-hero-eyebrow mb-6 text-[12px] font-bold uppercase tracking-[0.22em] text-[#686d4e] md:text-[11px] md:tracking-[0.3em]">{t.eyebrow}</p>
            <h1 className="max-w-5xl font-serif text-[2.6rem] leading-[1.02] tracking-[-0.055em] sm:text-6xl sm:leading-[0.9] lg:text-[4.8rem]">
              {t.heroA}<br /><span className="italic text-[#74795a]">{t.heroB}</span>
            </h1>
            <p className="flli-hero-description mt-8 max-w-2xl text-[15px] font-medium leading-7 text-black/65 md:text-lg md:leading-8">{t.heroText}</p>
            <div className="flli-hero-actions mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#contato" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#171713] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#74795a]">
                {t.ctaPrimary}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#projetos" className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3.5 text-sm font-semibold transition hover:border-black/40">
                {t.ctaSecondary}
              </a>
            </div>
          </div>

          {!hasHeroMedia && (
            <div className="flli-hero-visual relative hidden min-h-[460px] lg:block">
              <div className="absolute inset-10 rotate-6 rounded-[3rem] border border-black/10 bg-[#171713] shadow-2xl" />
              <div className="absolute inset-0 -rotate-3 rounded-[3rem] border border-black/10 bg-[#74795a] p-10 shadow-xl">
                <img src={logoUrl} alt="" className={`h-28 w-28 object-contain ${defaultLogo ? 'brightness-0 invert' : ''}`} />
                <div className="absolute bottom-10 left-10 right-10 border-t border-white/25 pt-6 text-white">
                  <p className="font-serif text-4xl">Digital systems<br />with character.</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">F.LLI FRANCHI · 2026</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flli-hero-proof mx-auto grid max-w-7xl grid-cols-4 border-x border-t border-black/10">
          {t.proof.map((item) => (
            <div key={item} className="flli-hero-proof-item border-r border-black/10 px-3 py-4 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-black/60 md:px-6 md:py-5 md:text-[10px] md:tracking-[0.19em]">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="servicos" className="scroll-mt-24 border-b border-black/10 bg-[#171713] text-[#f0ede3]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#b8bd96] md:text-[11px] md:tracking-[0.3em]">{t.servicesKicker}</p>
              <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[0.95] tracking-[-0.04em] md:text-5xl">{t.servicesTitle}</h2>
            </div>
            <p className="max-w-xl self-end text-[15px] font-medium leading-7 text-white/75 md:text-base">{t.servicesText}</p>
          </div>
          <div className="mt-16 grid border-l border-t border-white/10 md:grid-cols-2">
            {t.services.map(([number, title, text]) => (
              <article key={number} className="group border-b border-r border-white/10 p-8 transition hover:bg-white/[0.035] md:p-9 lg:min-h-72">
                <div className="flex items-start justify-between">
                  <span className="text-[12px] font-bold tracking-[0.18em] text-[#b8bd96] md:text-xs md:tracking-[0.2em]">{number}</span>
                  <ArrowUpRight className="h-5 w-5 text-white/45 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                </div>
                <h3 className="mt-6 font-serif text-3xl md:mt-16 md:text-4xl">{title}</h3>
                <p className="mt-6 max-w-md text-[15px] font-medium leading-7 text-white/68 md:text-sm md:leading-6">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projetos" className="scroll-mt-24 border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#686d4e] md:text-[11px] md:tracking-[0.3em]">{t.projectsKicker}</p>
          <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[0.95] tracking-[-0.04em] md:text-5xl">{t.projectsTitle}</h2>
          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {t.projects.map(([kind, title, text, tags, url], index) => {
              const projectImage = t.media.projectImages[index] || '';
              const projectUrl = normalizeExternalUrl(url);
              const darkCard = index % 3 === 1;
              return (
                <article key={`${kind}-${title}-${index}`} className={`group flex overflow-hidden rounded-[2rem] border border-black/10 transition duration-500 hover:-translate-y-1 ${darkCard ? 'bg-[#74795a] text-white' : index % 3 === 2 ? 'bg-[#d9d4c5]' : 'bg-[#e9e5d8]'}`}>
                  <div className="flex w-full flex-col">
                    {projectImage && (
                      <div className="relative h-52 overflow-hidden border-b border-black/10 sm:h-60">
                        <img src={projectImage} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                        {darkCard && <div className="absolute inset-0 bg-black/10" />}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between p-7">
                      <div className="flex items-center justify-between gap-4">
                        <span className={`text-[12px] font-bold uppercase tracking-[0.25em] md:text-[10px] ${darkCard ? 'text-white/75' : 'text-black/60'}`}>{kind}</span>
                        {projectUrl ? (
                          <a
                            href={projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${locale === 'it' ? 'Apri' : 'Abrir'} ${title}`}
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${darkCard ? 'border-white/30 hover:bg-white/10' : 'border-black/15 hover:bg-black/5'}`}
                          >
                            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                          </a>
                        ) : (
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${darkCard ? 'border-white/25' : 'border-black/15'}`}>
                            <ArrowUpRight className="h-4 w-4 opacity-50" />
                          </span>
                        )}
                      </div>

                      <div className={projectImage ? 'mt-8' : 'mt-14'}>
                        <h3 className="font-serif text-4xl leading-[1.02]">{title}</h3>
                        <p className={`mt-5 text-[15px] font-medium leading-7 md:text-sm md:leading-6 ${darkCard ? 'text-white/75' : 'text-black/65'}`}>{text}</p>
                        <p className={`mt-8 border-t pt-5 text-[12px] font-bold uppercase tracking-[0.18em] md:text-[10px] ${darkCard ? 'border-white/25 text-white/65' : 'border-black/10 text-black/55'}`}>{tags}</p>

                        {projectUrl ? (
                          <a
                            href={projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] transition ${darkCard ? 'text-white hover:text-white/75' : 'text-[#5d6249] hover:text-black'}`}
                          >
                            {locale === 'it' ? 'Visita il progetto' : 'Visitar projeto'}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className={`mt-5 inline-block text-[10px] font-bold uppercase tracking-[0.14em] ${darkCard ? 'text-white/55' : 'text-black/45'}`}>
                            {locale === 'it' ? 'Progetto in sviluppo' : 'Projeto em desenvolvimento'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
              const projectImage = t.media.projectImages[index] || '';
              const projectUrl = normalizeExternalUrl(url);
              const darkCard = index % 3 === 1;
              return (
                <article key={`${kind}-${title}-${index}`} className={`group flex overflow-hidden rounded-[2rem] border border-black/10 transition duration-500 hover:-translate-y-1 ${darkCard ? 'bg-[#74795a] text-white' : index % 3 === 2 ? 'bg-[#d9d4c5]' : 'bg-[#e9e5d8]'}`}>
                  <div className="flex w-full flex-col">
                    {projectImage && (
                      <div className="relative h-52 overflow-hidden border-b border-black/10 sm:h-60">
                        <img src={projectImage} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                        {darkCard && <div className="absolute inset-0 bg-black/10" />}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between p-7">
                      <div className="flex items-center justify-between gap-4">
                        <span className={`text-[12px] font-bold uppercase tracking-[0.25em] md:text-[10px] ${darkCard ? 'text-white/75' : 'text-black/60'}`}>{kind}</span>
                        {projectUrl ? (
                          <a
                            href={projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${locale === 'it' ? 'Apri' : 'Abrir'} ${title}`}
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${darkCard ? 'border-white/30 hover:bg-white/10' : 'border-black/15 hover:bg-black/5'}`}
                          >
                            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                          </a>
                        ) : (
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${darkCard ? 'border-white/25' : 'border-black/15'}`}>
                            <ArrowUpRight className="h-4 w-4 opacity-50" />
                          </span>
                        )}
                      </div>

                      <div className={projectImage ? 'mt-8' : 'mt-14'}>
                        <h3 className="font-serif text-4xl leading-[1.02]">{title}</h3>
                        <p className={`mt-5 text-[15px] font-medium leading-7 md:text-sm md:leading-6 ${darkCard ? 'text-white/75' : 'text-black/65'}`}>{text}</p>
                        <p className={`mt-8 border-t pt-5 text-[12px] font-bold uppercase tracking-[0.18em] md:text-[10px] ${darkCard ? 'border-white/25 text-white/65' : 'border-black/10 text-black/55'}`}>{tags}</p>

                        {projectUrl ? (
                          <a
                            href={projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] transition ${darkCard ? 'text-white hover:text-white/75' : 'text-[#5d6249] hover:text-black'}`}
                          >
                            {locale === 'it' ? 'Visita il progetto' : 'Visitar projeto'}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className={`mt-5 inline-block text-[10px] font-bold uppercase tracking-[0.14em] ${darkCard ? 'text-white/55' : 'text-black/45'}`}>
                            {locale === 'it' ? 'Progetto in sviluppo' : 'Projeto em desenvolvimento'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="processo" className="scroll-mt-24 border-b border-black/10 bg-[#ded9cb]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#686d4e] md:text-[11px] md:tracking-[0.3em]">{t.processKicker}</p>
              <h2 className="mt-5 font-serif text-4xl leading-[0.95] tracking-[-0.04em] md:text-5xl">{t.processTitle}</h2>
            </div>
            <div className="border-t border-black/15">
              {t.process.map(([number, title, text]) => (
                <article key={number} className="grid gap-6 border-b border-black/15 py-9 sm:grid-cols-[4rem_10rem_1fr] sm:items-start">
                  <span className="text-[12px] font-bold text-[#686d4e] md:text-xs">{number}</span>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="text-[15px] font-medium leading-7 text-black/65 md:text-sm md:leading-6">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="scroll-mt-24 bg-[#11110f] text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[.85fr_1.15fr] lg:px-10 lg:py-32">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#b8bd96] md:text-[11px] md:tracking-[0.3em]">{t.contactKicker}</p>
            <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[0.95] tracking-[-0.04em] md:text-5xl">{t.contactTitle}</h2>
            <p className="mt-7 max-w-lg text-[15px] font-medium leading-7 text-white/72 md:text-sm md:leading-7">{t.contactText}</p>
            <div className="mt-10 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white/65 md:text-xs">
              <MessageCircle className="h-4 w-4 text-[#b8bd96]" /> Brasil · Italia · Remote
            </div>
            {t.media.contactImageUrl && (
              <div className="mt-10 max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
                <img src={t.media.contactImageUrl} alt="" className="h-64 w-full object-cover" />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/15 bg-white/[0.045] p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-[13px] font-semibold text-white/85 md:text-xs">{t.form.name}
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-[16px] text-white outline-none transition placeholder:text-white/35 focus:border-[#b8bd96] md:text-sm" />
              </label>
              <label className="text-[13px] font-semibold text-white/85 md:text-xs">{t.form.email}
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-[16px] text-white outline-none transition focus:border-[#b8bd96] md:text-sm" />
              </label>
              <label className="text-[13px] font-semibold text-white/85 md:text-xs">{t.form.whatsapp}
                <input required type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-[16px] text-white outline-none transition focus:border-[#b8bd96] md:text-sm" />
              </label>
              <label className="text-[13px] font-semibold text-white/85 md:text-xs">{t.form.service}
                <select required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="mt-2 w-full rounded-xl border border-white/15 bg-[#191916] px-4 py-3 text-[16px] text-white outline-none transition focus:border-[#b8bd96] md:text-sm">
                  <option value="">{t.form.servicePlaceholder}</option>
                  {t.form.services.map((service) => <option key={service} value={service}>{service}</option>)}
                </select>
              </label>
            </div>
            <label className="mt-5 block text-[13px] font-semibold text-white/85 md:text-xs">{t.form.message}
              <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-[16px] text-white outline-none transition focus:border-[#b8bd96] md:text-sm" />
            </label>
            <button disabled={loading} type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#e9e5d8] px-5 py-4 text-sm font-bold text-[#171713] transition hover:bg-[#b8bd96] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t.form.sending}</> : <>{t.form.submit}<ArrowRight className="h-4 w-4" /></>}
            </button>
            <div className="mt-5 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.15em] text-white/45 md:text-[10px]"><Check className="h-3 w-3" /> Firebase workflow connected</div>
          </form>
        </div>
      </section>

      <footer className="bg-[#11110f] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 border-t border-white/10 px-6 py-9 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="F.LLI FRANCHI" className={`h-9 w-9 object-contain ${defaultLogo ? 'brightness-0 invert' : ''}`} />
            <span className="text-[13px] font-bold tracking-[0.22em] md:text-xs">F.LLI FRANCHI</span>
          </div>
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/60 md:text-[10px]">{t.footer}</p>
          <Link to="/" className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#b8bd96] md:text-[10px]">Brasil / Italia</Link>
        </div>
      </footer>
    </main>
  );
};

export default FlliHome;
