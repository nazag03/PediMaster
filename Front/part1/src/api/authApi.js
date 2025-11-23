// src/api/authApi.js
import { apiFetch } from "./apiClient";

export const authApi = {
  login: (email, password) =>
    apiFetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (payload) =>
    apiFetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Si tuvieras endpoint para obtener perfil
  me: () => apiFetch("/api/v1/auth/me", { method: "GET" }),
};
