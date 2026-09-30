import { createContext, useContext } from 'react';
import type { Session } from '@supabase/supabase-js';

interface AuthContextValue {
  session: Session;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}