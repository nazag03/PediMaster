// src/api.js
// Funciones temporales mientras no tengas el backend

export async function fetchCategories() {
  // Simulamos categorías (sin backend)
  return [
    { id: 1, name: "Minutas" },
    { id: 2, name: "Pastas" },
    { id: 3, name: "Guarniciones" },
  ];
}

export async function createFood(formData) {
  // Simulamos guardar datos
  console.log("📦 Enviando comida al backend simulado:", Object.fromEntries(formData));
  await new Promise((r) => setTimeout(r, 700)); // simula tiempo de red
  return { id: Math.floor(Math.random() * 1000), name: formData.get("name") };
}
