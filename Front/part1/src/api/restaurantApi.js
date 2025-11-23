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
  create: (payload) =>
    apiFetch("/api/v1/restaurants", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
