import React, { useEffect } from 'react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Heart, Code, Mail, Phone, MapPin } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { loadSectionFonts } from '../utils/loadGoogleFont';
import { getSectionMotionSettings, type SectionStyles } from '../types/sectionStyles';

/**
 * Footer - Rodapé com informações da empresa e links úteis
 * Features: Links organizados, informações de contato, branding
 */
interface FooterProps {
  data?: {
    logo?: string;
    descricao?: string;
    email?: string;
    telefone?: string;
    whatsapp?: string;
    cidade?: string;
    copyright?: string;
    linkServicos?: Array<{ label: string; href: string }>;
    linkEmpresa?: Array<{ label: string; href: string; external?: boolean }>;
    redesSociais?: Array<{ label: string; href: string }>;
    styles?: SectionStyles;
  };
}

const Footer: React.FC<FooterProps> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const styles = data?.styles;
  const motion = getSectionMotionSettings(styles);

  useEffect(() => {
    loadSectionFonts(styles);
  }, [styles?.fontFamily, styles?.headingFontFamily]);

  const footerLinks = {
    services: data?.linkServicos || [
      { label: 'Desenvolvimento Web', href: '#services' },
      { label: 'Aplicativos Mobile', href: '#services' },
      { label: 'Design Digital', href: '#services' },
      { label: 'Cartão Digital', href: '#services' },
      { label: 'Vídeos Corporativos', href: '#services' }
    ],
    company: data?.linkEmpresa || [
      { label: 'Sobre Nós', href: '#about' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Contato', href: '#contact' },
      { label: 'Orçamento', href: '#contact' },
      { label: 'Política de Privacidade', href: '/privacidade', external: true }
    ],
    social: data?.redesSociais || [
      { label: 'WhatsApp', href: 'https://wa.me/5516997813038' },
      { label: 'Email', href: 'mailto:neifranchi@gmail.com' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Instagram', href: '#' }
    ]
  };

  const logoSrc = data?.logo || '/brand/flli-monogram.svg';
  const descricao = data?.descricao || 'Soluções digitais inovadoras para o seu negócio. Especialistas em tecnologia, design e transformação digital.';
  const email = data?.email || 'neifranchi@gmail.com';
  const telefone = data?.telefone || '(16) 99781-3038';
  const whatsapp = data?.whatsapp || '5516997813038';
  const cidade = data?.cidade || 'Araraquara, SP';
  const copyright = data?.copyright || 'F.LLI FRANCHI. Todos os direitos reservados.';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAdmin = useIsAdmin();
  const navigate = typeof window !== 'undefined' ? (window.location ? (path) => window.location.href = path : () => {}) : () => {};

  return (
    <footer className="bg-slate-900 text-white" style={{
      ...(styles?.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}),
      ...(styles?.fontFamily ? { fontFamily: styles.fontFamily } : {}),
      ...(styles?.textColor ? { color: styles.textColor } : {}),
    }}>
      {/* Conteúdo principal do footer */}
      <div className="container mx-auto px-4 py-16">
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" targets="[data-footer-column]" stagger={motion.stagger} y={Math.min(motion.revealY, 24)} duration={Math.min(motion.revealDuration || 0.34, 0.4)} disabled={!motion.revealEnabled}>
          {/* Logo e descrição */}
          <div data-footer-column className="md:col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src={logoSrc}
                alt="F.LLI FRANCHI - Logo" 
                loading="lazy" decoding="async"
                className="h-16 w-auto"
              />
            </div>
            
            <p className="text-slate-300 leading-relaxed max-w-md" style={styles?.textColor ? { color: styles.textColor } : {}}>
              {descricao}
            </p>

            {/* Informações de contato direto */}
            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                className="interactive-link flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                <Mail size={18} className="text-blue-400" style={styles?.accentColor ? { color: styles.accentColor } : {}} />
                <span>{email}</span>
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-link flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                <Phone size={18} className="text-blue-400" style={styles?.accentColor ? { color: styles.accentColor } : {}} />
                <span>{telefone}</span>
              </a>
              <div className="flex items-center space-x-3 text-slate-300">
                <MapPin size={18} className="text-blue-400" style={styles?.accentColor ? { color: styles.accentColor } : {}} />
                <span>{cidade}</span>
              </div>
            </div>
          </div>

          {/* Links de Serviços */}
          <div data-footer-column className="md:col-span-1 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-blue-400" style={styles?.accentColor ? { color: styles.accentColor } : {}}>Serviços</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href.substring(1))}
                    className="interactive-link text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links da Empresa */}
          <div data-footer-column className="md:col-span-1 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-blue-400" style={styles?.accentColor ? { color: styles.accentColor } : {}}>Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="interactive-link text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-left"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.href.substring(1))}
                      className="interactive-link text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-left"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>

        {/* Divisória */}
        <AnimatedSection className="border-t border-slate-700 mt-12 pt-8" y={18} duration={0.3} disabled={!motion.revealEnabled}>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>&copy; {currentYear} {copyright}</span>
            </div>

            {/* Made with love */}
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>Feito com</span>
              <Heart size={16} className="text-red-500 animate-pulse" />
              <span>e</span>
              <Code size={16} className="text-blue-400" />
              <span>por F.LLI FRANCHI</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Login/Admin links */}
        <div className="mt-8 flex justify-center">
          {!isAdmin ? (
            <button
              className="text-blue-400 hover:text-white underline text-sm"
              onClick={() => navigate('/admin')}
            >
              Acesso Restrito
            </button>
          ) : (
            <>
              <button
                className="text-blue-400 hover:text-white underline text-sm mr-4"
                onClick={() => navigate('/')}
              >
                Voltar para edição da Home
              </button>
              <button
                className="text-blue-400 hover:text-white underline text-sm"
                onClick={() => navigate('/admin')}
              >
                Área Admin
              </button>
            </>
          )}
        </div>
      </div>

      {/* Barra final com gradiente */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" style={styles?.accentColor ? { backgroundImage: `linear-gradient(to right, ${styles.accentColor}, ${styles.buttonColor || styles.accentColor}, ${styles.accentColor})` } : {}}></div>
    </footer>
  );
};

export default Footer;
