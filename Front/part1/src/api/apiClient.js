// src/api/apiClient.js
import { API_BASE_URL } from "../config/apiConfig";
import { getStoredToken } from "../auth/tokenService";
import { NETWORK_ERROR_MESSAGE } from "../config/messages";

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const token = getStoredToken();
  console.log("🔐 getStoredToken() ->", token);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  console.log("🔐 Headers que se mandan:", headers);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    console.log("📡 Res status:", res.status, res.url);

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

    return data;
  } catch (err) {
    console.error("💥 apiFetch error:", err);
    if (!err.message) {
      err.message = NETWORK_ERROR_MESSAGE;
    }
    throw err;
  }
}
