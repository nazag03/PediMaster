// src/auth/AuthProvider.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { API_BASE_URL } from "../config/apiConfig";
import { NETWORK_ERROR_MESSAGE } from "../config/messages";
import {
  clearStoredToken,
  getMsUntilExpiration,
  getStoredToken,
  parseUserFromToken,
  saveToken,
} from "./tokenService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, role, userId, token, exp }
  const [ready, setReady] = useState(false);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  // Cargar sesión guardada al montar
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setReady(true);
      return;
    }

    const parsedUser = parseUserFromToken(token);
    if (!parsedUser) {
      clearStoredToken();
      setReady(true);
      return;
    }

    setUser(parsedUser);
    setReady(true);
  }, []);

  // Limpieza automática cuando expira el token
  useEffect(() => {
    if (!user?.exp) return;

    const msUntilExp = getMsUntilExpiration(user.exp);
    if (msUntilExp === 0) {
      logout();
      return undefined;
    }

    const timer = setTimeout(() => {
      logout();
    }, msUntilExp);

    return () => clearTimeout(timer);
  }, [logout, user?.exp]);

  const handleSessionFromToken = (jwt) => {
    const parsedUser = parseUserFromToken(jwt);
    if (!parsedUser) {
      clearStoredToken();
      return { ok: false, message: "Sesión inválida o expirada." };
    }

    saveToken(jwt);
    setUser(parsedUser);
    return { ok: true, user: parsedUser };
  };

  // ---------- LOGIN NORMAL (email + pass) ----------
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        return { ok: false, message: text || "Credenciales inválidas" };
      }

      const data = await res.json();
      const jwt = data.jwtToken ?? data.JwtToken;
      if (!jwt) {
        return { ok: false, message: "El servidor no devolvió un token" };
      }

      return handleSessionFromToken(jwt);
    } catch (err) {
      console.error(err);
      return { ok: false, message: NETWORK_ERROR_MESSAGE };
    }
  };

  // ---------- REGISTRO (crea y loguea) ----------
  const register = async (email, password, username) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userName: username }),
      });

      if (!res.ok) {
        const text = await res.text();
        return {
          ok: false,
          message: text || "No se pudo crear la cuenta",
        };
      }

      // Al crear, el back no devuelve token. Intentamos loguear con las mismas credenciales.
      const loginResult = await login(email, password);
      if (loginResult?.ok) return { ...loginResult, registered: true };

      return {
        ok: true,
        message: "Cuenta creada. Iniciá sesión con tus datos.",
      };
    } catch (err) {
      console.error(err);
      return { ok: false, message: NETWORK_ERROR_MESSAGE };
    }
  };

  // ---------- CALLBACK QUE USA GOOGLE (credential → back → setUser) ----------
  const handleGoogleCredential = useCallback(
    async (response) => {
      try {
        const idToken = response?.credential;

        if (!idToken) {
          return { ok: false, message: "Google no devolvió credenciales" };
        }

        const url = `${API_BASE_URL}/api/v1/auth/google`;
        const res = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (!res.ok) {
          const text = await res.text();
          return { ok: false, message: text || "No se pudo validar la cuenta" };
        }

        const data = await res.json();
        const jwt = data.jwtToken ?? data.JwtToken;

        if (!jwt) {
          return { ok: false, message: "El servidor no devolvió un token" };
        }

        return handleSessionFromToken(jwt);
      } catch (err) {
        console.error("💥 Error en callback de Google:", err);
        return { ok: false, message: NETWORK_ERROR_MESSAGE };
      }
    },
    [logout]
  );

  const getAuthToken = useCallback(() => user?.token ?? getStoredToken(), [user]);

  const contextValue = useMemo(
    () => ({
      user,
      ready,
      login,
      register,
      logout,
      handleGoogleCredential, // 👈 lo usás en Login.jsx
      getAuthToken,
    }),
    [getAuthToken, handleGoogleCredential, login, logout, ready, user]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// para que el import default de main.jsx funcione:
export default AuthProvider;
