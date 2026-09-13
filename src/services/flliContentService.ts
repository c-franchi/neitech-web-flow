import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cloneFlliContent, defaultFlliContent, FlliContent, FlliLocale, FlliProjectItem } from '@/content/flliContent';

const COLLECTION = 'flli_site_content';

const PROJECTS_CONTENT_VERSION = 2;

// Títulos que já foram usados nas versões anteriores do portfólio. Quando um
// desses valores ainda estiver salvo no Firestore, substituímos apenas o texto
// do card pelo projeto atual correspondente. As imagens permanecem em media.projectImages.
const LEGACY_PROJECT_TITLES: Record<FlliLocale, string[][]> = {
  br: [
    ['Venda, pagamento e logística', 'Quarteto Kids'],
    ['Presença e gestão de eventos', 'Reuniões CCB'],
    ['Conteúdo e comunidade', 'Clube da Tia Mary'],
  ],
  it: [
    ['Vendita, pagamento e logistica', 'Quarteto Kids'],
    ['Presenze e gestione eventi', 'Reuniões CCB'],
    ['Contenuti e community', 'Clube da Tia Mary'],
  ],
};

const LEGACY_PROJECT_CATEGORIES = ['Commerce', 'Operations', 'Learning'];

const shouldMigrateProject = (locale: FlliLocale, item: unknown[], index: number) => {
  const title = String(item[1] ?? '').trim();
  const category = String(item[0] ?? '').trim();
  const knownTitles = LEGACY_PROJECT_TITLES[locale][index] || [];

  // Título conhecido de uma versão anterior.
  if (knownTitles.includes(title)) return true;

  // Estrutura genérica inicial do portfólio, caso algum texto tenha sido salvo
  // com pequenas alterações na descrição/tags.
  return category === LEGACY_PROJECT_CATEGORIES[index] && index < 3;
};

const normalizeProjects = (locale: FlliLocale, storedProjects: unknown): FlliProjectItem[] => {
  const baseProjects = defaultFlliContent[locale].projects;
  if (!Array.isArray(storedProjects)) return cloneFlliContent(defaultFlliContent[locale]).projects;

  return storedProjects.map((rawItem, index) => {
    const item = Array.isArray(rawItem) ? rawItem : [];
    const base = baseProjects[index] || (['Projeto', 'Novo projeto', '', '', ''] as FlliProjectItem);

    if (index < baseProjects.length && shouldMigrateProject(locale, item, index)) {
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
      const parsed = JSON.parse(data.contentJson) as Partial<FlliContent> & { projectsContentVersion?: number };

      // Migration: projectsContentVersion
      if ((parsed.projectsContentVersion || 0) < PROJECTS_CONTENT_VERSION) {
        // preserve existing document fields, but replace only `projects` with defaults
        const existing = parsed;
        const base = cloneFlliContent(defaultFlliContent[locale]);

        const migrated: Partial<FlliContent> = {
          ...existing,
          // preserve media entirely
          media: existing.media || base.media,
          projects: base.projects,
        };

        // write back migrated document: update contentJson and projectsContentVersion
        try {
          await setDoc(
            doc(db, COLLECTION, locale),
            {
              contentJson: JSON.stringify({ ...migrated }),
              projectsContentVersion: PROJECTS_CONTENT_VERSION,
              migratedAt: serverTimestamp(),
            },
            { merge: true },
          );
          console.info(`F.LLI: projetos ${locale} migrados para versão ${PROJECTS_CONTENT_VERSION}`);
        } catch (writeErr) {
          console.error('F.LLI: falha ao gravar migração de projetos', writeErr);
        }

        // Append a cache-busting query param based on document timestamps so
        // freshly uploaded images are requested by browsers after admin updates.
        const mergedAfterMigration = mergeContent(locale, migrated as Partial<FlliContent>);
        const cbTimestamp = (() => {
          const ts = (data as any).updatedAt ?? (data as any).migratedAt;
          if (ts && typeof ts.toMillis === 'function') return String(ts.toMillis());
          return String(Date.now());
        })();

        const appendVersion = (url: string | undefined) => {
          if (!url) return '';
          try {
            // preserve existing querystrings
            return url + (url.includes('?') ? '&' : '?') + 'v=' + cbTimestamp;
          } catch (e) {
            return url;
          }
        };

        mergedAfterMigration.media = {
          ...mergedAfterMigration.media,
          heroImageUrl: appendVersion(mergedAfterMigration.media.heroImageUrl),
          heroMobileImageUrl: appendVersion(mergedAfterMigration.media.heroMobileImageUrl),
          projectImages: Array.isArray(mergedAfterMigration.media.projectImages)
            ? mergedAfterMigration.media.projectImages.map((u) => appendVersion(u))
            : mergedAfterMigration.media.projectImages,
        };

        return mergedAfterMigration;
      }

      // Merge stored content with defaults, then attach cache-busting to images
      const merged = mergeContent(locale, parsed as Partial<FlliContent>);
      const cbTimestamp = (() => {
        const ts = (data as any).updatedAt ?? (data as any).migratedAt;
        if (ts && typeof ts.toMillis === 'function') return String(ts.toMillis());
        return String(Date.now());
      })();

      const appendVersion = (url: string | undefined) => {
        if (!url) return '';
        try {
          return url + (url.includes('?') ? '&' : '?') + 'v=' + cbTimestamp;
        } catch (e) {
          return url;
        }
      };

      merged.media = {
        ...merged.media,
        heroImageUrl: appendVersion(merged.media.heroImageUrl),
        heroMobileImageUrl: appendVersion(merged.media.heroMobileImageUrl),
        projectImages: Array.isArray(merged.media.projectImages)
          ? merged.media.projectImages.map((u) => appendVersion(u))
          : merged.media.projectImages,
      };

      return merged;
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
