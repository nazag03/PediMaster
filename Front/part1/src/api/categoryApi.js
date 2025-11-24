// src/api/categoryApi.js
import { apiFetch } from "./apiClient";

export const categoryApi = {
  getAll: () =>
    apiFetch("/api/v1/categories", {
      method: "GET",
    }),

  getById: (id) =>
    apiFetch(`/api/v1/categories/${id}`, {
      method: "GET",
    }),

  create: (payload) =>
    apiFetch("/api/v1/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiFetch(`/api/v1/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    apiFetch(`/api/v1/categories/${id}`, {
      method: "DELETE",
    }),
};
