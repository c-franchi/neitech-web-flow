import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSection } from './SiteSections';

const VERSIONS_COLLECTION = 'site_content_versions';

export async function saveSectionVersion(section: SiteSection, userId: string) {
  await addDoc(collection(db, VERSIONS_COLLECTION), {
    sectionId: section.id,
    content: section.content,
    updatedAt: Timestamp.now(),
    updatedBy: userId,
    label: section.label,
    name: section.name
  });
}

export async function fetchSectionVersions(sectionId: string) {
  const q = query(collection(db, VERSIONS_COLLECTION), where('sectionId', '==', sectionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}
