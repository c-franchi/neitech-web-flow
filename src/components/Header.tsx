
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { getSectionMotionSettings, type SectionStyles } from '../types/sectionStyles';

/**
 * Componente Header - Navegação principal do site
 * Features: Menu responsivo, scroll spy, animações suaves
 */
interface HeaderProps {
  topOffset?: number;
  zIndexClassName?: string;
  data?: {
    logo?: string;
    itens?: Array<{ label: string; href: string }>;
    styles?: SectionStyles;
  };
}

const Header: React.FC<HeaderProps> = ({ data, topOffset = 0, zIndexClassName = 'z-50' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const headerRef = useRef<HTMLElement>(null);

  const styles = data?.styles;
  const motion = getSectionMotionSettings(styles);

  useScrollAnimation(headerRef, {
    targets: '[data-header-motion]',
    y: Math.min(motion.revealY, 18),
    duration: Math.min(motion.revealDuration || 0.28, 0.34),
    stagger: Math.min(motion.stagger, 0.05),
    start: 'top top',
    disabled: !motion.revealEnabled,
  });

  // Detecta scroll para mudar estilo do header e scroll spy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Scroll spy
      const sections = [
        { id: 'home', offset: 0 },
        { id: 'services', offset: 0 },
        { id: 'portfolio', offset: 0 },
        { id: 'contact', offset: 0 },
      ];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 100;
          if (window.scrollY >= top) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // inicializa
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = useMemo(() => {
    const items = data?.itens && data.itens.length > 0
      ? data.itens
      : [
          { label: 'Início', href: '#home' },
          { label: 'Serviços', href: '#services' },
          { label: 'Portfolio', href: '#portfolio' },
          { label: 'Contato', href: '#contact' },
        ];

    return items.map((item) => ({
      ...item,
      id: item.href.replace('#', '') || 'home',
    }));
  }, [data?.itens]);

  const logoSrc = data?.logo || '/img/nyv8-menu.png';

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 ${zIndexClassName} transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      style={{
        top: topOffset,
        ...(styles?.fontFamily ? { fontFamily: styles.fontFamily } : {}),
        ...(styles?.backgroundColor && isScrolled ? { backgroundColor: styles.backgroundColor } : {}),
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div data-header-motion className="flex items-center space-x-2">
            <img 
              src={logoSrc}
              alt="NYV8 Digital - Logo" 
              loading="lazy" decoding="async"
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                data-header-motion
                href={item.href}
                className={`interactive-link font-medium transition-colors duration-200 relative group ${
                  activeSection === item.id ? 'text-blue-800' : 'text-slate-600 hover:text-blue-600'
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
                style={styles?.textColor ? { color: activeSection === item.id ? styles.accentColor || styles.textColor : styles.textColor } : {}}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-800 transition-all duration-300 ${
                  activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`} style={styles?.accentColor ? { backgroundColor: styles.accentColor } : {}}></span>
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            data-header-motion
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
            style={styles?.textColor ? { color: styles.textColor } : {}}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-slate-200 bg-white/95 shadow-xl rounded-xl">
            <div className="space-y-2 pt-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`interactive-link block py-2 px-4 rounded-lg transition-colors duration-200 ${
                    activeSection === item.id ? 'text-blue-800 bg-blue-50 font-semibold' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  style={styles?.textColor ? { color: activeSection === item.id ? styles.accentColor || styles.textColor : styles.textColor } : {}}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
