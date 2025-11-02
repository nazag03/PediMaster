import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../lib/storage";

type Session = { user: { email: string } } | null;

type AuthCtx = {
  session: Session;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "session";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await storage.get<Session>(STORAGE_KEY);
        if (saved) setSession(saved);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock de login SIN backend (validamos no-vacío)
    if (!email.trim() || !password.trim()) {
      throw new Error("Completá email y contraseña.");
    }
    const fake = { user: { email: email.trim() } };
    setSession(fake);
    await storage.set(STORAGE_KEY, fake);
  };

  const logout = async () => {
    setSession(null);
    await storage.remove(STORAGE_KEY);
  };

  const value = useMemo(() => ({ session, loading, login, logout }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
