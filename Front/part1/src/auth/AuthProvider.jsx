// src/auth/AuthProvider.jsx
import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { API_BASE_URL, AUTH_STORAGE_KEY } from "../config/apiConfig";

/**
 * Decodifica el payload de un JWT (sin validar firma, solo lectura)
 */
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getStoredToken() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeToken(token) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
  } catch {
    // ignore
  }
}

function clearToken() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Convierte el JWT en un objeto user usable en el front
 * asumiendo que el backend mete roles y demás en claims
 */
function userFromToken(token) {
  const payload = parseJwt(token);
  if (!payload) return null;

  // Ajustá estos nombres según los claims de tu JWT
  const rolesClaim = payload.roles || payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  const roles = Array.isArray(rolesClaim)
    ? rolesClaim
    : rolesClaim
    ? [rolesClaim]
    : [];

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    roles,
    raw: payload,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Cargar sesión al iniciar
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      const u = userFromToken(token);
      if (u) {
        setUser(u);
      } else {
        clearToken();
      }
    }
    setReady(true);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || "Error al iniciar sesión";
        return { ok: false, message: msg };
      }

      const token = data.jwtToken || data.token || data.accessToken;
      if (!token) {
        return { ok: false, message: "El backend no devolvió un token" };
      }

      storeToken(token);
      const u = userFromToken(token);
      setUser(u);

      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, message: err.message || "Error de red" };
    }
  }, []);

  const handleGoogleCredential = useCallback(async (response) => {
    try {
      const idToken = response?.credential;

      const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || "Error en login con Google";
        return { ok: false, message: msg };
      }

      const token = data.jwtToken || data.token || data.accessToken;
      if (!token) {
        return { ok: false, message: "El backend no devolvió un token" };
      }

      storeToken(token);
      const u = userFromToken(token);
      setUser(u);

      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, message: err.message || "Error de red" };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        login,
        logout,
        handleGoogleCredential,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
