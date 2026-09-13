import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cloneFlliContent, defaultFlliContent, FlliContent, FlliLocale, FlliProjectItem } from '@/content/flliContent';

const COLLECTION = 'flli_site_content';

const LEGACY_PROJECTS: Record<FlliLocale, Array<[string, string, string, string]>> = {
  br: [
    ['Commerce', 'Venda, pagamento e logística', 'Experiências de e-commerce com catálogo, checkout, pagamentos, retirada, frete e administração.', 'E-commerce · Checkout · Admin'],
    ['Operations', 'Presença e gestão de eventos', 'Sistemas rápidos para cadastro, busca, confirmação, relatórios e rotinas administrativas.', 'Web app · Dados · Relatórios'],
    ['Learning', 'Conteúdo e comunidade', 'Plataformas de assinatura para organizar aulas, conteúdo exclusivo, membros e relacionamento.', 'Membership · Conteúdo · UX'],
  ],
  it: [
    ['Commerce', 'Vendita, pagamento e logistica', 'Esperienze e-commerce con catalogo, checkout, pagamenti, ritiro, spedizione e amministrazione.', 'E-commerce · Checkout · Admin'],
    ['Operations', 'Presenze e gestione eventi', 'Sistemi veloci per registrazione, ricerca, conferma, report e attività amministrative.', 'Web app · Dati · Report'],
    ['Learning', 'Contenuti e community', 'Piattaforme in abbonamento per organizzare lezioni, contenuti esclusivi, membri e relazioni.', 'Membership · Contenuti · UX'],
  ],
};

const sameLegacyProject = (item: unknown[], legacy: [string, string, string, string]) =>
  legacy.every((value, index) => String(item[index] ?? '') === value);

const normalizeProjects = (locale: FlliLocale, storedProjects: unknown): FlliProjectItem[] => {
  const baseProjects = defaultFlliContent[locale].projects;
  if (!Array.isArray(storedProjects)) return cloneFlliContent(defaultFlliContent[locale]).projects;

  return storedProjects.map((rawItem, index) => {
    const item = Array.isArray(rawItem) ? rawItem : [];
    const base = baseProjects[index] || (['Projeto', 'Novo projeto', '', '', ''] as FlliProjectItem);
    const legacy = LEGACY_PROJECTS[locale][index];

    if (legacy && sameLegacyProject(item, legacy)) {
      return [...base] as FlliProjectItem;
    }

    return [
      String(item[0] ?? base[0] ?? ''),
      String(item[1] ?? base[1] ?? ''),
      String(item[2] ?? base[2] ?? ''),
      String(item[3] ?? base[3] ?? ''),
      String(item[4] ?? base[4] ?? ''),
    ];
  });
};

const mergeContent = (locale: FlliLocale, stored?: Partial<FlliContent>): FlliContent => {
  const base = cloneFlliContent(defaultFlliContent[locale]);
  if (!stored) return base;

  return {
    ...base,
    ...stored,
    nav: Array.isArray(stored.nav) ? [...stored.nav] : base.nav,
    navIds: base.navIds,
    proof: Array.isArray(stored.proof) ? [...stored.proof] : base.proof,
    services: Array.isArray(stored.services) ? stored.services.map((item) => [...item] as [string, string, string]) : base.services,
    projects: normalizeProjects(locale, stored.projects),
    process: Array.isArray(stored.process) ? stored.process.map((item) => [...item] as [string, string, string]) : base.process,
    media: {
      ...base.media,
      ...(stored.media || {}),
      projectImages: Array.isArray(stored.media?.projectImages)
        ? [...stored.media.projectImages]
        : base.media.projectImages,
    },
    form: {
      ...base.form,
      ...(stored.form || {}),
      services: Array.isArray(stored.form?.services) ? [...stored.form.services] : base.form.services,
    },
  };
};

export async function getFlliContent(locale: FlliLocale): Promise<FlliContent> {
  const snapshot = await getDoc(doc(db, COLLECTION, locale));
  if (!snapshot.exists()) return cloneFlliContent(defaultFlliContent[locale]);

  const data = snapshot.data();
  try {
    if (typeof data.contentJson === 'string') {
      return mergeContent(locale, JSON.parse(data.contentJson) as Partial<FlliContent>);
    }
  } catch (error) {
    console.warn(`Conteúdo F.LLI ${locale} inválido no Firestore.`, error);
  }

  return cloneFlliContent(defaultFlliContent[locale]);
}

export async function saveFlliContent(locale: FlliLocale, content: FlliContent, updatedBy: string): Promise<void> {
  // O Firestore não aceita arrays diretamente dentro de arrays. Como serviços,
  // projetos e processo usam tuplas, persistimos o conteúdo como JSON versionável.
  await setDoc(
    doc(db, COLLECTION, locale),
    {
      contentJson: JSON.stringify(content),
      updatedAt: serverTimestamp(),
      updatedBy,
    },
    { merge: true },
  );
}

export async function resetFlliContent(locale: FlliLocale, updatedBy: string): Promise<FlliContent> {
  const content = cloneFlliContent(defaultFlliContent[locale]);
  await saveFlliContent(locale, content, updatedBy);
  return content;
}
