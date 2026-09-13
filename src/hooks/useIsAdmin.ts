// src/hooks/useIsAdmin.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ADMIN_EMAILS = ['neifranchi@gmail.com', 'quartetokids.contato@gmail.com'];

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      const email = user?.email?.toLowerCase() || '';
      setIsAdmin(Boolean(email && ADMIN_EMAILS.includes(email)));
    });

    return () => unsubscribe();
  }, []);

  return isAdmin;
}
