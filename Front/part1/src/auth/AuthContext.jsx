// src/auth/AuthContext.jsx
import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  ready: false,
  login: async () => ({ ok: false }),
  logout: () => {},
});
