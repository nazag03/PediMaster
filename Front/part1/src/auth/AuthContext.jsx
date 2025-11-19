// src/auth/AuthContext.jsx
import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: null,
  ready: false,
  login: async () => ({ ok: false }),
  logout: () => {},
});

// Este es el hook que te permite usar el contexto desde cualquier componente
export function useAuth() {
  return useContext(AuthContext);
}
