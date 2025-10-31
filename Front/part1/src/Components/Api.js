// src/api.js — Mock API (front-only)

// Helper: convertir File -> dataURL (base64)
function fileToDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

const _categories = [
  { id: 1, name: "Minutas" },
  { id: 2, name: "Carnes" },
  { id: 3, name: "Pastas" },
  { id: 4, name: "Guarniciones" },
];

export async function fetchCategories() {
  return _categories;
}

let _foods = [
  {
    id: 1,
    name: "Milanesa napolitana",
    price: 6500,
    category: { id: 1, name: "Minutas" },
    is_available: true,
    prep_time_minutes: 15,
    description: "",
    photo_url: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1200&auto=format&fit=crop", // demo
  },
  {
    id: 2,
    name: "Pollo al horno",
    price: 6000,
    category: { id: 2, name: "Carnes" },
    is_available: true,
    prep_time_minutes: 30,
    description: "",
    photo_url: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=1200&auto=format&fit=crop", // demo
  },
  {
    id: 3,
    name: "Ravioles",
    price: 5800,
    category: { id: 3, name: "Pastas" },
    is_available: true,
    prep_time_minutes: 12,
    description: "",
    photo_url: "", // demo
  },
];

// LISTAR
export async function fetchFoods() {
  return _foods.slice().sort((a, b) => b.id - a.id);
}

// CREAR (lee "photo" del FormData y la guarda como dataURL)
export async function createFood(formData) {
  await new Promise((r) => setTimeout(r, 300));

  const name = (formData.get("name") || "").trim();
  const description = (formData.get("description") || "").trim();
  const price = parseFloat(formData.get("price") || "0") || 0;
  const is_available = String(formData.get("is_available")) === "true";
  const prep = parseInt(formData.get("prep_time_minutes") || "0", 10) || 0;

  // categoría
  const catId = formData.get("category_id");
  let category = null;
  if (catId) {
    const found = _categories.find(c => c.id === Number(catId));
    if (found) category = { id: found.id, name: found.name };
  }

  // foto (File -> dataURL)
  let photo_url = null;
  const file = formData.get("photo");
  if (file && typeof file !== "string") {
    photo_url = await fileToDataURL(file);
  }

  const created = {
    id: Math.max(0, ..._foods.map(f => f.id)) + 1,
    name,
    description,
    price,
    category,
    is_available,
    prep_time_minutes: prep,
    photo_url, // <- queda embebida
  };

  _foods.push(created);
  return created;
}

// ELIMINAR
export async function deleteFood(id) {
  await new Promise((r) => setTimeout(r, 200));
  _foods = _foods.filter(f => f.id !== id);
  return { ok: true };
}

// (opcional)
export async function toggleFoodAvailability(id) {
  const idx = _foods.findIndex(f => f.id === id);
  if (idx >= 0) {
    _foods[idx].is_available = !_foods[idx].is_available;
    return { ok: true, item: _foods[idx] };
  }
  return { ok: false };
}
