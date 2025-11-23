// src/api/apiClient.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5117";

// 👇 Usar la misma key que en AuthProvider
const STORAGE_KEY = "pm_auth_token";

/**
 * Devuelve el token guardado en localStorage (si existe)
 */
function getToken() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Wrapper genérico para llamadas a la API
 * @param {string} path - path relativo, ej: "/api/v1/restaurants"
 * @param {RequestInit} options - opciones fetch
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Si expira sesión o no autorizado
  if (res.status === 401 || res.status === 403) {
    // Acá podrías disparar un evento o limpiar storage si querés
    // pero el logout "oficial" lo maneja AuthProvider
    throw new Error("No autorizado. Iniciá sesión de nuevo.");
  }

  let data;
  const contentType = res.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    // Intentar leer mensaje de error del backend
    const msg =
      (data && data.message) ||
      (typeof data === "string" ? data : "Error en la petición");
    throw new Error(msg);
  }

  return data;
}
