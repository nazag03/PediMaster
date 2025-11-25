// src/api/restaurantApi.js
import { apiFetch } from "./apiClient";

export const restaurantApi = {
  getAll: () =>
    apiFetch("/api/v1/restaurants", {
      method: "GET",
    }),

  getById: (id) =>
    apiFetch(`/api/v1/restaurants/${id}`, {
      method: "GET",
    }),

  // Solo SuperAdmin, coincide con tu RestaurantController
  create: (payload, token) =>
    apiFetch("/api/v1/restaurants", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    }),
};
