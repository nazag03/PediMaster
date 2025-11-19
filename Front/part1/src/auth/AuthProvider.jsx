// src/auth/AuthProvider.jsx
import { useEffect, useState, useCallback } from "react";
import { AuthContext} from "./AuthContext.jsx";

const STORAGE_KEY = "pm_auth_token";
const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5117";

// helper para leer el JWT
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, role, userId, token }
  const [ready, setReady] = useState(false);

  // Cargar sesión guardada al montar
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      setReady(true);
      return;
    }

    const payload = parseJwt(token);
    if (!payload) {
      localStorage.removeItem(STORAGE_KEY);
      setReady(true);
      return;
    }

    const email =
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] ||
      payload.email ||
      null;

    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role ||
      null;

    const userId = payload["userId"] || null;

    setUser({ email, role, userId, token });
    setReady(true);
  }, []);

  // ---------- LOGIN NORMAL (email + pass) ----------
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        return { ok: false, error: text || "Credenciales inválidas" };
      }

      const data = await res.json();
      const jwt = data.jwtToken ?? data.JwtToken;
      if (!jwt) {
        return { ok: false, error: "El servidor no devolvió un token" };
      }

      localStorage.setItem(STORAGE_KEY, jwt);

      const payload = parseJwt(jwt);
      const emailClaim =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ] ||
        payload.email ||
        null;

      const role =
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        payload.role ||
        null;

      const userId = payload["userId"] || null;

      setUser({ email: emailClaim, role, userId, token: jwt });
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false, error: "No se pudo conectar al servidor" };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  // ---------- CALLBACK QUE USA GOOGLE (credential → back → setUser) ----------
  const handleGoogleCredential = useCallback(
    async (response) => {
      console.log("🟢 CALLBACK DE GOOGLE EJECUTADO:", response);

      try {
        const idToken = response?.credential;
        console.log(
          "🔑 ID TOKEN (primeros 40 chars):",
          idToken ? idToken.slice(0, 40) + "..." : "NULL"
        );

        if (!idToken) {
          console.log("⚠️ Google no devolvió credential");
          return;
        }

        const url = `${API_BASE_URL}/api/v1/auth/google`;
        console.log("📤 Enviando token al back:", url);

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        console.log("📥 Respuesta del back (status):", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.log("❌ Error desde el back:", text);
          return;
        }

        const data = await res.json();
        const jwt = data.jwtToken ?? data.JwtToken;
        console.log(
          "🧾 JWT recibido (primeros 40 chars):",
          jwt?.slice(0, 40) + "..."
        );

        localStorage.setItem(STORAGE_KEY, jwt);

        const payload = parseJwt(jwt);

        const email =
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ] ||
          payload.email ||
          null;

        const role =
          payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ||
          payload.role ||
          null;

        const userId = payload["userId"] || null;

        setUser({ email, role, userId, token: jwt });
      } catch (err) {
        console.error("💥 Error en callback de Google:", err);
      }
    },
    [setUser]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        login,
        logout,
        handleGoogleCredential, // 👈 lo usás en Login.jsx para renderButton
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
