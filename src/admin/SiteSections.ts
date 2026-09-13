// Estrutura de dados para seções editáveis do site
// Cada seção pode ter campos flexíveis (textos, imagens, listas, etc)

export interface SiteSection {
  id: string;
  name: string; // Ex: 'hero', 'sobre', 'servicos', etc
  label: string; // Nome amigável para exibir no painel
  content: Record<string, any>; // Campos dinâmicos (textos, imagens, listas)
  updatedAt: Date;
  updatedBy: string; // UID do usuário
}

// Exemplo de estrutura inicial para popular o Firestore
export const initialSections: SiteSection[] = [
  {
    id: 'hero',
    name: 'hero',
    label: 'Hero/Banner Principal',
    content: {
      titulo: 'Bem-vindo à F.LLI FRANCHI',
      subtitulo: 'Soluções criativas para seu negócio',
      imagem: '',
      cta: 'Solicite um orçamento',
      ctaLink: '#contact',
      styles: {
        animationPreset: 'premium',
        revealEnabled: true,
        hoverEnabled: true,
        parallaxEnabled: true,
        heroPinEnabled: true,
        heroOverlapEnabled: true,
      }
    },
    updatedAt: new Date(),
    updatedBy: ''
  },
  {
    id: 'sobre',
    name: 'sobre',
    label: 'Sobre Nós',
    content: {
      titulo: 'Quem somos',
      texto: 'A F.LLI FRANCHI é especialista em soluções digitais...'
    },
    updatedAt: new Date(),
    updatedBy: ''
  },
  {
    id: 'servicos',
    name: 'servicos',
    label: 'Serviços',
    content: {
      titulo: 'Nossos Serviços',
      subtitulo: 'Oferecemos soluções digitais completas para impulsionar seu negócio no mundo online',
      cta: 'Solicitar Orçamento',
      servicos: [
        { title: 'Desenvolvimento Web', description: 'Desenvolvimento de sites modernos, responsivos e otimizados para SEO.', features: ['Responsivo', 'SEO Otimizado', 'Performance', 'Segurança'], icon: 'Globe' },
        { title: 'Aplicativos Mobile', description: 'Aplicativos nativos e híbridos para iOS e Android.', features: ['iOS & Android', 'UX/UI', 'Performance', 'Publicação'], icon: 'Smartphone' },
        { title: 'Design Digital', description: 'Design de marcas, identidade visual, logos e cartões digitais.', features: ['Logos', 'Cartões Digitais', 'Banners', 'Identidade Visual'], icon: 'Palette' },
        { title: 'Cartões Digitais', description: 'Cartões digitais interativos e clicáveis para networking moderno.', features: ['Interativo', 'Clicável', 'Compartilhável', 'Analytics'], icon: 'MousePointer' },
        { title: 'Banners Publicitários', description: 'Banners digitais criativos e impactantes para campanhas online.', features: ['Animados', 'Responsivos', 'Otimizados', 'Criativos'], icon: 'Megaphone' },
        { title: 'Vídeos Corporativos', description: 'Produção de conteúdo audiovisual para apresentações e marketing.', features: ['Roteiro', 'Edição', 'Motion Graphics', 'Trilha Sonora'], icon: 'Video' },
      ]
    },
    updatedAt: new Date(),
    updatedBy: ''
  },
  {
    id: 'portfolio',
    name: 'portfolio',
    label: 'Portfólio',
    content: {
      titulo: 'Nosso Portfolio',
      subtitulo: 'Conheça alguns dos projetos que desenvolvemos com excelência e inovação',
      cta: 'Ver Todos os Projetos',
      styles: {
        animationPreset: 'premium',
        revealEnabled: true,
        hoverEnabled: true,
        portfolioLayout: 'carousel',
      },
      projetos: [
        { id: 1, title: 'E-commerce Moderno', category: 'web', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80', description: 'Plataforma de e-commerce com design moderno, checkout seguro e painel administrativo personalizado.', technologies: ['React', 'TypeScript', 'Node.js', 'Stripe'] },
        { id: 2, title: 'App de Delivery', category: 'mobile', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', description: 'Aplicativo mobile para delivery com interface intuitiva, rastreamento em tempo real e integração com pagamentos.', technologies: ['React Native', 'Firebase', 'Maps API', 'Payments'] },
        { id: 3, title: 'Identidade Visual', category: 'design', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', description: 'Criação completa de identidade visual, manual de marca e aplicações digitais para startup.', technologies: ['Figma', 'Illustrator', 'Photoshop', 'Branding'] },
        { id: 4, title: 'Sistema de Gestão', category: 'web', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', description: 'Dashboard administrativo com analytics em tempo real, controle de permissões e relatórios customizados.', technologies: ['React', 'TypeScript', 'Chart.js', 'PostgreSQL'] },
        { id: 5, title: 'Cartão Digital', category: 'design', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80', description: 'Cartão de visita digital interativo, responsivo e com compartilhamento via QR Code.', technologies: ['Figma', 'Photoshop', 'Illustrator', 'QR Code'] },
        { id: 6, title: 'App Fitness', category: 'mobile', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', description: 'Aplicativo para acompanhamento de exercícios, dieta e integração com dispositivos de saúde.', technologies: ['React Native', 'TypeScript', 'Health API', 'Firebase'] },
      ]
    },
    updatedAt: new Date(),
    updatedBy: ''
  },
  {
    id: 'depoimentos',
    name: 'depoimentos',
    label: 'Depoimentos',
    content: {
      titulo: 'O que dizem nossos clientes',
      subtitulo: 'Veja o que nossos clientes falam sobre nosso trabalho',
      depoimentos: [
        { name: 'Ana Souza', role: 'Clínica Vida', content: 'A F.LLI FRANCHI superou nossas expectativas! O site ficou moderno, rápido e já trouxe novos clientes para a clínica.', rating: 5, avatar: '' },
        { name: 'Carlos Lima', role: 'Lima Engenharia', content: 'Equipe atenciosa, entregaram nosso portfólio digital no prazo e com excelente qualidade. Recomendo!', rating: 5, avatar: '' },
        { name: 'Juliana Torres', role: 'Juliana MakeUp', content: 'O cartão digital ficou incrível e facilitou muito meu networking. Atendimento diferenciado!', rating: 5, avatar: '' },
      ]
    },
    updatedAt: new Date(),
    updatedBy: ''
  },
  {
    id: 'contato',
    name: 'contato',
    label: 'Contato',
    content: {
      titulo: 'Solicite seu Orçamento',
      subtitulo: 'Preencha o formulário abaixo e entraremos em contato',
      servicos: ['Desenvolvimento Web', 'Aplicativo Mobile', 'Design Digital', 'Cartão Digital', 'Banner Publicitário', 'Vídeo Corporativo', 'Outros'],
      cta: 'Enviar Solicitação',
      aviso: 'Responderemos em até 24 horas úteis.'
    },
    updatedAt: new Date(),
    updatedBy: ''
  },
  {
    id: 'menu',
    name: 'menu',
    label: 'Menu Principal',
    content: {
      logo: '/brand/flli-monogram.svg',
      itens: [
        { label: 'Início', href: '#home' },
        { label: 'Serviços', href: '#services' },
        { label: 'Portfolio', href: '#portfolio' },
        { label: 'Contato', href: '#contact' },
      ],
    },
    updatedAt: new Date(),
    updatedBy: ''
  },
  {
    id: 'rodape',
    name: 'rodape',
    label: 'Rodapé',
    content: {
      logo: '/brand/flli-monogram.svg',
      descricao: 'Soluções digitais inovadoras para o seu negócio. Especialistas em tecnologia, design e transformação digital.',
      email: 'neifranchi@gmail.com',
      telefone: '(16) 99781-3038',
      whatsapp: '5516997813038',
      cidade: 'Araraquara, SP',
      copyright: 'F.LLI FRANCHI. Todos os direitos reservados.',
      linkServicos: [
        { label: 'Desenvolvimento Web', href: '#services' },
        { label: 'Aplicativos Mobile', href: '#services' },
        { label: 'Design Digital', href: '#services' },
        { label: 'Cartão Digital', href: '#services' },
        { label: 'Vídeos Corporativos', href: '#services' },
      ],
      linkEmpresa: [
        { label: 'Sobre Nós', href: '#about' },
        { label: 'Portfolio', href: '#portfolio' },
        { label: 'Contato', href: '#contact' },
        { label: 'Orçamento', href: '#contact' },
        { label: 'Política de Privacidade', href: '/privacidade' },
      ],
      redesSociais: [
        { label: 'WhatsApp', href: 'https://wa.me/5516997813038' },
        { label: 'Email', href: 'mailto:neifranchi@gmail.com' },
        { label: 'LinkedIn', href: '#' },
        { label: 'Instagram', href: '#' },
      ],
    },
    updatedAt: new Date(),
    updatedBy: ''
  },
];
