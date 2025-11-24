// src/api/apiClient.js
import { API_BASE_URL, AUTH_STORAGE_KEY } from "../config/apiConfig";

/**
 * Devuelve el token guardado en localStorage (si existe)
 */
function getToken() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Cliente genérico para llamar al backend
 * - agrega Authorization si hay JWT
 * - maneja JSON / text
 * - levanta errores con mensaje legible
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data;
  if (isJson) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" ? data : "Error en la petición");
    throw new Error(msg);
  }

  return data;
}
