
import React from 'react';
import { Heart, Code, Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer - Rodapé com informações da empresa e links úteis
 * Features: Links organizados, informações de contato, branding
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Desenvolvimento Web', href: '#services' },
      { label: 'Apps Mobile', href: '#services' },
      { label: 'Design Digital', href: '#services' },
      { label: 'Cartão Digital', href: '#services' },
      { label: 'Vídeos Corporativos', href: '#services' }
    ],
    company: [
      { label: 'Sobre Nós', href: '#about' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Contato', href: '#contact' },
      { label: 'Orçamento', href: '#contact' }
    ],
    social: [
      { label: 'WhatsApp', href: 'https://wa.me/5516997813038' },
      { label: 'Email', href: 'mailto:neifranchi@gmail.com' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Instagram', href: '#' }
    ]
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Conteúdo principal do footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/img/logo-neitech.png" 
                alt="NeiTech Soluções Web - Logo" 
                className="h-16 w-auto brightness-0 invert"
              />
            </div>
            
            <p className="text-slate-300 leading-relaxed max-w-md">
              Criamos soluções digitais inovadoras que impulsionam negócios para o futuro. 
              Especialistas em desenvolvimento web, mobile, design digital e vídeos corporativos.
            </p>

            {/* Informações de contato direto */}
            <div className="space-y-3">
              <a
                href="mailto:neifranchi@gmail.com"
                className="flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                <Mail size={18} className="text-blue-400" />
                <span>neifranchi@gmail.com</span>
              </a>
              <a
                href="https://wa.me/5516997813038"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                <Phone size={18} className="text-blue-400" />
                <span>(16) 99781-3038</span>
              </a>
              <div className="flex items-center space-x-3 text-slate-300">
                <MapPin size={18} className="text-blue-400" />
                <span>Araraquara, SP</span>
              </div>
            </div>
          </div>

          {/* Links de Serviços */}
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Serviços</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href.substring(1))}
                    className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links da Empresa */}
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href.substring(1))}
                    className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divisória */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>&copy; {currentYear} NeiTech Soluções Web. Todos os direitos reservados.</span>
            </div>

            {/* Made with love */}
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>Feito com</span>
              <Heart size={16} className="text-red-500 animate-pulse" />
              <span>e</span>
              <Code size={16} className="text-blue-400" />
              <span>por NeiTech</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra final com gradiente */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>
    </footer>
  );
};

export default Footer;
