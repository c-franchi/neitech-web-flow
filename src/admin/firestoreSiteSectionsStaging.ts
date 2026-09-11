import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSection } from './SiteSections';

const COLLECTION = 'site_sections_staging';

export async function fetchSiteSectionsStaging(): Promise<SiteSection[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as SiteSection[];
}

export async function saveSiteSectionStaging(section: SiteSection): Promise<void> {
  const ref = doc(db, COLLECTION, section.id);
  await setDoc(ref, section, { merge: true });
}

export async function publishStagingToProduction(): Promise<void> {
  // Lê todos os docs de staging e salva na coleção de produção
  const staging = await fetchSiteSectionsStaging();
  for (const section of staging) {
    const prodRef = doc(db, 'site_sections', section.id);
    await setDoc(prodRef, section, { merge: true });
  }
}
