// src/api/apiClient.js
import { API_BASE_URL } from "../config/apiConfig";

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const error = new Error(
      (data && (data.message || data.error)) ||
        text ||
        `HTTP ${res.status}`
    );
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data; // IMPORTANTE: devolvemos el JSON directamente (no { data })
}

export default apiFetch;
