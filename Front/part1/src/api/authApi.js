// src/api/authApi.js
import { apiFetch } from "./apiClient";

export const authApi = {
  // login normal email + pass
  login: (email, password) =>
    apiFetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // login con Google: mismo endpoint y body que tu código funcional
  googleLogin: (idToken) =>
    apiFetch("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),

  register: (payload) =>
    apiFetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () =>
    apiFetch("/api/v1/auth/me", {
      method: "GET",
    }),
};

// exports nombrados para el AuthProvider "nuevo"
export const login = (email, password) => authApi.login(email, password);
export const googleLogin = (idToken) => authApi.googleLogin(idToken);
