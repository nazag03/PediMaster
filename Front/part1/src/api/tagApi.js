// src/api/tagApi.js
import { apiFetch } from "./apiClient";

export const tagApi = {
  getAll: () =>
    apiFetch("/api/v1/tags", {
      method: "GET",
    }),

  getByRestaurant: (restaurantId) =>
    apiFetch(`/api/v1/tags/restaurant/${restaurantId}`, {
      method: "GET",
    }),

  create: (payload) =>
    apiFetch("/api/v1/tags", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiFetch(`/api/v1/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    apiFetch(`/api/v1/tags/${id}`, {
      method: "DELETE",
    }),
};
