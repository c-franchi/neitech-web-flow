export type FlliLocale = 'br' | 'it';

export type FlliServiceItem = [string, string, string];
export type FlliProjectItem = [string, string, string, string, string];
export type FlliProcessItem = [string, string, string];

export interface FlliMedia {
  logoUrl: string;
  heroImageUrl: string;
  projectImages: string[];
  contactImageUrl: string;
  socialImageUrl: string;
}

export interface FlliContent {
  lang: string;
  title: string;
  description: string;
  nav: string[];
  navIds: string[];
  localeLabel: string;
  localeHref: string;
  eyebrow: string;
  heroA: string;
  heroB: string;
  heroText: string;
  ctaPrimary: string;
  ctaSecondary: string;
  proof: string[];
  servicesKicker: string;
  servicesTitle: string;
  servicesText: string;
  services: FlliServiceItem[];
  projectsKicker: string;
  projectsTitle: string;
  projects: FlliProjectItem[];
  processKicker: string;
  processTitle: string;
  process: FlliProcessItem[];
  contactKicker: string;
  contactTitle: string;
  contactText: string;
  media: FlliMedia;
  form: {
    name: string;
    email: string;
    whatsapp: string;
    service: string;
    message: string;
    servicePlaceholder: string;
    submit: string;
    sending: string;
    services: string[];
    successTitle: string;
    successDescription: string;
    errorTitle: string;
    errorDescription: string;
  };
  footer: string;
}

const defaultMedia = (): FlliMedia => ({
  logoUrl: '/brand/flli-monogram.svg',
  heroImageUrl: '',
  projectImages: ['', '', ''],
  contactImageUrl: '',
  socialImageUrl: '',
});

