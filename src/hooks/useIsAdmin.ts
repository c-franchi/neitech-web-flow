// src/hooks/useIsAdmin.ts
import { useState, useEffect } from 'react';

const AUTH_KEY = 'nyv8_admin_auth';

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(localStorage.getItem(AUTH_KEY) === 'true');
    const onStorage = () => setIsAdmin(localStorage.getItem(AUTH_KEY) === 'true');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return isAdmin;
}
