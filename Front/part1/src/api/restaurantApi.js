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


const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "Rotisería Don Pepe",
    category: "Comida casera",
    address: "Av. Siempre Viva 123",
    rating: 4.8,
    reviewsCount: 324,
    etaMin: 20,
    etaMax: 35,
    minOrder: 2500,
    deliveryFee: 400,
    isOpen: true,
    promo: "2x1 en milanesas",
    distanceKm: 1.2,
  },
  {
    id: 2,
    name: "La Esquina de la Mila",
    category: "Milanesas · Papas",
    address: "Esquina San Martín y Rivadavia",
    rating: 4.6,
    reviewsCount: 187,
    etaMin: 25,
    etaMax: 40,
    minOrder: 3000,
    deliveryFee: 0,
    isOpen: true,
    promo: "Envío gratis desde $6000",
    distanceKm: 2.3,
  },
  {
    id: 3,
    name: "Pasta & Punto",
    category: "Pastas · Salsas",
    address: "Belgrano 456",
    rating: 4.9,
    reviewsCount: 98,
    etaMin: 30,
    etaMax: 45,
    minOrder: 3500,
    deliveryFee: 500,
    isOpen: true,
    promo: "Ravioles + bebida $5200",
    distanceKm: 3.1,
  },
  {
    id: 4,
    name: "Pollos El Rey",
    category: "Pollos al spiedo",
    address: "Ruta 9 km 5",
    rating: 4.4,
    reviewsCount: 210,
    etaMin: 35,
    etaMax: 55,
    minOrder: 2800,
    deliveryFee: 600,
    isOpen: false,
    promo: "Promo domingo familiar",
    distanceKm: 4.5,
  },
  {
    id: 5,
    name: "Empanadas La Tía Norma",
    category: "Empanadas · Tartas",
    address: "Mitre 742",
    rating: 4.7,
    reviewsCount: 452,
    etaMin: 15,
    etaMax: 30,
    minOrder: 2200,
    deliveryFee: 300,
    isOpen: true,
    promo: "Docena clásica $4800",
    distanceKm: 0.9,
  },
  {
    id: 6,
    name: "Burger del Barrio",
    category: "Hamburguesas",
    address: "Sarmiento 980",
    rating: 4.3,
    reviewsCount: 163,
    etaMin: 25,
    etaMax: 40,
    minOrder: 3200,
    deliveryFee: 500,
    isOpen: true,
    promo: "Combo doble + papas $5900",
    distanceKm: 2.7,
  },
  {
    id: 7,
    name: "Lo de Marta",
    category: "Platos del día",
    address: "Paso 77",
    rating: 4.5,
    reviewsCount: 89,
    etaMin: 20,
    etaMax: 35,
    minOrder: 2600,
    deliveryFee: 400,
    isOpen: false,
    promo: "Postre casero de regalo",
    distanceKm: 1.8,
  },
  {
    id: 8,
    name: "Veggie Rico",
    category: "Vegetariano · Vegano",
    address: "Castelli 332",
    rating: 4.9,
    reviewsCount: 142,
    etaMin: 30,
    etaMax: 45,
    minOrder: 3000,
    deliveryFee: 450,
    isOpen: true,
    promo: "10% off pagando en efectivo",
    distanceKm: 3.8,
  },
];

export async function fetchRestaurants() {
  // Simulamos un delay como si fuese una API real
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RESTAURANTS), 400);
  });
}