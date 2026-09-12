import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cloneFlliContent, defaultFlliContent, FlliContent, FlliLocale } from '@/content/flliContent';

const COLLECTION = 'flli_site_content';

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
    projects: Array.isArray(stored.projects) ? stored.projects.map((item) => [...item] as [string, string, string, string]) : base.projects,
    process: Array.isArray(stored.process) ? stored.process.map((item) => [...item] as [string, string, string]) : base.process,
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
  return mergeContent(locale, data.content as Partial<FlliContent> | undefined);
}

export async function saveFlliContent(locale: FlliLocale, content: FlliContent, updatedBy: string): Promise<void> {
  await setDoc(
    doc(db, COLLECTION, locale),
    {
      content,
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
