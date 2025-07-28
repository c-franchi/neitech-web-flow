
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
      { label: 'Vídeos Corporativos', href: '#services' }
    ],
    company: [
      { label: 'Sobre Nós', href: '#about' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Contato', href: '#contact' },
      { label: 'Blog', href: '#blog' }
    ],
    social: [
      { label: 'LinkedIn', href: '#' },
      { label: 'Instagram', href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'YouTube', href: '#' }
    ]
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Conteúdo principal do footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/c843c9c6-4e20-47e7-8c42-c19f2f6694bf.png" 
                alt="NeiTech Logo" 
                className="h-16 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            
            <p className="text-slate-300 leading-relaxed max-w-md">
              Criamos soluções digitais inovadoras que impulsionam negócios para o futuro. 
              Especialistas em desenvolvimento web, mobile e design digital.
            </p>

            {/* Informações de contato direto */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail size={18} className="text-blue-400" />
                <span>contato@neitech.com.br</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Phone size={18} className="text-blue-400" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <MapPin size={18} className="text-blue-400" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Links de Serviços */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Serviços</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links da Empresa */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
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
