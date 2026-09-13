import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cloneFlliContent, defaultFlliContent, FlliContent, FlliLocale } from '@/content/flliContent';

const COLLECTION = 'flli_site_content';

const PROJECTS_CONTENT_VERSION = 2;

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
    projects: Array.isArray(stored.projects) ? stored.projects.map((item) => [...item] as [string, string, string, string, string]) : base.projects,
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

        return mergeContent(locale, migrated as Partial<FlliContent>);
      }

      return mergeContent(locale, parsed as Partial<FlliContent>);
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
