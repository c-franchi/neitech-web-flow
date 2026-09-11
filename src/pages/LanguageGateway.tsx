import { useEffect } from 'react';
import { ArrowUpRight, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const setMeta = (selector: string, attributes: Record<string, string>, content?: string) => {
  let tag = document.head.querySelector(selector) as HTMLElement | null;
  if (!tag) {
    tag = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => tag?.setAttribute(key, value));
  if (content !== undefined) tag.setAttribute('content', content);
};

const LanguageGateway = () => {
  useEffect(() => {
    const title = 'F.LLI FRANCHI | Brasil & Italia';
    const description = 'F.LLI FRANCHI cria sites, aplicações, experiências digitais e soluções tecnológicas para negócios no Brasil e na Itália.';
    const canonical = 'https://fllifranchi.com/';

    document.documentElement.lang = 'pt-BR';
    document.title = title;
    setMeta('meta[name="description"]', { name: 'description' }, description);
    setMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    setMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    setMeta('meta[property="og:url"]', { property: 'og:url' }, canonical);
    setMeta('link[rel="canonical"]', { rel: 'canonical', href: canonical });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#11110f] text-[#f2eee2]">
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#74795a]/30 blur-3xl" />
        <div className="absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-[#958b6d]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10 lg:px-14">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img src="/brand/flli-monogram.svg" alt="F.LLI FRANCHI" className="h-11 w-11" />
            <div>
              <p className="text-sm font-semibold tracking-[0.24em]">F.LLI FRANCHI</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#a9ad8d]">Digital studio</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 sm:flex">
            <Globe2 className="h-4 w-4" /> Brasil · Italia
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-14 lg:py-20">
          <div className="mb-10 max-w-4xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#a9ad8d]">Tecnologia com identidade</p>
            <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              Escolha sua experiência.
              <span className="mt-2 block text-white/45">Scegli la tua esperienza.</span>
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/br" className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#e9e5d8] p-7 text-[#171713] transition duration-500 hover:-translate-y-1 hover:border-[#a9ad8d] md:p-10">
              <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-r from-[#168b46] via-[#f3f0e6] to-[#d8a42b]" />
              <div className="flex min-h-56 flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#5d6249]">Brasil</span>
                  <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div>
                  <h2 className="font-serif text-4xl md:text-5xl">Português</h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-black/55">Sites, aplicações, automações e experiências digitais construídas com estratégia, design e engenharia.</p>
                </div>
              </div>
            </Link>

            <Link to="/it" className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#74795a] p-7 text-white transition duration-500 hover:-translate-y-1 hover:border-white/30 md:p-10">
              <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-r from-[#168b46] via-white to-[#cc3c3c]" />
              <div className="flex min-h-56 flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.28em] text-white/65">Italia</span>
                  <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div>
                  <h2 className="font-serif text-4xl md:text-5xl">Italiano</h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/65">Siti, applicazioni, automazioni ed esperienze digitali progettate con strategia, design e tecnologia.</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>F.LLI FRANCHI © 2026</span>
          <span>Brazil · Italy · Digital</span>
        </footer>
      </div>
    </main>
  );
};

export default LanguageGateway;
