/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("auth_admin");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
        } catch (err) {
        console.error("Error al leer auth_admin del localStorage:", err);
        }
    }
    setReady(true);
  }, []);

  const login = async (username, password) => {
    const U = import.meta.env.VITE_ADMIN_USER;
    const P = import.meta.env.VITE_ADMIN_PASS;
    if (username === U && password === P) {
      const payload = { username, role: "admin", ts: Date.now() };
      localStorage.setItem("auth_admin", JSON.stringify(payload));
      setUser(payload);
      return { ok: true };
    }
    return { ok: false, error: "Credenciales inválidas" };
  };

  const logout = () => {
    localStorage.removeItem("auth_admin"); // ← corregido
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
