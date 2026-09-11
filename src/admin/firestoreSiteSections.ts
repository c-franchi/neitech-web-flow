import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSection } from './SiteSections';

const COLLECTION = 'site_sections';

export async function fetchSiteSections(): Promise<SiteSection[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as SiteSection[];
}

export async function fetchSiteSection(id: string): Promise<SiteSection | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as SiteSection) : null;
}

export async function saveSiteSection(section: SiteSection): Promise<void> {
  const ref = doc(db, COLLECTION, section.id);
  await setDoc(ref, section, { merge: true });
}

export async function updateSiteSection(id: string, content: Record<string, any>, updatedBy: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    content,
    updatedAt: new Date(),
    updatedBy
  });
}