export const defaultFlliContent: Record<FlliLocale, FlliContent> = {
  br: {
    lang: 'pt-BR',
    title: 'F.LLI FRANCHI | Sites, Apps, PWA, Automação e Design Digital',
    description: 'Estúdio digital F.LLI FRANCHI: sites profissionais, aplicações web, PWA, automações, design e soluções digitais para transformar ideias em produtos reais.',
    nav: ['Serviços', 'Projetos', 'Processo', 'Contato'],
    navIds: ['servicos', 'projetos', 'processo', 'contato'],
    localeLabel: 'IT',
    localeHref: '/it',
    eyebrow: 'Estúdio digital · Brasil & Itália',
    heroA: 'Tecnologia com',
    heroB: 'identidade.',
    heroText: 'Criamos experiências digitais que unem estratégia, engenharia e design — da primeira ideia ao produto publicado e pronto para crescer.',
    ctaPrimary: 'Fale sobre seu projeto',
    ctaSecondary: 'Ver projetos',
    proof: ['Web & PWA', 'Automação', 'Design digital', 'Soluções sob medida'],
    servicesKicker: 'O que fazemos',
    servicesTitle: 'Construímos o digital por inteiro.',
    servicesText: 'Uma operação enxuta para transformar estratégia em interface, código, integração e resultado.',
    services: [
      ['01', 'Sites & Landing Pages', 'Sites institucionais, páginas de campanha e experiências de alta conversão, rápidas e responsivas.'],
      ['02', 'Apps Web & PWA', 'Aplicações instaláveis, áreas restritas, painéis, fluxos operacionais e sistemas sob medida.'],
      ['03', 'Automação & Integrações', 'Conectamos processos, dados e serviços para reduzir trabalho manual e aumentar confiabilidade.'],
      ['04', 'Design & Conteúdo Digital', 'Identidade visual, interfaces, banners, peças digitais e sistemas de comunicação coerentes com a marca.'],
    ],
    projectsKicker: 'Projetos selecionados',
    projectsTitle: 'Soluções construídas para uso real.',
    projects: [
      [
        'E-commerce',
        'Quarteto Kids',
        'Loja infantil online com catálogo e variações, checkout, PIX e cartão, cálculo de frete, retirada em loja, cupons e painel administrativo.',
        'E-commerce · PWA · Stripe · Mercado Pago',
        'https://quartetokids.com.br',
      ],
      [
        'Web app',
        'Reuniões CCB',
        'Sistema para ensaios e reuniões com busca rápida de músicos, confirmação de presença, justificativas, relatórios em PDF e gestão administrativa.',
        'Web app · Firebase · Relatórios · Busca',
        'https://reunioesccb.app.br',
      ],
      [
        'Plataforma',
        'Clube da Tia Mary',
        'Plataforma de assinatura para aulas de crochê, vídeos, conteúdos exclusivos, comunidade e gestão de membros.',
        'Membership · Conteúdo · Vídeo · UX',
        '',
      ],
    ],
    processKicker: 'Como trabalhamos',
    processTitle: 'Clareza antes de código.',
    process: [
      ['01', 'Diagnóstico', 'Entendemos objetivo, público, operação atual e o que realmente precisa ser resolvido.'],
      ['02', 'Direção', 'Definimos arquitetura, experiência, escopo e prioridades antes de acelerar o desenvolvimento.'],
      ['03', 'Construção', 'Design e código evoluem juntos, com validações frequentes e foco no uso real.'],
      ['04', 'Publicação', 'Revisamos performance, responsividade, SEO e integrações antes da entrega.'],
    ],
    contactKicker: 'Vamos construir',
    contactTitle: 'Conte sua ideia. Nós estruturamos o próximo passo.',
    contactText: 'Envie os dados básicos do projeto. A solicitação entra no mesmo fluxo de orçamento da nossa área administrativa.',
    media: defaultMedia(),
    form: {
      name: 'Nome',
      email: 'E-mail',
      whatsapp: 'WhatsApp',
      service: 'Serviço',
      message: 'Conte brevemente o que precisa',
      servicePlaceholder: 'Selecione',
      submit: 'Solicitar conversa',
      sending: 'Enviando...',
      services: ['Site / Landing Page', 'Aplicação Web / PWA', 'Automação / Integração', 'Design / Conteúdo Digital', 'Outro'],
      successTitle: 'Solicitação enviada',
      successDescription: 'Recebemos seu contato e retornaremos pelo WhatsApp ou e-mail.',
      errorTitle: 'Não foi possível enviar',
      errorDescription: 'Tente novamente em alguns instantes.',
    },
    footer: 'Estratégia · Design · Tecnologia',
  },
  it: {
    lang: 'it-IT',
    title: 'F.LLI FRANCHI | Siti, App, PWA, Automazione e Design Digitale',
    description: 'Studio digitale F.LLI FRANCHI: siti professionali, applicazioni web, PWA, automazioni, design e soluzioni digitali tra Brasile e Italia.',
    nav: ['Servizi', 'Progetti', 'Processo', 'Contatto'],
    navIds: ['servicos', 'projetos', 'processo', 'contato'],
    localeLabel: 'BR',
    localeHref: '/br',
    eyebrow: 'Studio digitale · Brasile & Italia',
    heroA: 'Tecnologia con',
    heroB: 'identità.',
    heroText: 'Creiamo esperienze digitali che uniscono strategia, ingegneria e design — dalla prima idea al prodotto online, pronto a crescere.',
    ctaPrimary: 'Parliamo del progetto',
    ctaSecondary: 'Vedi i progetti',
    proof: ['Web & PWA', 'Automazione', 'Design digitale', 'Soluzioni su misura'],
    servicesKicker: 'Cosa facciamo',
    servicesTitle: 'Costruiamo il digitale, completamente.',
    servicesText: 'Un team agile per trasformare strategia in interfaccia, codice, integrazione e risultato.',
    services: [
      ['01', 'Siti & Landing Page', 'Siti istituzionali, pagine di campagna ed esperienze ad alta conversione, veloci e responsive.'],
      ['02', 'Web App & PWA', 'Applicazioni installabili, aree riservate, dashboard, flussi operativi e sistemi su misura.'],
      ['03', 'Automazione & Integrazioni', 'Colleghiamo processi, dati e servizi per ridurre il lavoro manuale e aumentare l’affidabilità.'],
      ['04', 'Design & Contenuti Digitali', 'Identità visiva, interfacce, banner, materiali digitali e sistemi di comunicazione coerenti con il brand.'],
    ],
    projectsKicker: 'Progetti selezionati',
    projectsTitle: 'Soluzioni create per un utilizzo reale.',
    projects: [
      [
        'E-commerce',
        'Quarteto Kids',
        'Negozio online per bambini con catalogo e varianti, checkout, PIX e carta, spedizione, ritiro in negozio, coupon e pannello amministrativo.',
        'E-commerce · PWA · Stripe · Mercado Pago',
        'https://quartetokids.com.br',
      ],
      [
        'Web app',
        'Reuniões CCB',
        'Sistema per prove e riunioni con ricerca rapida dei musicisti, conferma delle presenze, giustificazioni, report PDF e gestione amministrativa.',
        'Web app · Firebase · Report · Ricerca',
        'https://reunioesccb.app.br',
      ],
      [
        'Piattaforma',
        'Clube da Tia Mary',
        'Piattaforma in abbonamento per lezioni di uncinetto, video, contenuti esclusivi, community e gestione dei membri.',
        'Membership · Contenuti · Video · UX',
        '',
      ],
    ],
    processKicker: 'Come lavoriamo',
    processTitle: 'Chiarezza prima del codice.',
    process: [
      ['01', 'Diagnosi', 'Comprendiamo obiettivo, pubblico, operazione attuale e il problema che deve essere davvero risolto.'],
      ['02', 'Direzione', 'Definiamo architettura, esperienza, ambito e priorità prima di accelerare lo sviluppo.'],
      ['03', 'Costruzione', 'Design e codice evolvono insieme, con validazioni frequenti e attenzione all’uso reale.'],
      ['04', 'Pubblicazione', 'Controlliamo performance, responsive, SEO e integrazioni prima della consegna.'],
    ],
    contactKicker: 'Costruiamo insieme',
    contactTitle: 'Raccontaci la tua idea. Noi strutturiamo il passo successivo.',
    contactText: 'Invia le informazioni principali del progetto. La richiesta entra direttamente nel nostro flusso amministrativo di preventivi.',
    media: defaultMedia(),
    form: {
      name: 'Nome',
      email: 'E-mail',
      whatsapp: 'WhatsApp',
      service: 'Servizio',
      message: 'Descrivi brevemente cosa ti serve',
      servicePlaceholder: 'Seleziona',
      submit: 'Richiedi un contatto',
      sending: 'Invio...',
      services: ['Sito / Landing Page', 'Web App / PWA', 'Automazione / Integrazione', 'Design / Contenuti Digitali', 'Altro'],
      successTitle: 'Richiesta inviata',
      successDescription: 'Abbiamo ricevuto il tuo contatto. Ti risponderemo via WhatsApp o e-mail.',
      errorTitle: 'Invio non riuscito',
      errorDescription: 'Riprova tra qualche istante.',
    },
    footer: 'Strategia · Design · Tecnologia',
  },
};

export const cloneFlliContent = (content: FlliContent): FlliContent =>
  JSON.parse(JSON.stringify(content)) as FlliContent;
