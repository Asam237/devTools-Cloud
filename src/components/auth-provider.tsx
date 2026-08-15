"use client";

import { authBackend, type AuthUser } from "@/lib/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  isConfigured: authBackend.isConfigured,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: authBackend.isConfigured,
    isConfigured: authBackend.isConfigured,
  });

  useEffect(() => {
    const unsubscribe = authBackend.subscribe((user) => {
      setState({ user, loading: false, isConfigured: authBackend.isConfigured });
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
