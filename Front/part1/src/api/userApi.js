// src/api/userApi.js
import { apiFetch } from "./apiClient";

export const userApi = {
  getAll: () =>
    apiFetch("/api/v1/users", {
      method: "GET",
    }),

  getById: (id) =>
    apiFetch(`/api/v1/users/${id}`, {
      method: "GET",
    }),

  create: (payload) =>
    apiFetch("/api/v1/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiFetch(`/api/v1/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    apiFetch(`/api/v1/users/${id}`, {
      method: "DELETE",
    }),
};
