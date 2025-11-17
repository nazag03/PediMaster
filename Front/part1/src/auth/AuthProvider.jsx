// src/auth/AuthProvider.jsx
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";

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
  const [user, setUser] = useState(null);   // { email, role, userId, token }
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

  // LOGIN → pega a tu API .NET
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
    // LOGIN CON GOOGLE
  // LOGIN CON GOOGLE
const loginWithGoogle = async () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log("CLIENT ID FRONT:", clientId);
  console.log("ORIGIN FRONT:", window.location.origin);

  if (!window.google || !window.google.accounts || !clientId) {
    console.log("⚠️ Google no está listo o falta clientId");
    return { ok: false, error: "Google no está disponible" };
  }

  return new Promise((resolve) => {
    console.log("🟡 Inicializando Google Identity...");
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        console.log("✅ CALLBACK de Google ejecutado. Response:", response);

        try {
          const idToken = response?.credential;
          console.log(
            "🔑 ID TOKEN (primeros 40 chars):",
            idToken ? idToken.slice(0, 40) + "..." : "NULL"
          );

          if (!idToken) {
            resolve({ ok: false, error: "Google no devolvió credencial" });
            return;
          }

          console.log("📤 Enviando token al back:", `${API_BASE_URL}/api/v1/auth/google`);
          const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          console.log("📥 Respuesta del back:", res.status);

          if (!res.ok) {
            const text = await res.text();
            console.log("❌ Error desde el back:", text);
            resolve({
              ok: false,
              error: text || "Error iniciando sesión con Google",
            });
            return;
          }

          const data = await res.json();
          const jwt = data.jwtToken ?? data.JwtToken;
          console.log("🧾 JWT recibido (primeros 40 chars):", jwt?.slice(0, 40) + "...");

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

          resolve({ ok: true });
        } catch (err) {
          console.error("💥 Error en callback de Google:", err);
          resolve({ ok: false, error: "No se pudo procesar Google Login" });
        }
      },
    });

    console.log("🟠 Llamando a google.accounts.id.prompt()...");
    window.google.accounts.id.prompt();
  });
};



  return (
    <AuthContext.Provider value={{ user, ready, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
);

}


